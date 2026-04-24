import { defineStore } from 'pinia';

export interface JobResult {
  name: string;
  chip: string;
  explanation: string;
}

export interface PriorityGroup {
  name: string;
  description: string;
  items: JobResult[];
}

export interface EntryRecord {
  id: number;
  user_id: string;
  user_input: string;
  ai_response: string;
  created_at: string;
}

export interface AppState {
  auth: {
    email: string;
    verified: boolean;
    accessToken: string | null;
    refreshToken: string | null;
  };
  access: {
    paid: boolean;
    role: 'user' | 'admin';
    loaded: boolean;
  };
  car: {
    brand: string;
    model: string;
    year: string;
    mileage: string;
  };
  inputMethod: 'manual' | 'upload' | 'sample' | null;
  selectedJobs: string[];
  customJobs: string[];
  upload: {
    fileName: string;
    phase: 'idle' | 'selected' | 'uploading' | 'analyzing' | 'success';
    progress: number;
  };
  result: {
    groups: PriorityGroup[];
    summary: string;
  } | null;
  entries: EntryRecord[];
  paywallVisible: boolean;
}

const AUTH_STORAGE_KEY = 'antiscam_auth_session';

function createInitialState(): AppState {
  return {
    auth: {
      email: '',
      verified: false,
      accessToken: null,
      refreshToken: null,
    },
    access: {
      paid: false,
      role: 'user',
      loaded: false,
    },
    car: {
      brand: '',
      model: '',
      year: '',
      mileage: '',
    },
    inputMethod: null,
    selectedJobs: [],
    customJobs: [],
    upload: {
      fileName: '',
      phase: 'idle',
      progress: 0,
    },
    result: null,
    entries: [],
    paywallVisible: false,
  };
}

export const useAppStore = defineStore('app', {
  state: (): AppState => createInitialState(),

  getters: {
    allSelectedJobs: (state): string[] => [...state.selectedJobs, ...state.customJobs],

    isCarValid: (state): boolean => {
      const { brand, model, year, mileage } = state.car;
      return (
        brand.length > 0 &&
        model.length > 0 &&
        /^\d{4}$/.test(year) &&
        parseInt(mileage) > 0
      );
    },

    selectedJobCount: (state): number => state.selectedJobs.length + state.customJobs.length,
    isAuthenticated: (state): boolean =>
      Boolean(state.auth.verified && state.auth.accessToken && state.auth.refreshToken),
    hasPaidAccess: (state): boolean => Boolean(state.access.paid),
    isAdmin: (state): boolean => state.access.role === 'admin',
  },

  actions: {
    setEmail(email: string) {
      this.auth.email = email;
    },

    setAuthSession(payload: {
      email: string;
      accessToken: string;
      refreshToken: string;
    }) {
      this.auth.email = payload.email;
      this.auth.accessToken = payload.accessToken;
      this.auth.refreshToken = payload.refreshToken;
      this.auth.verified = true;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
      }
    },

    hydrateAuthSession() {
      if (typeof window === 'undefined') return;
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return;

      try {
        const parsed = JSON.parse(raw) as {
          email: string;
          accessToken: string;
          refreshToken: string;
        };

        if (parsed.accessToken && parsed.refreshToken) {
          this.setAuthSession(parsed);
        }
      } catch {
        this.clearAuthSession();
      }
    },

    clearAuthSession() {
      this.auth.email = '';
      this.auth.accessToken = null;
      this.auth.refreshToken = null;
      this.auth.verified = false;
      this.access.paid = false;
      this.access.role = 'user';
      this.access.loaded = false;
      this.entries = [];
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },

    authHeaders(): Record<string, string> {
      const token = this.auth.accessToken;
      if (!token) {
        return {};
      }

      return {
        Authorization: `Bearer ${token}`,
      };
    },

    async fetchCurrentUser() {
      if (!this.auth.accessToken) return null;

      const response = await fetch('/api/auth/me', {
        headers: {
          ...this.authHeaders(),
        },
      });

      if (!response.ok) {
        this.clearAuthSession();
        return null;
      }

      const data = await response.json();
      this.auth.email = data.email || this.auth.email;
      this.auth.verified = true;
      await this.fetchAccessStatus();
      return data;
    },

    async fetchAccessStatus() {
      if (!this.auth.accessToken) {
        this.access.paid = false;
        this.access.role = 'user';
        this.access.loaded = true;
        return null;
      }

      const response = await fetch('/api/access/me', {
        headers: {
          ...this.authHeaders(),
        },
      });

      if (!response.ok) {
        this.access.paid = false;
        this.access.role = 'user';
        this.access.loaded = true;
        return null;
      }

      const data = await response.json();
      this.access.paid = Boolean(data?.paid);
      this.access.role = data?.role === 'admin' ? 'admin' : 'user';
      this.access.loaded = true;
      return data;
    },

    async logout() {
      if (this.auth.accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            ...this.authHeaders(),
          },
        });
      }

      this.clearAuthSession();
    },

    async saveEntry(payload: { userInput: string; aiResponse: string }) {
      if (!this.auth.accessToken) return null;

      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.authHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) return null;
      const entry = (await response.json()) as EntryRecord;
      this.entries = [entry, ...this.entries];
      return entry;
    },

    async fetchEntries() {
      if (!this.auth.accessToken) {
        this.entries = [];
        return [];
      }

      const response = await fetch('/api/entries', {
        headers: {
          ...this.authHeaders(),
        },
      });

      if (!response.ok) {
        this.entries = [];
        return [];
      }

      const data = (await response.json()) as EntryRecord[];
      this.entries = data;
      return data;
    },

    setCar(field: string, value: string) {
      if (field in this.car) {
        (this.car as Record<string, string>)[field] = value;
      }
    },

    setInputMethod(method: 'manual' | 'upload' | 'sample' | null) {
      this.inputMethod = method;
    },

    toggleJob(jobName: string) {
      const idx = this.selectedJobs.indexOf(jobName);
      if (idx >= 0) {
        this.selectedJobs.splice(idx, 1);
      } else {
        this.selectedJobs.push(jobName);
      }
    },

    addCustomJob(jobName: string) {
      if (jobName.trim() && !this.customJobs.includes(jobName.trim())) {
        this.customJobs.push(jobName.trim());
      }
    },

    removeCustomJob(jobName: string) {
      const idx = this.customJobs.indexOf(jobName);
      if (idx >= 0) {
        this.customJobs.splice(idx, 1);
      }
    },

    setUploadFile(fileName: string) {
      this.upload.fileName = fileName;
      this.upload.phase = 'selected';
    },

    setUploadPhase(phase: AppState['upload']['phase']) {
      this.upload.phase = phase;
    },

    setUploadProgress(progress: number) {
      this.upload.progress = progress;
    },

    setResult(result: AppState['result']) {
      this.result = result;
    },

    setEntries(entries: EntryRecord[]) {
      this.entries = entries;
    },

    showPaywall() {
      this.paywallVisible = true;
    },

    hidePaywall() {
      this.paywallVisible = false;
    },

    reset() {
      const currentAuth = { ...this.auth };
      Object.assign(this, createInitialState());
      this.auth = currentAuth;
    },
  },
});
