# Getting Started

This guide will walk you through setting up your development environment and running the Corrosion dashboard locally.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   (For Option C) [Docker](https://www.docker.com/get-started/)
-   (Optional but Recommended) The CLI for your preferred deployment platform:
    -   [Vercel CLI](https://vercel.com/docs/cli)
    -   [Netlify CLI](https://docs.netlify.com/cli/get-started/)

## 1. Clone the Repository

Start by cloning the project to your local machine:

```bash
git clone <repository_url>
cd corrosion-toolkit
```

## 2. Install Dependencies (For Serverless Only)

The project uses a `package.json` to manage serverless function dependencies. This is **only required for Option B**.

```bash
npm install
```

## 3. Running the Dashboard

You have three options for running the dashboard locally.

### Option A: Simple Static Server (No AI Features)

This is the quickest way to see the UI. It runs a simple web server, but the AI features will not work (they will return mock data instead).

1.  Start a local server from the root directory:
    ```bash
    python -m http.server
    # Or use any other static server you prefer
    ```
2.  Open your browser to `http://localhost:8000`.

You will see a warning in the browser console indicating that the API endpoint was not found and that mock data is being used.

### Option B: Full Serverless Environment (All Features Enabled)

To use the AI-powered features, you must run a local development server that can emulate the cloud environment for the serverless functions.

#### Setup Your API Key

1.  First, get an API key for the Google Gemini API from [Google AI Studio](https://aistudio.google.com/app/apikey).

2.  Create an environment file to store your key. The filename depends on your chosen platform:
    -   **For Vercel:** Create a file named `.env.local`
    -   **For Netlify:** Create a file named `.env`

3.  Add your API key to the file you just created:
    ```
    API_KEY="your_google_gemini_api_key_here"
    ```

#### Launch the Development Server

Now, run the command for your chosen platform from the project root:

-   **For Vercel:**
    ```bash
    vercel dev
    ```

-   **For Netlify:**
    ```bash
    netlify dev
    ```

The CLI will start a local server (usually on a port like `3000` or `8888`) and print the URL in the terminal. Open this URL in your browser.

### Option C: Running with Docker (No AI Features)

This option provides a consistent, isolated environment using Docker. Note that this runs the static frontend only; it does not include the serverless backend for AI features.

1.  **Build the Docker Image**:
    From the root of the project, run the build command:
    ```bash
    docker build -t corrosion-dashboard .
    ```

2.  **Run the Docker Container**:
    Once the image is built, run it. This command maps port 8080 on your local machine to port 80 inside the container.
    ```bash
    docker run -p 8080:80 corrosion-dashboard
    ```

3.  Open your browser to `http://localhost:8080`.

## Next Steps

Now that you have the project running, it's a great time to explore the [Core Concepts](./core-concepts.md) to understand the underlying architecture.