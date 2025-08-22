# Deployment Guide

This guide provides step-by-step instructions for deploying the Corrosion dashboard to a live URL.

## The Golden Rule: Set Your Environment Variable

For deployments to Vercel or Netlify, the serverless functions (`/api/generate.ts` and `/netlify/functions/generate.ts`) are designed to read your Google Gemini API key from an environment variable named `API_KEY`. **This is the most critical step.** If this variable is not set on your deployment platform, all AI features will fail.

---

## Deploying to Vercel

Vercel provides seamless integration with Git and automatically detects and deploys serverless functions in the `/api` directory.

1.  **Push to a Git Repository**: Make sure your project is pushed to a GitHub, GitLab, or Bitbucket repository.

2.  **Import Project in Vercel**:
    -   Log in to your Vercel dashboard.
    -   Click "Add New..." -> "Project".
    -   Select your Git repository. Vercel will automatically detect the project settings.

3.  **Configure Environment Variable**:
    -   Before deploying, navigate to the "Settings" tab of your new Vercel project.
    -   Click on "Environment Variables" in the left-hand menu.
    -   Create a new variable:
        -   **Name**: `API_KEY`
        -   **Value**: Paste your Google Gemini API key here.
    -   Ensure the variable is available to all environments (Production, Preview, Development).
    -   Click **Save**.

4.  **Deploy**:
    -   Navigate to the "Deployments" tab.
    -   Trigger a new deployment. Vercel will build the project and deploy the serverless function. Your site will be live!

---

## Deploying to Netlify

Netlify also offers excellent Git integration and will automatically handle the serverless functions defined in the `netlify/functions` directory.

1.  **Push to a Git Repository**: Ensure your project is available on GitHub, GitLab, or Bitbucket.

2.  **Create a New Site in Netlify**:
    -   Log in to your Netlify dashboard.
    -   Click "Add new site" -> "Import an existing project".
    -   Connect to your Git provider and select your repository.

3.  **Configure Build Settings**:
    -   Netlify should auto-detect the settings. The `netlify.toml` file tells it where the functions are located.
    -   The build command should be empty, and the publish directory should be the project root.

4.  **Configure Environment Variable**:
    -   After the site is created, go to the site's dashboard.
    -   Navigate to "Site configuration" -> "Build & deploy" -> "Environment".
    -   Click "Edit variables" under "Environment variables".
    -   Add a new variable:
        -   **Key**: `API_KEY`
        -   **Value**: Paste your Google Gemini API key here.
    -   Click **Save**.

5.  **Deploy**:
    -   Go to the "Deploys" tab for your site.
    -   Click "Trigger deploy" -> "Deploy site". Netlify will build and deploy your application and functions.

---

## Deploying with Docker

The provided `Dockerfile` creates a portable, self-contained image of the frontend application. This image can be deployed to any cloud provider that supports containers.

**Note**: This Docker image only contains the static frontend. It does **not** include the serverless backend for AI features. To use AI features, you would need a separate deployment for the serverless functions (e.g., using Vercel/Netlify as described above) and configure the frontend to point to that API endpoint.

### General Workflow

1.  **Build the Image**:
    ```bash
    docker build -t your-registry/corrosion-dashboard:latest .
    ```

2.  **Push to a Container Registry**:
    Push the image to a registry like Docker Hub, Google Container Registry (GCR), Amazon Elastic Container Registry (ECR), etc.
    ```bash
    docker push your-registry/corrosion-dashboard:latest
    ```

3.  **Deploy on a Cloud Provider**:
    Use the pushed image to create a deployment on a service like:
    -   Google Cloud Run
    -   AWS Fargate
    -   Azure Container Apps
    -   DigitalOcean App Platform

    These services will pull your image from the registry and run it, making your application accessible at a public URL.
