import { ref } from 'vue';

export type UploadPhase = 'idle' | 'selected' | 'uploading' | 'analyzing' | 'success';

export function useUploadSimulation() {
  const phase = ref<UploadPhase>('idle');
  const progress = ref(0);
  const fileName = ref('');

  let uploadInterval: ReturnType<typeof setInterval> | null = null;

  function selectFile(name: string) {
    fileName.value = name;
    phase.value = 'selected';
    progress.value = 0;
  }

  function startUpload() {
    if (phase.value !== 'selected') return;

    phase.value = 'uploading';
    progress.value = 0;

    uploadInterval = setInterval(() => {
      progress.value += 5;
      if (progress.value >= 100) {
        if (uploadInterval) clearInterval(uploadInterval);
        uploadInterval = null;
        progress.value = 100;
        phase.value = 'analyzing';

        setTimeout(() => {
          phase.value = 'success';
        }, 2000);
      }
    }, 100);
  }

  function reset() {
    if (uploadInterval) clearInterval(uploadInterval);
    uploadInterval = null;
    phase.value = 'idle';
    progress.value = 0;
    fileName.value = '';
  }

  return { phase, progress, fileName, selectFile, startUpload, reset };
}
