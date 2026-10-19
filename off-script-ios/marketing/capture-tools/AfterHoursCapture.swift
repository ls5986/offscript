import XCTest

final class AfterHoursCapture: XCTestCase {
  let app = XCUIApplication(bundleIdentifier: "com.lindseystevens.offscript")

  func tap(_ label: String) {
    let button = app.buttons[label].firstMatch
    XCTAssertTrue(button.waitForExistence(timeout: 15), "Missing button: \(label)\n\(app.debugDescription)")
    for _ in 0..<8 {
      if button.isHittable { break }
      app.swipeUp()
    }
    XCTAssertTrue(button.isHittable, "Not hittable: \(label)")
    button.tap()
  }

  func capture(_ name: String) {
    sleep(2)
    let attachment = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
    attachment.name = name
    attachment.lifetime = .keepAlways
    add(attachment)
  }

  func openLibrary() {
    app.open(URL(string: "offscript://library")!)
    let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
    if springboard.buttons["Open"].waitForExistence(timeout: 1) {
      springboard.buttons["Open"].tap()
    }
    app.activate()
    XCTAssertTrue(app.buttons["Recipes"].waitForExistence(timeout: 15))
  }

  func findRecipe(_ title: String) {
    let search = app.textFields["Search library"]
    XCTAssertTrue(search.waitForExistence(timeout: 10))
    search.tap()
    search.typeText(title + "\n")
    let use = app.buttons["Use recipe \(title)"]
    XCTAssertTrue(use.waitForExistence(timeout: 10))
    for _ in 0..<6 {
      if use.isHittable { break }
      app.swipeUp()
    }
    XCTAssertTrue(use.isHittable)
  }

  func testCaptureAfterHours() {
    continueAfterFailure = false
    XCUIDevice.shared.orientation = .portrait
    app.launch()
    openLibrary()
    tap("Recipes")
    tap("Cheeky")
    findRecipe("Not making a scene")
    capture("01-cheeky-library")
    tap("Use recipe Not making a scene")
    XCTAssertTrue(app.buttons["Generate Again"].waitForExistence(timeout: 15))
    capture("02-dramatic-exit")

    openLibrary()
    tap("18+")
    XCTAssertTrue(app.staticTexts["Adult comedy, by choice"].waitForExistence(timeout: 10))
    capture("03-adult-consent")
    tap("Everyone is 18+ and agrees")
    tap("Recipes")
    findRecipe("Confidence is not the problem")
    capture("04-adult-library")
    tap("Use recipe Confidence is not the problem")
    XCTAssertTrue(app.buttons["Generate Again"].waitForExistence(timeout: 15))
    tap("Lock Location")
    capture("05-adult-studio")
    tap("Customize")
    XCTAssertTrue(app.buttons["18+"].waitForExistence(timeout: 10))
    capture("06-content-controls")
    tap("Done")
    let save = app.buttons["Save prompt"]
    for _ in 0..<6 {
      if save.isHittable { break }
      app.swipeUp()
    }
    XCTAssertTrue(save.isHittable)
    capture("07-save-controls")
    tap("Save prompt")
    app.open(URL(string: "offscript://saved")!)
    tap("Prompts")
    capture("08-saved")
  }
}
