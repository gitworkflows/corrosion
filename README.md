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
-   **Distribution**: Package your application for all major platforms from a single codebase, with an automated release pipeline powered by GitHub Actions.
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

## Cross-Compilation with Docker

This project includes a Docker-based cross-compilation environment for building Linux `aarch64` (ARM64) binaries from an `x86_64` host. This is a practical demonstration of the toolkit's cross-platform capabilities.

The environment is defined in `docker/cross-aarch64/`.

### Building the Image

```bash
docker build -t corrosion-cross-aarch64 -f docker/cross-aarch64/aarch64.Dockerfile docker/cross-aarch64
```

### Compiling a Project

Mount your project's source code into the container and run the build command:

```bash
docker run --rm -v .:/work -w /work corrosion-cross-aarch64 \
  cargo build --target=aarch64-unknown-linux-gnu --release
```

The compiled binary will be in `target/aarch64-unknown-linux-gnu/release/`.

## Contributing

We welcome contributions from the community! If you're interested in helping improve Corrosion, please check out our:

-   **[Contribution Guide](./docs/contributing.md)** to learn how to get started.
-   **[Project Roadmap](./docs/roadmap.md)** to see what we're planning for the future.
-   Please use our **[GitHub Issue Templates](.github/ISSUE_TEMPLATE)** when reporting bugs or requesting features.

## Local Development & Deployment

For complete instructions on setting up your local environment (with and without serverless functions), deploying to Vercel or Netlify, or **running with Docker**, please refer to our detailed guides:

-   **[Getting Started Guide](./docs/getting-started.md)**
-   **[State Management Guide](./docs/state-management.md)**
-   **[Plugin System Guide](./docs/plugins.md)**
-   **[Distribution Guide](./docs/distribution.md)**
-   **[Deployment Guide](./docs/deployment.md)