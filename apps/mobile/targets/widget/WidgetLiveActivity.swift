import ActivityKit
import WidgetKit
import SwiftUI

struct WidgetLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: WidgetAttributes.self) { context in
      VStack {
        HStack {
          Image("Logo")
          Text(context.state.mode.prefix(1).uppercased() + context.state.mode.dropFirst())
            .font(.headline)
            .fontWeight(.bold)
        }
        TimerView(state: context.state)
          .font(.largeTitle)
          .fontWeight(.bold)
      }
      .padding()
      .activityBackgroundTint(Color(red: 19/255, green: 18/255, blue: 33/255).opacity(0.9))
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.bottom) {
          VStack {
            Text(context.state.mode.prefix(1).uppercased() + context.state.mode.dropFirst())
              .font(.headline)
              .fontWeight(.bold)
            TimerView(state: context.state)
              .font(.largeTitle)
              .fontWeight(.bold)
          }
        }
      } compactLeading: {
        Image("Logo")
      } compactTrailing: {
        TimerView(state: context.state)
          .fontWeight(.medium)
          .frame(maxWidth: 56)
      } minimal: {
        Image("Logo")
      }
      .contentMargins(.leading, 12, for: .compactLeading)
      .contentMargins(.trailing, 4, for: .compactTrailing)
    }
  }
}

struct TimerView: View {
  let state: WidgetAttributes.ContentState
  
  var body: some View {
    let now = Date()
    let baseDate = Date(timeIntervalSince1970: 0)
    let totalTimeDate = baseDate.addingTimeInterval(Double(state.totalTime) / 1000.0)
    let startDate = Date(timeIntervalSince1970: Double(state.startTime) / 1000.0)
    let endDate = Date(timeIntervalSince1970: Double(state.endTime) / 1000.0)
    
    switch (state.mode, state.status) {
    case ("focus", "running"):
      let adjustedStartDate = startDate.addingTimeInterval(-Double(state.totalTime) / 1000.0)
      return Text(
        timerInterval: adjustedStartDate...(now.addingTimeInterval(100 * 3600)),
        countsDown: false
      )
      .monospacedDigit()
      .multilineTextAlignment(.center)
      
    case ("break", "running"):
      return Text(
        timerInterval: startDate...endDate,
        countsDown: true
      )
      .monospacedDigit()
      .multilineTextAlignment(.center)
      
    default:
      return Text(
        timerInterval: baseDate...totalTimeDate,
        countsDown: false
      )
      .monospacedDigit()
      .multilineTextAlignment(.center)
    }
  }
}

extension WidgetAttributes {
  fileprivate static var preview: WidgetAttributes {
    WidgetAttributes()
  }
}

extension WidgetAttributes.ContentState {
  fileprivate static var focusIdle: WidgetAttributes.ContentState {
    return WidgetAttributes.ContentState(
      status: "idle",
      mode: "focus",
      totalTime: 0,
      startTime: 0,
      endTime: 0
    )
  }
  
  fileprivate static var focusRunning: WidgetAttributes.ContentState {
    let now = Int(Date().timeIntervalSince1970 * 1000)
    return WidgetAttributes.ContentState(
      status: "running",
      mode: "focus",
      totalTime: 60000,
      startTime: now,
      endTime: 0
    )
  }
  
  fileprivate static var focusPaused: WidgetAttributes.ContentState {
    let now = Int(Date().timeIntervalSince1970 * 1000)
    return WidgetAttributes.ContentState(
      status: "paused",
      mode: "focus",
      totalTime: 3600000,
      startTime: now,
      endTime: 0
    )
  }
  
  fileprivate static var breakIdle: WidgetAttributes.ContentState {
    return WidgetAttributes.ContentState(
      status: "idle",
      mode: "break",
      totalTime: 2521,
      startTime: 0,
      endTime: 0
    )
  }
  
  fileprivate static var breakRunning: WidgetAttributes.ContentState {
    let now = Int(Date().timeIntervalSince1970 * 1000)
    return WidgetAttributes.ContentState(
      status: "running",
      mode: "break",
      totalTime: 1500000,
      startTime: now,
      endTime: now + 9000
    )
  }
}

#Preview("Live Activity", as: .content, using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focusIdle
  WidgetAttributes.ContentState.focusRunning
  WidgetAttributes.ContentState.focusPaused
  WidgetAttributes.ContentState.breakIdle
  WidgetAttributes.ContentState.breakRunning
}

#Preview("Dynamic Island", as: .dynamicIsland(.expanded), using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focusIdle
  WidgetAttributes.ContentState.focusRunning
  WidgetAttributes.ContentState.focusPaused
  WidgetAttributes.ContentState.breakIdle
  WidgetAttributes.ContentState.breakRunning
}

#Preview("Dynamic Island Compact", as: .dynamicIsland(.compact), using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focusIdle
  WidgetAttributes.ContentState.focusRunning
  WidgetAttributes.ContentState.focusPaused
  WidgetAttributes.ContentState.breakIdle
  WidgetAttributes.ContentState.breakRunning
}

#Preview("Dynamic Island Minimal", as: .dynamicIsland(.minimal), using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focusIdle
  WidgetAttributes.ContentState.focusRunning
  WidgetAttributes.ContentState.focusPaused
  WidgetAttributes.ContentState.breakIdle
  WidgetAttributes.ContentState.breakRunning
}
