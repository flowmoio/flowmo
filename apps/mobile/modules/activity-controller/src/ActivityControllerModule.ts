import { requireNativeModule } from 'expo';
import * as types from './ActivityController.types';

const nativeModule = requireNativeModule('ActivityController');

export const startLiveActivity: types.StartLiveActivityFn = async (params) => {
  const stringParams = JSON.stringify(params);
  return nativeModule.startLiveActivity(stringParams);
};

export const updateLiveActivity: types.UpdateLiveActivityFn = async (
  params,
) => {
  const stringParams = JSON.stringify(params);
  return nativeModule.updateLiveActivity(stringParams);
};

export const stopLiveActivity: types.StopLiveActivityFn = async () => {
  return nativeModule.stopLiveActivity();
};

export const isActivityRunning: types.IsActivityRunningFn = () => {
  return nativeModule.isActivityRunning();
};

export const areLiveActivitiesEnabled: boolean =
  nativeModule.areLiveActivitiesEnabled;
