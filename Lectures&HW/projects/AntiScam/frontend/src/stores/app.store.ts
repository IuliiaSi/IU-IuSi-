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

export interface AppState {
  auth: {
    phone: string;
    code: string;
    verified: boolean;
    codeSent: boolean;
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
  paywallVisible: boolean;
}

function createInitialState(): AppState {
  return {
    auth: {
      phone: '',
      code: '',
      verified: false,
      codeSent: false,
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
  },

  actions: {
    setPhone(phone: string) {
      this.auth.phone = phone;
    },

    setCode(code: string) {
      this.auth.code = code;
    },

    sendCode() {
      this.auth.codeSent = true;
    },

    verifyCode(): boolean {
      if (this.auth.code.length === 4) {
        this.auth.verified = true;
        return true;
      }
      return false;
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

    showPaywall() {
      this.paywallVisible = true;
    },

    hidePaywall() {
      this.paywallVisible = false;
    },

    reset() {
      Object.assign(this, createInitialState());
    },
  },
});
