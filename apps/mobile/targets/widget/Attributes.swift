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

    func getTimeIntervalSinceNow() -> TimeInterval {
      if status != "running" {
        return 0
      }

      let now = Int(Date().timeIntervalSince1970 * 1000)

      if mode == "focus" {
        return Double(totalTime + now - startTime) / 1000.0
      }

      return Double(endTime - now) / 1000.0
    }
  }
}
