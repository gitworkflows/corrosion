# Corrosion: The Composable Toolkit

[![View Full Documentation](https://img.shields.io/badge/Full%20Documentation-View%20Now-58A6FF?style=for-the-badge)](./docs/index.md)

A web-based dashboard demonstrating Corrosion, a conceptual polyglot and generic toolkit for building a wide variety of applications. This dashboard showcases a project that is highly composable, using a combination of Rust for core logic, HTML rendered in a Webview for the frontend, and a powerful message-passing API to bridge the two.

This project has been supercharged with a suite of 10 powerful, AI-driven features powered by the Google Gemini API, transforming it into an intelligent development assistant.

**➡️ For a deep dive into the architecture, setup, API, and all features, please see the [Full Documentation](./docs/index.md).**

## Core Concepts

Corrosion demonstrates an architectural pattern popularized by frameworks like [Tauri](https://tauri.app/), focusing on creating a composable and extensible toolkit.

-   **Frontend**: A modern web frontend (React, TypeScript) rendered inside the OS's native webview.
-   **Core Logic**: Written in Rust, compiled to a native binary.
-   **JS-Rust API Bridge**: A message-passing system allowing the UI to control the system securely.
-   **State Management**: Safely manage shared application state across threads using Rust's concurrency primitives.
-   **Polyglot Plugin System**: Extend the core with plugins that can include Rust, JavaScript, and native mobile code (Kotlin/Swift).
-   **Distribution**: Package your application for all major platforms from a single codebase.
-   **AI-Powered Backend**: Serverless functions act as a secure proxy to the Google Gemini API.

## AI-Powered Features

The dashboard demonstrates a full suite of AI capabilities, including:

1.  **Code Generation & Refactoring**
2.  **Unit Test Generation & Code Explanation**
3.  **AI Security Audits**
4.  **Docstring & Frontend Snippet Generation**
5.  **AI-Assisted Configuration**
6.  **Build Log Analysis & Script Generation**
7.  **An integrated AI Developer Chat**

...and more. See the [AI Features documentation](./docs/ai-features.md) for a complete list.

## Local Development & Deployment

For complete instructions on setting up your local environment (with and without serverless functions) and deploying to Vercel or Netlify, please refer to our detailed guides:

-   **[Getting Started Guide](./docs/getting-started.md)**
-   **[State Management Guide](./docs/state-management.md)**
-   **[Plugin System Guide](./docs/plugins.md)**
-   **[Distribution Guide](./docs/distribution.md)**
-   **[Deployment Guide](./docs/deployment.md)**