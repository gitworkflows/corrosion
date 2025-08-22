# The JS-Rust API Bridge

The API bridge is the most critical concept in the Corrosion toolkit. It's the communication channel that allows your JavaScript frontend to securely interact with your powerful Rust backend. This is achieved through a message-passing system of "commands".

## Defining Commands in Rust

A "command" is simply a Rust function that you expose to the frontend. To do this, you annotate a function with a macro (conceptually `#[tauri::command]`).

### Basic Command

Here is the simplest possible command. It takes no arguments and returns a string literal.

```rust
// In your Rust code (e.g., src/main.rs)

// This macro makes the function available to the frontend.
#[tauri::command]
fn get_greeting() -> &'static str {
  "Hello from Rust!"
}
```

### Command with Arguments

Your commands can accept arguments. The types must be serializable so they can be sent from the JavaScript environment. Common types like `String`, `&str`, `i32`, `bool`, and custom `struct`s (with `serde::Deserialize`) are supported.

```rust
#[tauri::command]
fn greet(name: String) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}
```

### Asynchronous Commands

For long-running tasks, you should make your commands `async`. This prevents the Rust backend from blocking while the task is running. The toolkit's runtime will handle running it on a separate thread.

```rust
#[tauri::command]
async fn long_running_task() -> String {
  // Simulate a delay, like a network request or heavy computation
  tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
  "Task finished!".to_string()
}
```

## Invoking Commands from JavaScript

Once a command is defined in Rust and your application is running, you can call it from your frontend JavaScript/TypeScript code using an `invoke` function provided by the toolkit's API.

The `invoke` function is always asynchronous and returns a `Promise`.

### Invoking a Basic Command

```javascript
// In your JavaScript/TypeScript code (e.g., a React component)
import { invoke } from '@tauri-apps/api/tauri'; // Conceptual import

async function sayHello() {
  try {
    // The first argument is the snake_case name of the Rust function.
    const message = await invoke('get_greeting');
    console.log(message); // Outputs: "Hello from Rust!"
    alert(message);
  } catch (error) {
    console.error("Failed to call Rust command:", error);
  }
}
```

### Invoking with Arguments

To pass arguments, you provide a second argument to `invoke`: an object where the keys are the camelCase versions of your Rust function's argument names.

```javascript
// In Rust: fn greet(name: String)
// In JS:   invoke('greet', { name: 'World' })

async function greetSomeone(name) {
  const message = await invoke('greet', { name: name });
  // In the example dashboard, we use `setPreviewContent(message)`
  alert(message); // Outputs: "Hello, World! You've been greeted from Rust!"
}
```

### Error Handling

If a Rust command panics or returns a `Result::Err`, the `Promise` on the JavaScript side will be rejected. You can catch this using a standard `try...catch` block, as shown in the examples above. This is the standard way to handle errors and communicate failure from the backend to the frontend.
