import ActivityKit
import WidgetKit
import SwiftUI

struct WidgetLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: WidgetAttributes.self) { context in
      VStack {
        TimeDisplayView(context: context)
          .font(.largeTitle)
          .fontWeight(.bold)
        Text(context.state.mode)
          .font(.headline)
          .fontWeight(.medium)
      }
      .padding()
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.bottom) {
          VStack {
            TimeDisplayView(context: context)
              .font(.largeTitle)
              .fontWeight(.bold)
            Text(context.state.mode)
              .font(.headline)
              .fontWeight(.medium)
          }
          .background(Color.black)
        }
      } compactLeading: {
        Text(context.state.mode)
          .fontWeight(.medium)
      } compactTrailing: {
        TimeDisplayView(context: context)
          .fontWeight(.medium)
      } minimal: {
        Image("Logo")
      }
    }
  }
}

struct TimeDisplayView: View {
  let context: ActivityViewContext<WidgetAttributes>

  var body: some View {
    if context.state.status == "idle" {
      Text("00:00")
        .monospacedDigit()
        .multilineTextAlignment(.center)
    } else {
      Text(
        Date(
          timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()
        ),
        style: .timer
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
  fileprivate static var focus: WidgetAttributes.ContentState {
    let now = Int(Date().timeIntervalSince1970 * 1000)
    return WidgetAttributes.ContentState(
      status: "running",
      mode: "focus",
      totalTime: 0,
      startTime: now,
      endTime: now + 1500000
    )
  }
  
  fileprivate static var breakMode: WidgetAttributes.ContentState {
    let now = Int(Date().timeIntervalSince1970 * 1000)
    return WidgetAttributes.ContentState(
      status: "running",
      mode: "break",
      totalTime: 1500000,
      startTime: now,
      endTime: now + 900000
    )
  }

  fileprivate static var idleFocus: WidgetAttributes.ContentState {
    let now = Int(Date().timeIntervalSince1970 * 1000)
    return WidgetAttributes.ContentState(
      status: "idle",
      mode: "focus",
      totalTime: 0,
      startTime: now,
      endTime: 0
    )
  }
}

#Preview("Live Activity", as: .content, using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focus
  WidgetAttributes.ContentState.breakMode
  WidgetAttributes.ContentState.idleFocus
}

#Preview("Dynamic Island", as: .dynamicIsland(.expanded), using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focus
  WidgetAttributes.ContentState.breakMode
  WidgetAttributes.ContentState.idleFocus
}

#Preview("Dynamic Island Compact", as: .dynamicIsland(.compact), using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focus
  WidgetAttributes.ContentState.breakMode
  WidgetAttributes.ContentState.idleFocus
}

#Preview("Dynamic Island Minimal", as: .dynamicIsland(.minimal), using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focus
  WidgetAttributes.ContentState.breakMode
  WidgetAttributes.ContentState.idleFocus
}
