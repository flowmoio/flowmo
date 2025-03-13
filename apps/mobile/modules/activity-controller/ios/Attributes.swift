import ActivityKit
import SwiftUI

public struct WidgetAttributes: ActivityAttributes {
    public typealias WidgetState = ContentState

    public struct ContentState: Codable, Hashable {
        var time: String
        var mode: String
    }
}

