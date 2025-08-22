# Application Configuration

Every Corrosion application is configured through a simple JSON file, conceptually named `toolkit.conf.json`. This file allows you to define metadata and control the behavior of your application's window and other core features without needing to recompile the Rust binary.

The dashboard includes an interactive editor for this configuration file, complete with an AI assistant to help you make changes.

## The `toolkit.conf.json` File

This file is the single source of truth for your application's static configuration. When your app is built, these values are bundled into the binary.

### Example Configuration

Here is the default configuration used in the dashboard:

```json
{
  "appName": "My Awesome App",
  "version": "1.0.0",
  "identifier": "com.example.awesome",
  "window": {
    "title": "My App",
    "width": 800,
    "height": 600
  }
}
```

### Key Properties

-   `appName` (string): The public-facing name of your application.
-   `version` (string): The version of your application, typically following [Semantic Versioning](https://semver.org/).
-   `identifier` (string): A unique, reverse-domain-style identifier for your application. This is crucial for code signing and OS integrations on macOS and Windows.
-   `window` (object): An object containing all the configuration for the main application window.
    -   `title` (string): The default title of the application window.
    -   `width` (number): The initial width of the window in pixels.
    -   `height` (number): The initial height of the window in pixels.

This is a simplified example. A real-world toolkit would support many more options, such as `fullscreen`, `resizable`, `decorations`, etc.

## AI-Assisted Configuration

Modifying JSON manually can be error-prone. The Corrosion dashboard provides an AI-powered helper to make configuration changes safely and easily.

-   **Location**: Application Configuration Card
-   **How to Use**: Instead of editing the JSON directly, you can type a natural language command into the input field below the editor.
    -   **Example**: Type `Set the version to 2.0.0-beta and change the app name to "Corrosion Explorer"`
-   Click the **Apply** button. The AI will interpret your request, modify the JSON structure accordingly, and update the editor with the new configuration. This demonstrates how AI can simplify complex configuration tasks and reduce human error.
