# AI-Powered Features Guide

The Corrosion toolkit dashboard is enhanced with a suite of powerful features driven by the Google Gemini API. These tools are designed to act as an intelligent assistant, accelerating your development workflow.

---

### 1. AI Code Generation

-   **Location**: AI-Powered Rust Development > Generate Tab
-   **Description**: Creates a Rust code snippet based on a natural language prompt.
-   **How to Use**: Type a description of the function you want (e.g., "a function that sorts a vector of integers") into the text area and click "Run Generate".
-   **System Instruction**: "You are an expert Rust programmer... ONLY output the raw Rust code."

---

### 2. AI Code Refactoring

-   **Location**: AI-Powered Rust Development > Refactor Tab
-   **Description**: Analyzes existing Rust code and refactors it for improved performance, readability, and idiomatic style.
-   **How to Use**: Paste or generate code in the editor, switch to the "Refactor" tab, and click "Run Refactor".
-   **System Instruction**: "Refactor the following Rust code for clarity, performance, and idiomatic style. ONLY output the refactored Rust code."

---

### 3. AI Unit Test Generation

-   **Location**: AI-Powered Rust Development > Test Tab
-   **Description**: Automatically generates a suite of unit tests for a given piece of Rust code.
-   **How to Use**: With your code in the editor, switch to the "Test" tab, and click "Run Test". The AI will generate a `#[cfg(test)]` module with relevant tests.
-   **System Instruction**: "Generate a comprehensive suite of unit tests for the following Rust code... ONLY output the Rust test code."

---

### 4. AI Code Explanation

-   **Location**: AI-Powered Rust Development > Explain Tab
-   **Description**: Provides a clear, natural-language explanation of how a piece of Rust code works.
-   **How to Use**: With code in the editor, switch to the "Explain" tab, and click "Run Explain". The output will be formatted in Markdown.
-   **System Instruction**: "Explain the following Rust code in a clear, concise, and easy-to-understand way. Use markdown for formatting."

---

### 5. AI-Powered Security Audit

-   **Location**: API Security Audit Card
-   **Description**: Performs a deep, contextual security analysis on the Rust functions exposed to the frontend, identifying potential vulnerabilities.
-   **How to Use**: Write your API commands in the "JS-Rust API Bridge" editor, then click the "Run AI Security Audit" button.
-   **System Instruction**: "You are a security expert... Analyze the following Rust Tauri commands for potential security vulnerabilities..."

---

### 6. AI Docstring Generation

-   **Location**: JS-Rust API Bridge Card
-   **Description**: Automatically generates idiomatic documentation comments (`///`) for your exposed Rust API commands.
-   **How to Use**: Click the "Generate Docstrings" button. The AI will read the code in the editor and insert documentation above the functions.
-   **System Instruction**: "Generate idiomatic Rust docstrings for the following functions. Only output the full, updated code..."

---

### 7. AI Frontend Snippet Generation

-   **Location**: JS-Rust API Bridge Card
-   **Description**: Generates the corresponding TypeScript code needed to call your Rust API commands from the frontend.
-   **How to Use**: Click the "Generate JS Snippet" button. The AI will analyze the Rust commands and create the necessary TypeScript `invoke` calls.
-   **System Instruction**: "Given the following Rust tauri commands, generate the corresponding TypeScript functions... Only output the raw TypeScript code."

---

### 8. AI-Assisted Configuration

-   **Location**: Application Configuration Card
-   **Description**: Modifies the `toolkit.conf.json` file based on a natural language request.
-   **How to Use**: Type a request like "change the window title to 'My App'" into the input field and click "Apply".
-   **System Instruction**: "Modify the JSON to satisfy the request. ONLY output the raw, updated JSON object."

---

### 9. AI Build Log Analysis

-   **Location**: Cross-Platform Builds Card
-   **Description**: Analyzes a completed build log to provide a summary, diagnose errors, or offer optimization suggestions.
-   **How to Use**: After running a build, click the "Analyze Build Log with AI" button that appears below the terminal.
-   **System Instruction**: "Analyze the following terminal build log and provide a concise summary with any potential errors or optimization suggestions."

---

### 10. AI Build Script Generator

-   **Location**: AI Build Script Generator Card
-   **Description**: Generates a shell script (`build.sh`) based on a high-level description of build steps.
-   **How to Use**: Describe your desired process (e.g., "compile for release, then zip the binary") in the text area and click "Generate Script".
-   **System Instruction**: "You are a shell scripting expert. Generate a `build.sh` script based on the user's request. Only output the raw script."

---

### 11. AI Developer Chat

-   **Location**: AI Assistant Card
-   **Description**: A conversational chat interface for asking questions, brainstorming ideas, or debugging problems. The chat maintains conversation history for context.
-   **How to Use**: Type your question into the input field and press Enter or click "Send".
-   **System Instruction**: "You are a helpful AI assistant for a developer working with a Rust-based cross-platform toolkit. Be concise and helpful."
