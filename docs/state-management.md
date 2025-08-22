# State Management

In a Corrosion application, your Rust core often runs on multiple threads to handle UI events, background tasks, and API commands concurrently. A common challenge in this environment is safely sharing and modifying data between these threads. This is where state management comes in.

Corrosion provides a way to manage a piece of state and make it accessible to all your commands. However, Rust's strict ownership and borrowing rules prevent you from simply modifying shared data, as this could lead to data races.

## The Challenge: Shared Mutability

A data race can occur when:
1. Two or more threads access the same memory location concurrently.
2. At least one of the accesses is a write.
3. There is no synchronization mechanism to order the accesses.

Rust's compiler will prevent you from compiling code that could lead to a data race. To work around this, we use a concept called **Interior Mutability**.

## The Solution: Interior Mutability with `Mutex`

A `Mutex` (Mutual Exclusion) is a synchronization primitive that provides a "lock." Before a thread can access the data inside a `Mutex`, it must first acquire the lock. While one thread holds the lock, no other thread can acquire it. They must wait until the first thread is done and releases the lock.

This guarantees that only one thread can access the data at a time, completely eliminating the risk of data races.

### How it Works (Conceptually in Rust)

```rust
// 1. Create a shared state wrapped in a Mutex.
// The `Arc` (Atomically-Reference-Counted) allows safe sharing across threads.
let shared_state = Arc::new(Mutex::new(0));

// 2. In a command (running on a thread):
#[tauri::command]
fn increment_counter(state: State<Arc<Mutex<i32>>>) {
  // 3. Lock the mutex. This might block if another thread holds the lock.
  let mut num = state.lock().unwrap();

  // 4. Now we have exclusive access. We can safely modify the data.
  *num += 1;

  // 5. When `num` goes out of scope at the end of the function,
  //    the lock is automatically released.
}
```

## Interactive Demo

The "Managed State & Mutability" card in the dashboard provides a live, visual demonstration of this concept.

-   **Shared Counter**: This represents the data protected by the `Mutex`.
-   **Lock Status**: Shows whether the `Mutex` is currently locked or available.
-   **Run Concurrency Simulation**: This button simulates two threads ("Thread A" and "Thread B") attempting to access and increment the counter at the same time.

Watch the terminal output as you run the simulation. You will see one thread request and acquire the lock, modify the state, and then release the lock, after which the second thread can begin its work. This ordered, serialized access ensures that even with concurrent operations, the final state of the counter is consistent and correct.