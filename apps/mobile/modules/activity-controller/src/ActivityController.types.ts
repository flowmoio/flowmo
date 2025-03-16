export type LiveActivityParams = {
  status: string;
  mode: string;
  totalTime: number;
  startTime: number;
  endTime: number;
};

export type StartLiveActivityFn = (
  params: LiveActivityParams,
) => Promise<{ activityId: string }>;

export type UpdateLiveActivityFn = (
  params: LiveActivityParams,
) => Promise<void>;

export type StopLiveActivityFn = () => Promise<void>;

export type IsActivityRunningFn = () => boolean;
