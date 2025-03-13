import ActivityKit
import WidgetKit
import SwiftUI

struct WidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var time: String
        var mode: String
    }
}

struct WidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: WidgetAttributes.self) { context in
            VStack {
                Text(context.state.time)
                    .font(.largeTitle)
                Text(context.state.mode)
                    .font(.headline)
            }

        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.bottom) {
                    VStack {
                        Text(context.state.time)
                            .font(.largeTitle)
                        Text(context.state.mode)
                            .font(.headline)
                    }
                }
            } compactLeading: {
                Text(context.state.mode)
            } compactTrailing: {
                Text(context.state.time)
            } minimal: {
                Text(context.state.time)
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
