# Core Concepts

The Corrosion toolkit is built on a modern architectural pattern designed to create lightweight, secure, and performant cross-platform applications. This document explains the three fundamental components of this architecture.

### Conceptual Architecture Diagram

```
+-------------------------------------------------+
|              Your Application                   |
| +---------------------------------------------+ |
| |              Webview (Frontend)             | |
| |  [ HTML | CSS | JavaScript (React) ]       | |
| +---------------------------------------------+ |
|                       ^                         |
|                       | (Async Message Passing) |
|                       v                         |
| +---------------------------------------------+ |
| |                 Rust Core (Backend)         | |
| | [ Core Logic | File System | OS APIs | ... ] | |
| +---------------------------------------------+ |
+-------------------------------------------------+
```

## 1. The Rust Core

At the heart of every Corrosion application is a native binary compiled from Rust code. This is the application's backend and its source of power.

-   **Performance & Safety**: Rust provides memory safety without a garbage collector and compiles to highly efficient machine code. This means your application's core logic is fast, reliable, and has a low memory footprint.
-   **System Access**: The Rust core is where all interactions with the operating system happen. This includes accessing the file system, making network requests, running computations, and interacting with native OS APIs.
-   **Extensibility**: The core is designed to be minimal but can be extended with plugins to add new capabilities, such as database connections or shell access.

## 2. The WebView Frontend

Instead of bundling a heavyweight UI framework or a full browser engine like Chromium, Corrosion uses the operating system's built-in web renderer (the "webview").

-   **Windows**: Uses WebView2 (Microsoft Edge/Chromium).
-   **macOS/iOS**: Uses WKWebView (Safari/WebKit).
-   **Linux**: Uses WebKitGTK.

This approach has several key advantages:

-   **Minimal Size**: Your final application bundle is incredibly small because you aren't shipping an entire web browser. You're simply using the one that's already installed on the user's system.
-   **Web Technologies**: You can build your entire user interface using the technologies you already know and love: HTML, CSS, and JavaScript (with frameworks like React, Vue, Svelte, etc.).
-   **System Look & Feel**: Because it uses the native web engine, your app often inherits system-level features like smooth scrolling and accessibility integrations.

## 3. The JS-Rust API Bridge

This is the magic that connects the frontend and the backend. It's a secure message-passing system that allows your JavaScript code to talk to your Rust code.

-   **How it Works**:
    1.  You define a function in your Rust code and annotate it as a `command`.
    2.  The toolkit's build process generates bindings that make this command available to the frontend.
    3.  In your JavaScript code, you can now `invoke` this command by its name, passing arguments just like a regular asynchronous function.
    4.  The Rust function executes on the backend and can return a value (or an error) to the JavaScript code via a Promise.
-   **Security**: This bridge is the **only** way the frontend can interact with the system. The webview itself is sandboxed. It cannot access the file system or other native features directly. It must explicitly ask the Rust core to perform an action on its behalf via a predefined command. This creates a secure boundary and prevents common web-based vulnerabilities.

This three-part architecture gives you the best of both worlds: the development speed and flexibility of web technologies for your UI, and the performance and power of Rust for your core application logic.
