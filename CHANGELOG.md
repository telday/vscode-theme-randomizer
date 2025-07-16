# Changelog

All notable changes to the "theme-randomizer" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2025-07-16

### Added

- Automatic theme randomization with configurable intervals (10 seconds to ~24.8 days)
- Manual theme change command (`Theme Randomizer: Change Theme Now`)
- Toggle command for enabling/disabling auto-change (`Theme Randomizer: Toggle Auto Change`)
- Smart theme selection that excludes the current theme
- Configurable settings:
  - `themeRandomizer.intervalSeconds`: Set the interval between theme changes
  - `themeRandomizer.enabled`: Enable/disable automatic theme changing
  - `themeRandomizer.showNotifications`: Control notification display
- Persistent state across VS Code restarts
- Overflow protection for large interval values
- Human-readable logging with time formatting
- Support for both built-in and extension themes

### Technical Details

- Extension activates on startup (`onStartupFinished`)
- Uses global state to persist last theme change timestamp
- Implements JavaScript setTimeout overflow protection
- Automatically detects and excludes current theme from selection pool