import ActivityKit
import SwiftUI

public struct WidgetAttributes: ActivityAttributes {
  public typealias WidgetState = ContentState

  public struct ContentState: Codable, Hashable {
    var status: String
    var mode: String
    var totalTime: Int
    var startTime: Int
    var endTime: Int
  }
}
