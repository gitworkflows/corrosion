# Application Distribution

Once your application has been successfully built, the final step is to package it for distribution to your users. Corrosion provides a streamlined process for creating installers and packages for all major platforms.

The "Cross-Platform Builds" card in the dashboard includes an interactive workflow to simulate this process. After a build for a platform succeeds, a "Distribute" button will appear, allowing you to choose from the available formats.

---

## Linux

For Linux, you can distribute your app using several popular formats to cater to different distributions and user preferences.

-   **AppImage**: Creates a single, portable executable file (`.AppImage`) that can run on most modern Linux distributions without installation. This is excellent for easy portability.
-   **Snap**: A containerized package format managed by Canonical. Snaps are auto-updating and work across a wide range of Linux distributions.
-   **Debian Package (.deb)**: The standard package format for Debian-based distributions like Ubuntu, Mint, etc. This allows users to install the application using system package managers like `apt`.
-   **RPM / AUR / Flatpak**: While not simulated in the dashboard, a full toolkit would also support formats for Red Hat-based systems, the Arch User Repository, and the universal Flatpak format.

---

## macOS

For macOS, you have two primary distribution methods. Both require an Apple Developer account for code signing and notarization to ensure the app is trusted by macOS's Gatekeeper.

-   **DMG Installer**: The most common method for distributing apps outside the App Store. This bundles your application (`.app`) into a single disk image file (`.dmg`) that users can download, open, and drag the app into their Applications folder. The simulated process includes steps for code signing and notarization.
-   **App Store**: This option packages your application for submission to the official Mac App Store. This involves a stricter review process by Apple but provides users with a trusted and easy installation experience.

---

## Windows

For Windows, you can distribute your application via the Microsoft Store or as a standalone installer.

-   **MSI Installer**: The Microsoft Installer (`.msi`) is a standard, robust installer format for Windows. It provides a familiar setup wizard for users and handles installation, uninstallation, and updates.
-   **Microsoft Store**: This packages your application for submission to the Microsoft Store, providing a secure and seamless installation and update experience for Windows 10 and 11 users.

---

## Android

-   **Google Play**: Packages your application into an Android App Bundle (`.aab`) for submission to the Google Play Store. This is the standard and recommended way to distribute Android apps.
-   **APK Sideload**: Creates a standalone Android Package (`.apk`) file. This can be manually installed by users who enable "sideloading" on their devices. It's useful for direct distribution or for use in alternative app stores.

---

## iOS

Distribution for iOS is almost exclusively handled through Apple's official channels.

-   **App Store**: Packages your application (`.ipa`) for submission to the Apple App Store, the primary way users install apps on iPhones and iPads.
-   **TestFlight**: A service provided by Apple to distribute beta versions of your app to a select group of testers before the official release.
---

## Automated Releases with GitHub Actions

To streamline the release process, Corrosion uses a GitHub Actions workflow that automates building, packaging, and publishing new versions of the application.

### How it Works

1.  **Trigger**: The workflow is automatically triggered whenever a new Git tag is pushed to the repository that follows the version format `v*.*.*` (e.g., `v1.0.0`, `v1.2.3-beta`).

2.  **Build**: The action runs jobs that simulate building the application for Linux, macOS, and Windows. In a real-world scenario, these jobs would perform the actual compilation and packaging steps for each platform.

3.  **Create Release**: Once the builds are complete, the workflow creates a new, public **GitHub Release**. The release is titled with the version tag.

4.  **Attach Assets**: The built artifacts (e.g., `corrosion-linux.tar.gz`, `corrosion-macos.dmg`, `corrosion-windows.zip`) are automatically uploaded to the GitHub Release as assets.

This process ensures that every release is consistent, and the packaged application is immediately available for users to download directly from the project's GitHub page. You can view the workflow configuration in the `.github/workflows/release.yml` file.