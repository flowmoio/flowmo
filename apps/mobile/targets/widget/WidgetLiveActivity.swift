import ActivityKit
import WidgetKit
import SwiftUI

struct WidgetLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: WidgetAttributes.self) { context in
      VStack {
        Text(context.state.time)
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
            Text(context.state.time)
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
        Text(context.state.time)
          .fontWeight(.medium)
      } minimal: {
        Image("Logo")
      }
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
    WidgetAttributes.ContentState(time: "25:00", mode: "Focus")
  }
  
  fileprivate static var breakMode: WidgetAttributes.ContentState {
    WidgetAttributes.ContentState(time: "15:30", mode: "Break")
  }
}

#Preview("Live Activity", as: .content, using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focus
  WidgetAttributes.ContentState.breakMode
}

#Preview("Dynamic Island", as: .dynamicIsland(.expanded), using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focus
  WidgetAttributes.ContentState.breakMode
}

#Preview("Dynamic Island Compact", as: .dynamicIsland(.compact), using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focus
  WidgetAttributes.ContentState.breakMode
}

#Preview("Dynamic Island Minimal", as: .dynamicIsland(.minimal), using: WidgetAttributes.preview) {
  WidgetLiveActivity()
} contentStates: {
  WidgetAttributes.ContentState.focus
  WidgetAttributes.ContentState.breakMode
}
