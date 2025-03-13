export type LiveActivityParams = {
  time: string;
  mode: string;
};

export type StartLiveActivityFn = (
  params: LiveActivityParams,
) => Promise<{ activityId: string }>;

export type StopLiveActivityFn = () => Promise<void>;

export type IsLiveActivityRunningFn = () => boolean;
