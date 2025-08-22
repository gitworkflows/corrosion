# The Plugin System

Corrosion is designed to be a **composable** toolkit. This means you start with a lean, minimal core and add only the functionality you need through a robust plugin system. This approach keeps your final application size small and your attack surface reduced.

## Core Concept

A plugin is a self-contained piece of code that extends the Rust core with new capabilities. Typically, a plugin will expose new commands to the JS-Rust API Bridge, allowing your frontend to interact with new native features.

For example, the official `dialog` plugin could expose commands like `open()` and `save()` that allow your JavaScript code to trigger native OS file-picker dialogs.

## Polyglot Architecture

A key feature of the Corrosion plugin system is its polyglot nature. A single plugin isn't just Rust code; it's a collection of components that work together to provide a feature across all target platforms.

A plugin can be composed of:

-   **Rust (Core)**: The main logic of the plugin, compiled into the core binary. This is mandatory.
-   **JS (Bindings)**: An optional JavaScript/TypeScript package that provides a type-safe and user-friendly API for the plugin's Rust commands.
-   **Kotlin (Android)**: For plugins that need to interact with Android-specific APIs, you can include native Kotlin code that is compiled into the final Android app.
-   **Swift (iOS)**: Similarly, you can include native Swift code for iOS-specific functionality.

The "Plugin Manager" card in the dashboard visualizes this architecture. You can expand each plugin to see which components it includes.

### How it Affects the Build

The build process is platform-aware. When you build for Android or iOS, the build system checks for enabled plugins that contain the corresponding native component (`Kotlin (Android)` or `Swift (iOS)`).

If found, it will run the necessary compilation steps for that native code and link it into the final mobile application. This is simulated in the dashboard's terminal output:

```
[INFO] Compiling Rust core for Android (arm64)...
[INFO] Compiling Kotlin (Android) extensions for plugin 'File System Access'...
[INFO] Linking native bindings for Android (WebView)...
[SUCCESS] Build for Android finished with status: Success.
```

This ensures that you can extend your application with deep OS integrations on mobile platforms without bloating your desktop builds.