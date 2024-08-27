'use client';

import { useFocusingTask } from '@/stores/Tasks';

export default function FocusingTask() {
  const focusingTask = useFocusingTask();

  if (focusingTask) {
    return <div>Focusing on: {focusingTask.name}</div>;
  }

  return <div>Click on task to focus on it</div>;
}
