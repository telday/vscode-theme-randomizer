# Theme Randomizer 🎨

> **Note:** This entire extension was "vibe coded" using AI assistance! 🤖 Because apparently even our code editors need a little chaos in their lives. Who needs consistency when you can have delightful unpredictability?

Automatically randomize your VS Code theme at configurable intervals! Perfect for developers who can't make up their mind about color schemes, or those who believe variety is the spice of coding life.

## Features

🎲 **Automatic Theme Switching**: Set it and forget it! Your theme will change automatically based on your configured interval.

⚡ **Manual Theme Changes**: Feeling impatient? Trigger a theme change instantly with a command.

🎛️ **Flexible Intervals**: From 10 seconds (for the truly chaotic) to ~24.8 days (for the commitment-phobic).

🔧 **Smart Theme Selection**: Never get stuck with the same theme twice in a row - the extension intelligently excludes your current theme.

📝 **Configurable Notifications**: Choose whether you want to be notified when themes change.

🔄 **Persistent State**: Your settings and timers survive VS Code restarts.

## Commands

Access these commands via the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux):

- `Theme Randomizer: Change Theme Now` - Instantly switch to a random theme
- `Theme Randomizer: Toggle Auto Change` - Enable or disable automatic theme changing

## Extension Settings

This extension contributes the following settings:

- `themeRandomizer.intervalSeconds`: Seconds between automatic theme changes (minimum 10 seconds, maximum ~24 days). Default: 86400 (24 hours)
- `themeRandomizer.enabled`: Enable/disable automatic theme changing. Default: `true`
- `themeRandomizer.showNotifications`: Show notifications when theme changes. Default: `true`

### Example Configuration

```json
{
    "themeRandomizer.intervalSeconds": 3600,
    "themeRandomizer.enabled": true,
    "themeRandomizer.showNotifications": false
}
```

## Requirements

- VS Code 1.102.0 or higher
- At least 2 themes installed (built-in themes count!)

## How It Works

The extension scans for all available themes (both built-in VS Code themes and themes from installed extensions), randomly selects one that's different from your current theme, and applies it. The timer intelligently handles VS Code restarts and remembers when it last changed your theme.

## Known Issues

- Very large interval values (over ~24.8 days) are automatically capped due to JavaScript setTimeout limitations
- The extension only changes color themes, not icon themes or product icon themes

## Release Notes

### 0.0.1

Initial release featuring:

- Automatic theme randomization with configurable intervals
- Manual theme change commands
- Smart theme selection (excludes current theme)
- Persistent state across restarts
- Overflow protection for large intervals

---

**Enjoy your chaotic coding experience!** 🎊
