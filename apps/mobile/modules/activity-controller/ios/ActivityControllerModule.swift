import ActivityKit
import SwiftUI
import ExpoModulesCore

// MARK: Exceptions

final class ActivityUnavailableException: GenericException<Void> {
  override var reason: String {
    "Live activities are not available on this system."
  }
}

final class ActivityFailedToStartException: GenericException<Void> {
  override var reason: String {
    "Live activity couldn't be launched."
  }
}

final class ActivityNotStartedException: GenericException<Void> {
  override var reason: String {
    "Live activity has not started yet."
  }
}

final class ActivityAlreadyRunningException: GenericException<Void> {
  override var reason: String {
    "Live activity is already running."
  }
}

final class ActivityDataException: GenericException<String> {
  override var reason: String {
    "The data passed down to the Live Activity is incorrect. \(param)"
  }
}

// MARK: Types

struct StartActivityArgs: Codable {
  let status: String
  let mode: String
  let totalTime: Int
  let startTime: Int
  let endTime: Int

  public static func fromJSON(rawData: String) -> Self? {
    let decoder = JSONDecoder()
    return try? decoder.decode(self, from: Data(rawData.utf8))
  }
}

protocol ActivityWrapper {}

@available(iOS 16.2, *)
class DefinedActivityWrapper: ActivityWrapper {
  private var activity: Activity<WidgetAttributes>

  init(_ activity: Activity<WidgetAttributes>) {
    self.activity = activity
  }

  public func setActivity(activity: Activity<WidgetAttributes>) {
    self.activity = activity
  }

  public func getActivity() -> Activity<WidgetAttributes> {
    return self.activity
  }
}

struct FallbackActivityWrapper: ActivityWrapper {}

struct StartActivityReturnType: Record {
  @Field
  var activityId: String
}

// MARK: Helper functions

func getCurrentActivity() -> ActivityWrapper? {
  guard #available(iOS 16.2, *) else {
    return nil
  }

  if let activity = Activity<WidgetAttributes>.activities.first {
    return DefinedActivityWrapper(activity)
  } else {
    return nil
  }
}

func isActivityRunning() -> Bool {
  return getCurrentActivity() != nil
}

// MARK: Module definition

public class ActivityControllerModule: Module {
    @objc func appWillTerminate() {
        if #available(iOS 16.2, *), let activity = (getCurrentActivity() as? DefinedActivityWrapper)?.getActivity() {
            Task {
                await activity.end(nil, dismissalPolicy: .immediate)
                log.debug("Live activity ended due to app termination")
            }
        }
    }
  private var activityWrapper: ActivityWrapper?

  public func definition() -> ModuleDefinition {
    Name("ActivityController")
    OnCreate {
      #if canImport(UIKit)
      NotificationCenter.default.addObserver(self, selector: #selector(ActivityControllerModule.appWillTerminate), name: UIApplication.willTerminateNotification, object: nil)
      #endif
    }

    Property("areLiveActivitiesEnabled") {
      if #available(iOS 16.2, *) {
        return ActivityAuthorizationInfo().areActivitiesEnabled
      }
      return false
    }

    AsyncFunction("startLiveActivity") {
      (
        rawData: String,
        promise: Promise
      ) in
      guard #available(iOS 16.2, *) else {
        throw ActivityUnavailableException(())
      }

      guard let args = StartActivityArgs.fromJSON(rawData: rawData) else {
        throw ActivityDataException(rawData)
      }

      guard isActivityRunning() == false else {
        throw ActivityAlreadyRunningException(())
      }

      let info = ActivityAuthorizationInfo()
      guard info.areActivitiesEnabled else {
        throw ActivityUnavailableException(())
      }

      do {
        let activityAttrs = WidgetAttributes()
        let activityState = WidgetAttributes.WidgetState(
          status: args.status, mode: args.mode, totalTime: args.totalTime, startTime: args.startTime, endTime: args.endTime
        )

        let activity = try Activity.request(
          attributes: activityAttrs,
          content: .init(state: activityState, staleDate: nil)
        )

        log.debug("Started \(activity.id)")

        return StartActivityReturnType(activityId: Field(wrappedValue: activity.id))
      } catch let error {
        print(error.localizedDescription)
        throw ActivityFailedToStartException(())
      }
    }

    AsyncFunction("updateLiveActivity") {
      (
        rawData: String,
        promise: Promise
      ) in
      guard #available(iOS 16.2, *) else {
        throw ActivityUnavailableException(())
      }

      guard let args = StartActivityArgs.fromJSON(rawData: rawData) else {
        throw ActivityDataException(rawData)
      }

      guard let activity = (getCurrentActivity() as? DefinedActivityWrapper)?.getActivity() else {
        throw ActivityNotStartedException(())
      }

      log.debug("Updating activity \(activity.id)")

      let activityState = WidgetAttributes.WidgetState(
        status: args.status, mode: args.mode, totalTime: args.totalTime, startTime: args.startTime, endTime: args.endTime
      )

      Task {
        await activity.update(
          ActivityContent<WidgetAttributes.WidgetState>(state: activityState, staleDate: nil)
        )
        log.debug("Updated activity \(activity.id)")
        return promise.resolve()
      }
    }

    AsyncFunction("stopLiveActivity") { (promise: Promise) in
      guard #available(iOS 16.2, *) else {
        throw ActivityUnavailableException(())
      }

      guard let activity = (getCurrentActivity() as? DefinedActivityWrapper)?.getActivity() else {
        throw ActivityNotStartedException(())
      }

      log.debug("Stopping activity \(activity.id)")

      Task {
        await activity.end(nil, dismissalPolicy: .immediate)
        log.debug("Stopped activity \(activity.id)")
        return promise.resolve()
      }
    }

    Function("isActivityRunning") { () -> Bool in
      return isActivityRunning()
    }
  }
}
