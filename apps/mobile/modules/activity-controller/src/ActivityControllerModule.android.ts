export const startLiveActivity: types.StartLiveActivityFn = async () => {
  return Promise.resolve({ activityId: '' });
};

export const updateLiveActivity: types.UpdateLiveActivityFn = async () => {
  return Promise.resolve();
};

export const stopLiveActivity: types.StopLiveActivityFn = async () => {
  return;
};

export const isActivityRunning: types.IsLiveActivityRunningFn = () => {
  return false;
};

export const areLiveActivitiesEnabled: boolean = false;
