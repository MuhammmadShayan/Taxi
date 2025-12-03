import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/auth';

// Helper function to validate setting data
function validateSetting(setting) {
	const errors = [];
	
	if (!setting.setting_key || setting.setting_key.trim() === '') {
		errors.push('Setting key is required');
	}
	
	if (setting.setting_key && setting.setting_key.length > 100) {
		errors.push('Setting key must be 100 characters or less');
	}
	
	if (!['text', 'number', 'boolean', 'json'].includes(setting.type)) {
		errors.push('Invalid setting type');
	}
	
	if (setting.type === 'number' && isNaN(parseFloat(setting.setting_value))) {
		errors.push('Setting value must be a valid number');
	}
	
	if (setting.type === 'boolean' && !['true', 'false'].includes(setting.setting_value?.toLowerCase())) {
		errors.push('Boolean setting value must be "true" or "false"');
	}
	
	return errors;
}

// GET - Fetch all settings or settings by category
export async function GET(request) {
	const token = request.cookies.get('session')?.value;
	const session = token ? verifySessionToken(token) : null;
	if (!session || session.user_type !== 'admin') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const category = searchParams.get('category');
		const grouped = searchParams.get('grouped') === 'true';

		let sql = 'SELECT setting_id as id, setting_key, setting_value, description, type, category, display_order, is_active FROM system_settings';
		let params = [];

		if (category) {
			sql += ' WHERE category = ?';
			params.push(category);
		}

		sql += ' ORDER BY category, display_order, setting_key';

		const settings = await query(sql, params);

		if (grouped) {
			// Group settings by category
			const groupedSettings = settings.reduce((acc, setting) => {
				if (!acc[setting.category]) {
					acc[setting.category] = [];
				}
				acc[setting.category].push(setting);
				return acc;
			}, {});

			return NextResponse.json({ 
				settings: groupedSettings,
				categories: Object.keys(groupedSettings).sort()
			});
		}

		return NextResponse.json({ settings });
	} catch (error) {
		console.error('Error fetching settings:', error);
		return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
	}
}

// POST - Create a new setting
export async function POST(request) {
	const token = request.cookies.get('session')?.value;
	const session = token ? verifySessionToken(token) : null;
	if (!session || session.user_type !== 'admin') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const setting = await request.json();
		
		// Validate setting data
		const errors = validateSetting(setting);
		if (errors.length > 0) {
			return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
		}

		// Check if setting key already exists
		const existing = await query('SELECT setting_id FROM system_settings WHERE setting_key = ?', [setting.setting_key]);
		if (existing.length > 0) {
			return NextResponse.json({ error: 'Setting key already exists' }, { status: 409 });
		}

		// Insert new setting
		const result = await query(
			'INSERT INTO system_settings (setting_key, setting_value, description, type, category, display_order) VALUES (?, ?, ?, ?, ?, ?)',
			[
				setting.setting_key,
				setting.setting_value || '',
				setting.description || '',
				setting.type || 'text',
				setting.category || 'general',
				setting.display_order || 0
			]
		);

		return NextResponse.json({ 
			message: 'Setting created successfully',
			setting_id: result.insertId
		}, { status: 201 });
	} catch (error) {
		console.error('Error creating setting:', error);
		return NextResponse.json({ error: 'Failed to create setting' }, { status: 500 });
	}
}

// PUT - Update settings (single or bulk)
export async function PUT(request) {
	const token = request.cookies.get('session')?.value;
	const session = token ? verifySessionToken(token) : null;
	if (!session || session.user_type !== 'admin') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const data = await request.json();
		
		// Handle both single setting and bulk update
		const settings = Array.isArray(data.settings) ? data.settings : [data];
		const errors = [];
		const updated = [];

		// Validate all settings first
		for (const setting of settings) {
			const validationErrors = validateSetting(setting);
			if (validationErrors.length > 0) {
				errors.push({
					setting_key: setting.setting_key,
					errors: validationErrors
				});
			}
		}

		if (errors.length > 0) {
			return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
		}

		// Update each setting
		for (const setting of settings) {
			try {
				let result;
				
				if (setting.setting_id) {
					// Update by ID
					result = await query(
						'UPDATE system_settings SET setting_value = ?, description = ?, type = ?, category = ?, display_order = ? WHERE setting_id = ?',
						[
							setting.setting_value,
							setting.description,
							setting.type,
							setting.category,
							setting.display_order || 0,
							setting.setting_id
						]
					);
				} else {
					// Update by key
					result = await query(
						'UPDATE system_settings SET setting_value = ? WHERE setting_key = ?',
						[setting.setting_value, setting.setting_key]
					);
				}

				if (result.affectedRows > 0) {
					updated.push(setting.setting_key);
				}
			} catch (err) {
				console.error(`Error updating setting ${setting.setting_key}:`, err);
				errors.push({
					setting_key: setting.setting_key,
					errors: ['Failed to update setting']
				});
			}
		}

		return NextResponse.json({ 
			message: `Successfully updated ${updated.length} setting(s)`,
			updated,
			errors: errors.length > 0 ? errors : undefined
		});
	} catch (error) {
		console.error('Error updating settings:', error);
		return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
	}
}

// DELETE - Delete a setting
export async function DELETE(request) {
	const token = request.cookies.get('session')?.value;
	const session = token ? verifySessionToken(token) : null;
	if (!session || session.user_type !== 'admin') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const settingId = searchParams.get('id');
		const settingKey = searchParams.get('key');

		if (!settingId && !settingKey) {
			return NextResponse.json({ error: 'Setting ID or key is required' }, { status: 400 });
		}

		let result;
		if (settingId) {
			result = await query('DELETE FROM system_settings WHERE setting_id = ?', [settingId]);
		} else {
			result = await query('DELETE FROM system_settings WHERE setting_key = ?', [settingKey]);
		}

		if (result.affectedRows === 0) {
			return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Setting deleted successfully' });
	} catch (error) {
		console.error('Error deleting setting:', error);
		return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 });
	}
}


