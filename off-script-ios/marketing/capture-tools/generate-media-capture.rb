require 'xcodeproj'

root = File.dirname(__FILE__)
project = Xcodeproj::Project.new("#{root}/MediaCapture.xcodeproj")
target = project.new_target(:ui_test_bundle, 'MediaCapture', :ios, '16.4')
file = project.main_group.new_file("#{root}/MediaCapture.swift")
target.source_build_phase.add_file_reference(file)
target.build_configurations.each do |configuration|
  configuration.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = 'local.offscript.mediacapture'
  configuration.build_settings['GENERATE_INFOPLIST_FILE'] = 'YES'
  configuration.build_settings['SWIFT_VERSION'] = '5.0'
  configuration.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
  configuration.build_settings['SUPPORTED_PLATFORMS'] = 'iphonesimulator'
end
project.save
scheme = Xcodeproj::XCScheme.new
scheme.add_build_target(target)
scheme.add_test_target(target)
scheme.save_as(project.path, 'MediaCapture', true)
