import * as vscode from 'vscode';

export async function registerNDate(text: string, editor: vscode.TextEditor): Promise<void> {
	if (!text.includes('@ndate')) { return; }

	const document = editor.document;
	const position = editor.selection.active;

	const selection = await vscode.window.showQuickPick(
		[
			{ label: 'Date (YYYY-MM-DD)', description: 'Generate a date in YYYY-MM-DD format' },
			{ label: 'Date (YYYY/MM/DD)', description: 'Generate a date in YYYY/MM/DD format' },
			{ label: 'Date (MM-DD-YYYY)', description: 'Generate a date in MM-DD-YYYY format' },
			{ label: 'Date (MM/DD/YYYY)', description: 'Generate a date in MM/DD/YYYY format' },
			{ label: 'Date (DD-MM-YYYY)', description: 'Generate a date in DD-MM-YYYY format' },
			{ label: 'Date (DD/MM/YYYY)', description: 'Generate a date in DD/MM/YYYY format' },
			{ label: 'DateTime (YYYY-MM-DD HH:mm:ss)', description: 'Generate a datetime in YYYY-MM-DD HH:mm:ss format' },
			{ label: 'DateTime (YYYY/MM/DD HH:mm:ss)', description: 'Generate a datetime in YYYY/MM/DD HH:mm:ss format' },
			{ label: 'DateTime (MM-DD-YYYY HH:mm:ss)', description: 'Generate a datetime in MM-DD-YYYY HH:mm:ss format' },
			{ label: 'DateTime (MM/DD/YYYY HH:mm:ss)', description: 'Generate a datetime in MM/DD/YYYY HH:mm:ss format' },
			{ label: 'DateTime (DD-MM-YYYY HH:mm:ss)', description: 'Generate a datetime in DD-MM-YYYY HH:mm:ss format' },
			{ label: 'DateTime (DD/MM/YYYY HH:mm:ss)', description: 'Generate a datetime in DD/MM/YYYY HH:mm:ss format' },
			{ label: 'UTC DateTime (YYYY-MM-DD HH:mm:ss)', description: 'Generate a UTC datetime in YYYY-MM-DD HH:mm:ss format' },
			{ label: 'UTC DateTime (YYYY/MM/DD HH:mm:ss)', description: 'Generate a UTC datetime in YYYY/MM/DD HH:mm:ss format' }
		],
		{ placeHolder: 'Select Date format' }
	);

	if (!selection) {
		return;
	}

	// Delete @ndate keyword
	const range = document.getWordRangeAtPosition(position, /@ndate/);
	if (range) {
		await editor.edit((editBuilder) => {
			editBuilder.delete(range);
		});
	}

	// Generate corresponding Date and DateTime format based on selection
	let generatedValue: string;
	const now = new Date();

	switch (selection.label) {
		case 'Date (YYYY-MM-DD)':
			generatedValue = now.toISOString().substring(0, 10); // YYYY-MM-DD
			break;
		case 'Date (YYYY/MM/DD)':
			generatedValue = now.toISOString().substring(0, 10).replace(/-/g, '/'); // YYYY/MM/DD
			break;
		case 'Date (MM-DD-YYYY)':
			generatedValue = formatDate(now, '-', 'MM-DD-YYYY');
			break;
		case 'Date (MM/DD/YYYY)':
			generatedValue = formatDate(now, '/', 'MM-DD-YYYY');
			break;
		case 'Date (DD-MM-YYYY)':
			generatedValue = formatDate(now, '-', 'DD-MM-YYYY');
			break;
		case 'Date (DD/MM/YYYY)':
			generatedValue = formatDate(now, '/', 'DD-MM-YYYY');
			break;
		case 'DateTime (YYYY-MM-DD HH:mm:ss)':
			generatedValue = now.toISOString().replace('T', ' ').substring(0, 19); // YYYY-MM-DD HH:mm:ss
			break;
		case 'DateTime (YYYY/MM/DD HH:mm:ss)':
			generatedValue = now.toISOString().replace('T', ' ').substring(0, 19).replace(/-/g, '/'); // YYYY/MM/DD HH:mm:ss
			break;
		case 'DateTime (MM-DD-YYYY HH:mm:ss)':
			generatedValue = formatDate(now, '-', 'MM-DD-YYYY') + ' ' + formatTime(now);
			break;
		case 'DateTime (MM/DD/YYYY HH:mm:ss)':
			generatedValue = formatDate(now, '/', 'MM-DD-YYYY') + ' ' + formatTime(now);
			break;
		case 'DateTime (DD-MM-YYYY HH:mm:ss)':
			generatedValue = formatDate(now, '-', 'DD-MM-YYYY') + ' ' + formatTime(now);
			break;
		case 'DateTime (DD/MM/YYYY HH:mm:ss)':
			generatedValue = formatDate(now, '/', 'DD-MM-YYYY') + ' ' + formatTime(now);
			break;
		case 'UTC DateTime (YYYY-MM-DD HH:mm:ss)':
			generatedValue = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'; // UTC YYYY-MM-DD HH:mm:ss
			break;
		case 'UTC DateTime (YYYY/MM/DD HH:mm:ss)':
			generatedValue = now.toISOString().replace('T', ' ').substring(0, 19).replace(/-/g, '/') + ' UTC'; // UTC YYYY/MM/DD HH:mm:ss
			break;
		default:
			generatedValue = '';
	}

	await editor.edit((editBuilder) => {
		editBuilder.insert(position, generatedValue);
	});
}

function formatDate(date: Date, separator: string, format: string): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	switch (format) {
		case 'MM-DD-YYYY':
			return `${month}${separator}${day}${separator}${year}`;
		case 'DD-MM-YYYY':
			return `${day}${separator}${month}${separator}${year}`;
		default:
			return `${year}${separator}${month}${separator}${day}`;
	}
}

function formatTime(date: Date): string {
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
}
