# Welcome to the Corrosion Documentation

Corrosion is a conceptual toolkit for building lightweight, high-performance, cross-platform desktop applications. It combines the power and safety of a Rust core with the flexibility of a web-based frontend, all bundled into a minimal binary by leveraging the operating system's native webview.

This documentation will guide you through the architecture, setup, core concepts, and the powerful AI features that make Corrosion an intelligent development environment.

## Why Corrosion?

-   **Minimal Size**: By using the OS's native web renderer, applications are significantly smaller than those built with bundled browser engines like Electron.
-   **High Performance**: Core logic is executed in a compiled Rust binary, offering near-native speed and a low memory footprint.
-   **Security First**: The JS-Rust API bridge provides a secure boundary between the webview and the system, preventing untrusted web code from gaining arbitrary access.
-   **Composable & Extensible**: Start with a lean core and add functionality through a powerful plugin system and a custom API bridge.
-   **AI-Augmented**: A full suite of integrated AI tools, powered by Google Gemini, to accelerate every phase of development, from code generation to security auditing.

## Table of Contents

-   **[Getting Started](./getting-started.md)**
    -   Your first steps: prerequisites, installation, and running the project locally (including Docker).
-   **[Core Concepts](./core-concepts.md)**
    -   Understand the architecture: the Rust core, the WebView frontend, and the API bridge.
-   **[The JS-Rust API Bridge](./api-bridge.md)**
    -   A deep dive into creating commands in Rust and invoking them from JavaScript.
-   **[State Management](./state-management.md)**
    -   Learn how to safely manage shared state in a concurrent Rust application.
-   **[Configuration](./configuration.md)**
    -   Learn how to configure your application using the `toolkit.conf.json` file.
-   **[Plugin System](./plugins.md)**
    -   Understand how to extend the core functionality of your application with plugins.
-   **[AI-Powered Features](./ai-features.md)**
    -   A comprehensive guide to all 10+ AI features integrated into the toolkit.
-   **[Distribution & Releases](./distribution.md)**
    -   Learn how to package your app and automate releases with GitHub Actions.
-   **[Deployment](./deployment.md)**
    -   Step-by-step instructions for deploying to Vercel, Netlify, and with Docker.
-   **[Contributing](./contributing.md)**
    -   Learn how you can contribute to the project.
-   **[Roadmap](./roadmap.md)**
    -   See the future direction of the Corrosion toolkit.
-   **[Issue Labels](./labels.md)**
    -   Understand our issue labeling system.