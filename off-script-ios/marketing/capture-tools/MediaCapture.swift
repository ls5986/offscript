import XCTest

final class MediaCapture: XCTestCase {
  let app = XCUIApplication(bundleIdentifier: "com.lindseystevens.offscript")

  func tap(_ label: String) {
    let button = app.buttons[label].firstMatch
    XCTAssertTrue(button.waitForExistence(timeout: 15), "Missing button: \(label)\n\(app.debugDescription)")
    for _ in 0..<6 {
      if button.isHittable { break }
      app.swipeUp()
    }
    XCTAssertTrue(button.isHittable, "Not hittable: \(label)")
    button.tap()
  }

  func capture(_ name: String) {
    sleep(2)
    let shot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
    shot.name = name
    shot.lifetime = .keepAlways
    add(shot)
  }

  func open(_ path: String) {
    app.open(URL(string: "offscript://\(path)")!)
    let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
    if springboard.buttons["Open"].waitForExistence(timeout: 1) {
      springboard.buttons["Open"].tap()
    }
    app.activate()
    sleep(2)
  }

  func useRecipe(_ title: String) {
    open("library")
    tap("Recipes")
    let search = app.textFields["Search library"]
    XCTAssertTrue(search.waitForExistence(timeout: 10))
    search.tap()
    search.typeText(title + "\n")
    tap("Use recipe \(title)")
    XCTAssertTrue(app.buttons["Generate Again"].waitForExistence(timeout: 15))
  }

  func testCaptureMarketing() {
    continueAfterFailure = false
    XCUIDevice.shared.orientation = .portrait
    app.launch()
    XCTAssertTrue(app.buttons["Prompt Studio"].waitForExistence(timeout: 30))
    capture("01-home")

    open("party")
    tap("More players")
    capture("02-party-setup")
    tap("Deal first card")
    tap("Change game")
    tap("World's Worst")
    capture("03-party")
    tap("Change game")
    tap("New Choice")
    capture("04-new-choice-ready")
    tap("Start")
    XCTAssertTrue(app.buttons["New Choice!"].waitForExistence(timeout: 10))
    capture("05-new-choice")
    tap("New Choice!")
    capture("06-new-choice-called")
    tap("End game")
    capture("07-recap")

    useRecipe("Rivals on the rooftop")
    tap("Lock Location")
    capture("08-studio")
    tap("Save prompt")
    useRecipe("Two siblings, one apology")
    tap("Save prompt")
    useRecipe("Neighbors in the kitchen")
    tap("Save prompt")

    open("library")
    capture("09-library")
    tap("Recipes")
    capture("10-recipes")
    open("saved")
    tap("Prompts")
    capture("11-saved")
  }

  func testCaptureStudioControls() {
    continueAfterFailure = false
    app.launch()
    useRecipe("Rivals on the rooftop")
    tap("Lock Location")
    let save = app.buttons["Save prompt"]
    for _ in 0..<6 {
      if save.isHittable { break }
      app.swipeUp()
    }
    XCTAssertTrue(save.isHittable)
    capture("12-studio-save")
  }
}
