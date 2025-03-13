export const startLiveActivity: types.StartLiveActivityFn = async () => {
  return Promise.resolve({ activityId: '' });
};

export const stopLiveActivity: types.StopLiveActivityFn = async () => {
  return;
};

export const isLiveActivityRunning: types.IsLiveActivityRunningFn = () => {
  return false;
};

export const areLiveActivitiesEnabled: boolean = false;
