import ActivityKit
import SwiftUI

public struct WidgetAttributes: ActivityAttributes {
    public typealias WidgetStatus = ContentState

    public struct ContentState: Codable, Hashable {
        var time: String
        var mode: String
    }
}

