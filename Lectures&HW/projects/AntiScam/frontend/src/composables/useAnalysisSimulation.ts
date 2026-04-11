import { ref } from 'vue';

export function useAnalysisSimulation() {
  const steps = ref<string[]>([]);
  const currentStep = ref(0);
  const isDone = ref(false);

  const stepLabels = [
    'Сопоставляем работы с пробегом',
    'Проверяем типовую срочность',
    'Готовим короткие объяснения',
  ];

  let timeouts: ReturnType<typeof setTimeout>[] = [];

  function start() {
    steps.value = [];
    currentStep.value = 0;
    isDone.value = false;

    stepLabels.forEach((label, i) => {
      const t = setTimeout(() => {
        steps.value.push(label);
        currentStep.value = i + 1;
      }, (i + 1) * 1200);
      timeouts.push(t);
    });

    const doneTimeout = setTimeout(() => {
      isDone.value = true;
    }, 4000);
    timeouts.push(doneTimeout);
  }

  function reset() {
    timeouts.forEach(clearTimeout);
    timeouts = [];
    steps.value = [];
    currentStep.value = 0;
    isDone.value = false;
  }

  return { steps, currentStep, isDone, stepLabels, start, reset };
}
