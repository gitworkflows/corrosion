import React from 'react';
import type { PerformanceMetric, BuildTarget, Plugin } from './types';
import { LinuxIcon } from './components/icons/LinuxIcon';
import { AppleIcon } from './components/icons/AppleIcon';
import { WindowsIcon } from './components/icons/WindowsIcon';
import { AndroidIcon } from './components/icons/AndroidIcon';
import { PackageIcon } from './components/icons/PackageIcon';
import { AppStoreIcon } from './components/icons/AppStoreIcon';
import { GooglePlayIcon } from './components/icons/GooglePlayIcon';

export const INITIAL_RUST_CODE = `// Enter a prompt on the "Generate" tab and click "Generate Code"
// to see the AI in action!
fn main() {
    println!("Hello, World!");
}
`;

export const INITIAL_RUST_API_CODE = `// In Rust, define "commands" that can be invoked from the frontend.
// The Security Audit panel below will automatically analyze them.
// Try adding a new command that takes a file path!
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}
`;

export const INITIAL_JS_API_CODE = `// Use the buttons below to generate JS snippets or docstrings for the Rust API.`;

export const INITIAL_APP_CONFIG = `{"appName":"My Awesome App","version":"1.0.0","identifier":"com.example.awesome","window":{"title":"My App","width":800,"height":600}}`;

export const INITIAL_BUILD_SCRIPT = `#!/bin/bash
# Describe the build steps you want in the prompt above.
# The AI will generate a script here.

echo "Starting build..."
cargo build --release
echo "Build complete."
`;

export const INITIAL_METRICS: PerformanceMetric[] = [ { name: 'App Size (MB)', value: 2.5, fill: '#654FF0' } ];

export const INITIAL_TARGETS: BuildTarget[] = [
  { platform: 'Linux', status: 'Not Started', icon: React.createElement(LinuxIcon, { className: "w-5 h-5" }), arch: 'x86_64', bindings: 'WebKitGTK', output: 'app.bin', distributionFormats: [
      { id: 'appimage', name: 'AppImage', icon: React.createElement(PackageIcon, { className: "w-5 h-5" })},
      { id: 'snap', name: 'Snap', icon: React.createElement(PackageIcon, { className: "w-5 h-5" })},
      { id: 'deb', name: 'Debian', icon: React.createElement(PackageIcon, { className: "w-5 h-5" })},
  ]},
  { platform: 'macOS', status: 'Not Started', icon: React.createElement(AppleIcon, { className: "w-5 h-5" }), arch: 'aarch64', bindings: 'WKWebView', output: 'app.app', distributionFormats: [
      { id: 'dmg', name: 'DMG Installer', icon: React.createElement(PackageIcon, { className: "w-5 h-5" })},
      { id: 'app_store', name: 'App Store', icon: React.createElement(AppStoreIcon, { className: "w-5 h-5" })},
  ]},
  { platform: 'Windows', status: 'Not Started', icon: React.createElement(WindowsIcon, { className: "w-5 h-5" }), arch: 'x86_64', bindings: 'WebView2', output: 'app.exe', distributionFormats: [
       { id: 'msi', name: 'MSI Installer', icon: React.createElement(PackageIcon, { className: "w-5 h-5" })},
       { id: 'ms_store', name: 'Microsoft Store', icon: React.createElement(WindowsIcon, { className: "w-5 h-5" })},
  ]},
  { platform: 'Android', status: 'Not Started', icon: React.createElement(AndroidIcon, { className: "w-5 h-5" }), arch: 'arm64', bindings: 'WebView', output: 'app.apk', distributionFormats: [
      { id: 'google_play', name: 'Google Play', icon: React.createElement(GooglePlayIcon, { className: "w-5 h-5" })},
      { id: 'apk', name: 'APK Sideload', icon: React.createElement(PackageIcon, { className: "w-5 h-5" })},
  ]},
  { platform: 'iOS', status: 'Not Started', icon: React.createElement(AppleIcon, { className: "w-5 h-5" }), arch: 'aarch64', bindings: 'WKWebView', output: 'app.ipa', distributionFormats: [
      { id: 'app_store_ios', name: 'App Store', icon: React.createElement(AppStoreIcon, { className: "w-5 h-5" })},
      { id: 'testflight', name: 'TestFlight', icon: React.createElement(AppleIcon, { className: "w-5 h-5" })},
  ]},
];

export const INITIAL_PLUGINS: Plugin[] = [
    { 
        id: 'fs', name: 'File System Access', description: 'Read and write files on the host system.', enabled: true,
        components: [
            { type: 'Rust (Core)', status: 'Included' },
            { type: 'JS (Bindings)', status: 'Included' },
            { type: 'Kotlin (Android)', status: 'Included' },
            { type: 'Swift (iOS)', status: 'Included' },
        ]
    },
    { 
        id: 'os', name: 'OS Notifications', description: 'Send native desktop notifications.', enabled: true,
        components: [
            { type: 'Rust (Core)', status: 'Included' },
            { type: 'JS (Bindings)', status: 'Included' },
            { type: 'Kotlin (Android)', status: 'Included' },
            { type: 'Swift (iOS)', status: 'Not Applicable' },
        ]
    },
    { 
        id: 'db', name: 'Database Connector', description: 'Connect to local SQLite databases.', enabled: false,
        components: [
            { type: 'Rust (Core)', status: 'Included' },
            { type: 'JS (Bindings)', status: 'Included' },
            { type: 'Kotlin (Android)', status: 'Not Applicable' },
            { type: 'Swift (iOS)', status: 'Not Applicable' },
        ]
    },
    { 
        id: 'shell', name: 'Shell Access', description: 'Execute shell commands (high-risk).', enabled: false,
        components: [
            { type: 'Rust (Core)', status: 'Included' },
            { type: 'JS (Bindings)', status: 'Included' },
            { type: 'Kotlin (Android)', status: 'Not Applicable' },
            { type: 'Swift (iOS)', status: 'Not Applicable' },
        ]
    },
];