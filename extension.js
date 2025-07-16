// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let themeChangeTimer = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Theme Randomizer extension is now active!');

	// Register commands
	const changeThemeNowDisposable = vscode.commands.registerCommand('theme-randomizer.changeThemeNow', async () => {
		await changeThemeRandomly(context);
	});

	const toggleAutoChangeDisposable = vscode.commands.registerCommand('theme-randomizer.toggleAutoChange', async () => {
		const config = vscode.workspace.getConfiguration('themeRandomizer');
		const currentlyEnabled = config.get('enabled');
		await config.update('enabled', !currentlyEnabled, vscode.ConfigurationTarget.Global);
		
		if (!currentlyEnabled) {
			setupThemeTimer(context);
			vscode.window.showInformationMessage('Theme Randomizer: Auto-change enabled');
		} else {
			clearThemeTimer();
			vscode.window.showInformationMessage('Theme Randomizer: Auto-change disabled');
		}
	});

	context.subscriptions.push(changeThemeNowDisposable, toggleAutoChangeDisposable);

	// Listen for configuration changes
	const configChangeDisposable = vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('themeRandomizer')) {
			setupThemeTimer(context);
		}
	});

	context.subscriptions.push(configChangeDisposable);

	// Initialize the timer
	setupThemeTimer(context);
}

/**
 * Get all available themes
 */
async function getAllThemes() {
	// Get all extensions that contribute themes
	const extensions = vscode.extensions.all;
	const themes = [];

	// Add built-in themes
	const builtInThemes = [
		'Default Dark+',
		'Default Light+',
		'Default High Contrast',
		'Default High Contrast Light',
		'Abyss',
		'Kimbie Dark',
		'Monokai',
		'Monokai Dimmed',
		'Quiet Light',
		'Red',
		'Solarized Dark',
		'Solarized Light',
		'Tomorrow Night Blue'
	];

	themes.push(...builtInThemes);

	// Get themes from extensions
	for (const extension of extensions) {
		if (extension.packageJSON?.contributes?.themes) {
			for (const theme of extension.packageJSON.contributes.themes) {
				if (theme.label) {
					themes.push(theme.label);
				}
			}
		}
	}

	return [...new Set(themes)]; // Remove duplicates
}

/**
 * Get the current theme
 */
function getCurrentTheme() {
	const config = vscode.workspace.getConfiguration('workbench');
	return config.get('colorTheme');
}

/**
 * Change to a random theme
 */
async function changeThemeRandomly(context) {
	try {
		const allThemes = await getAllThemes();
		const currentTheme = getCurrentTheme();
		
		// Filter out the current theme
		const availableThemes = allThemes.filter(theme => theme !== currentTheme);
		
		if (availableThemes.length === 0) {
			vscode.window.showWarningMessage('Theme Randomizer: No other themes available to switch to');
			return;
		}

		// Pick a random theme
		const randomIndex = Math.floor(Math.random() * availableThemes.length);
		const newTheme = availableThemes[randomIndex];

		// Apply the new theme
		const config = vscode.workspace.getConfiguration('workbench');
		await config.update('colorTheme', newTheme, vscode.ConfigurationTarget.Global);

		// Store the last change time
		await context.globalState.update('lastThemeChange', Date.now());

		// Show notification if enabled
		const themeConfig = vscode.workspace.getConfiguration('themeRandomizer');
		const showNotifications = themeConfig.get('showNotifications');
		
		if (showNotifications) {
			vscode.window.showInformationMessage(`Theme changed to: ${newTheme}`);
		}

		console.log(`Theme Randomizer: Changed theme to ${newTheme}`);
	} catch (error) {
		console.error('Theme Randomizer: Error changing theme:', error);
		vscode.window.showErrorMessage('Theme Randomizer: Failed to change theme');
	}
}

/**
 * Setup the theme change timer
 */
function setupThemeTimer(context) {
	clearThemeTimer();

	const config = vscode.workspace.getConfiguration('themeRandomizer');
	const enabled = config.get('enabled');
	
	if (!enabled) {
		console.log('Theme Randomizer: Auto-change is disabled');
		return;
	}

	let intervalSeconds = config.get('intervalSeconds');
	
	// JavaScript setTimeout max value is 2^31-1 milliseconds (~24.8 days)
	const MAX_TIMEOUT_MS = 2147483647;
	const MAX_INTERVAL_SECONDS = Math.floor(MAX_TIMEOUT_MS / 1000); // ~2,147,483 seconds (~24.8 days)
	
	// Ensure minimum interval of 10 seconds
	if (intervalSeconds < 10) {
		intervalSeconds = 10;
		console.log('Theme Randomizer: Interval too small, using minimum of 10 seconds');
	}
	
	// Ensure maximum interval to prevent setTimeout overflow
	if (intervalSeconds > MAX_INTERVAL_SECONDS) {
		intervalSeconds = MAX_INTERVAL_SECONDS;
		console.log(`Theme Randomizer: Interval too large, using maximum of ${MAX_INTERVAL_SECONDS} seconds (~24.8 days)`);
	}
	
	const intervalMs = intervalSeconds * 1000; // Convert seconds to milliseconds

	// Check if enough time has passed since last change
	const lastChange = context.globalState.get('lastThemeChange', 0);
	const timeSinceLastChange = Date.now() - lastChange;
	
	let timeUntilNextChange;
	
	if (timeSinceLastChange >= intervalMs) {
		// Enough time has passed, change theme now
		timeUntilNextChange = 0;
	} else {
		// Calculate remaining time
		timeUntilNextChange = intervalMs - timeSinceLastChange;
	}

	// Additional safety check for setTimeout limit
	if (timeUntilNextChange > MAX_TIMEOUT_MS) {
		timeUntilNextChange = MAX_TIMEOUT_MS;
		console.log('Theme Randomizer: Next timeout capped at maximum setTimeout limit');
	}

	themeChangeTimer = setTimeout(async () => {
		await changeThemeRandomly(context);
		// Set up the next timer
		setupThemeTimer(context);
	}, timeUntilNextChange);

	// Better logging with human-readable time
	const secondsUntilNext = Math.ceil(timeUntilNextChange / 1000);
	const timeString = formatTimeString(secondsUntilNext);
	console.log(`Theme Randomizer: Next theme change in ${timeString} (${secondsUntilNext} seconds)`);
}

/**
 * Format seconds into a human-readable string
 */
function formatTimeString(seconds) {
	if (seconds < 60) {
		return `${seconds} second(s)`;
	} else if (seconds < 3600) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes} minute(s) and ${remainingSeconds} second(s)`;
	} else if (seconds < 86400) {
		const hours = Math.floor(seconds / 3600);
		const remainingMinutes = Math.floor((seconds % 3600) / 60);
		return `${hours} hour(s) and ${remainingMinutes} minute(s)`;
	} else {
		const days = Math.floor(seconds / 86400);
		const remainingHours = Math.floor((seconds % 86400) / 3600);
		return `${days} day(s) and ${remainingHours} hour(s)`;
	}
}

/**
 * Clear the theme change timer
 */
function clearThemeTimer() {
	if (themeChangeTimer) {
		clearTimeout(themeChangeTimer);
		themeChangeTimer = null;
	}
}

// This method is called when your extension is deactivated
function deactivate() {
	clearThemeTimer();
}

module.exports = {
	activate,
	deactivate
}
