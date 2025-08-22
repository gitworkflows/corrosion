# Deployment Guide

This guide provides step-by-step instructions for deploying the Corrosion dashboard to a live URL using popular hosting platforms. The key to a successful deployment is correctly configuring the serverless functions that act as a secure proxy to the Google Gemini API.

## The Golden Rule: Set Your Environment Variable

The serverless functions (`/api/generate.ts` and `/netlify/functions/generate.ts`) are designed to read your Google Gemini API key from an environment variable named `API_KEY`. **This is the most critical step.** If this variable is not set on your deployment platform, all AI features will fail.

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
