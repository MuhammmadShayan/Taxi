'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function SystemSettings() {
	const [settings, setSettings] = useState({
		site_name: 'HOLIKEY',
		site_description: 'Your Multi-Vendor Vehicle Rental Platform',
		site_url: 'https://holikey.com',
		admin_email: 'admin@holikey.com',
		support_email: 'support@holikey.com',
		phone: '+212 600 123 456',
		currency: 'MAD',
		timezone: 'Africa/Casablanca',
		language: 'en',
		date_format: 'Y-m-d',
		time_format: '24h',
		registration_enabled: true,
		email_verification: true,
		auto_approve_agencies: false,
		maintenance_mode: false,
		max_upload_size: '10',
		session_timeout: '60',
		backup_frequency: 'daily',
		debug_mode: false,
		cache_enabled: true,
		api_rate_limit: '1000',
		google_maps_api: '',
		smtp_host: 'smtp.gmail.com',
		smtp_port: '587',
		smtp_username: '',
		smtp_password: '',
		smtp_encryption: 'tls',
		social_login_google: false,
		social_login_facebook: false,
		payment_stripe_enabled: false,
		payment_paypal_enabled: false,
		seo_meta_title: 'HOLIKEY - Vehicle Rental Platform',
		seo_meta_description: 'Find and rent vehicles from trusted agencies worldwide',
		seo_meta_keywords: 'car rental, vehicle rental, booking, travel',
		analytics_google: '',
		analytics_facebook_pixel: ''
	});
	
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState('');
	const [activeTab, setActiveTab] = useState('general');

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/system-settings');
			if (!response.ok) throw new Error('Failed to fetch settings');
			const data = await response.json();
			setSettings({...settings, ...data.settings});
		} catch (err) {
			console.error('Error fetching settings:', err);
			setError('Failed to load settings - Using default values');
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			setError('');
			setSuccess('');
			
			const response = await fetch('/api/admin/system-settings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(settings)
			});
			
			if (!response.ok) throw new Error('Failed to save settings');
			
			setSuccess('Settings saved successfully!');
			setTimeout(() => setSuccess(''), 3000);
		} catch (err) {
			console.error('Error saving settings:', err);
			setError('Failed to save settings. Please try again.');
		} finally {
			setSaving(false);
		}
	};

	const handleInputChange = (key, value) => {
		setSettings(prev => ({
			...prev,
			[key]: value
		}));
	};

	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Admin', href: '/admin' },
		{ label: 'System Settings' }
	];

	const tabs = [
		{ key: 'general', label: 'General', icon: 'la-cogs' },
		{ key: 'email', label: 'Email', icon: 'la-envelope' },
		{ key: 'security', label: 'Security', icon: 'la-shield' },
		{ key: 'integrations', label: 'Integrations', icon: 'la-plug' },
		{ key: 'seo', label: 'SEO', icon: 'la-search' },
		{ key: 'advanced', label: 'Advanced', icon: 'la-code' }
	];

	const renderGeneralTab = () => (
		<div className="row">
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Site Name *</label>
					<input
						type="text"
						className="form-control"
						value={settings.site_name}
						onChange={(e) => handleInputChange('site_name', e.target.value)}
						placeholder="Enter site name"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Site URL *</label>
					<input
						type="url"
						className="form-control"
						value={settings.site_url}
						onChange={(e) => handleInputChange('site_url', e.target.value)}
						placeholder="https://example.com"
					/>
				</div>
			</div>
			<div className="col-12">
				<div className="form-group">
					<label className="label-text">Site Description</label>
					<textarea
						className="form-control"
						rows="3"
						value={settings.site_description}
						onChange={(e) => handleInputChange('site_description', e.target.value)}
						placeholder="Enter site description"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Admin Email *</label>
					<input
						type="email"
						className="form-control"
						value={settings.admin_email}
						onChange={(e) => handleInputChange('admin_email', e.target.value)}
						placeholder="admin@example.com"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Support Email</label>
					<input
						type="email"
						className="form-control"
						value={settings.support_email}
						onChange={(e) => handleInputChange('support_email', e.target.value)}
						placeholder="support@example.com"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Phone Number</label>
					<input
						type="tel"
						className="form-control"
						value={settings.phone}
						onChange={(e) => handleInputChange('phone', e.target.value)}
						placeholder="+212 600 123 456"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Default Currency</label>
					<select
						className="form-control"
						value={settings.currency}
						onChange={(e) => handleInputChange('currency', e.target.value)}
					>
						<option value="MAD">MAD - Moroccan Dirham</option>
						<option value="USD">USD - US Dollar</option>
						<option value="EUR">EUR - Euro</option>
						<option value="GBP">GBP - British Pound</option>
					</select>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Timezone</label>
					<select
						className="form-control"
						value={settings.timezone}
						onChange={(e) => handleInputChange('timezone', e.target.value)}
					>
						<option value="Africa/Casablanca">Africa/Casablanca</option>
						<option value="Europe/London">Europe/London</option>
						<option value="America/New_York">America/New_York</option>
						<option value="Europe/Paris">Europe/Paris</option>
					</select>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Default Language</label>
					<select
						className="form-control"
						value={settings.language}
						onChange={(e) => handleInputChange('language', e.target.value)}
					>
						<option value="en">English</option>
						<option value="fr">Français</option>
						<option value="ar">العربية</option>
						<option value="es">Español</option>
					</select>
				</div>
			</div>
		</div>
	);

	const renderEmailTab = () => (
		<div className="row">
			<div className="col-12">
				<h5>SMTP Configuration</h5>
				<hr />
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">SMTP Host</label>
					<input
						type="text"
						className="form-control"
						value={settings.smtp_host}
						onChange={(e) => handleInputChange('smtp_host', e.target.value)}
						placeholder="smtp.gmail.com"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">SMTP Port</label>
					<input
						type="number"
						className="form-control"
						value={settings.smtp_port}
						onChange={(e) => handleInputChange('smtp_port', e.target.value)}
						placeholder="587"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">SMTP Username</label>
					<input
						type="text"
						className="form-control"
						value={settings.smtp_username}
						onChange={(e) => handleInputChange('smtp_username', e.target.value)}
						placeholder="username@gmail.com"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">SMTP Password</label>
					<input
						type="password"
						className="form-control"
						value={settings.smtp_password}
						onChange={(e) => handleInputChange('smtp_password', e.target.value)}
						placeholder="••••••••"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Encryption</label>
					<select
						className="form-control"
						value={settings.smtp_encryption}
						onChange={(e) => handleInputChange('smtp_encryption', e.target.value)}
					>
						<option value="tls">TLS</option>
						<option value="ssl">SSL</option>
						<option value="none">None</option>
					</select>
				</div>
			</div>
		</div>
	);

	const renderSecurityTab = () => (
		<div className="row">
			<div className="col-12">
				<div className="form-check form-switch mb-3">
					<input
						className="form-check-input"
						type="checkbox"
						checked={settings.registration_enabled}
						onChange={(e) => handleInputChange('registration_enabled', e.target.checked)}
					/>
					<label className="form-check-label">Enable User Registration</label>
				</div>
				<div className="form-check form-switch mb-3">
					<input
						className="form-check-input"
						type="checkbox"
						checked={settings.email_verification}
						onChange={(e) => handleInputChange('email_verification', e.target.checked)}
					/>
					<label className="form-check-label">Require Email Verification</label>
				</div>
				<div className="form-check form-switch mb-3">
					<input
						className="form-check-input"
						type="checkbox"
						checked={settings.auto_approve_agencies}
						onChange={(e) => handleInputChange('auto_approve_agencies', e.target.checked)}
					/>
					<label className="form-check-label">Auto-approve New Agencies</label>
				</div>
				<div className="form-check form-switch mb-3">
					<input
						className="form-check-input"
						type="checkbox"
						checked={settings.maintenance_mode}
						onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
					/>
					<label className="form-check-label">Maintenance Mode</label>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Session Timeout (minutes)</label>
					<input
						type="number"
						className="form-control"
						value={settings.session_timeout}
						onChange={(e) => handleInputChange('session_timeout', e.target.value)}
						min="5"
						max="1440"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">API Rate Limit (per hour)</label>
					<input
						type="number"
						className="form-control"
						value={settings.api_rate_limit}
						onChange={(e) => handleInputChange('api_rate_limit', e.target.value)}
						min="100"
						max="10000"
					/>
				</div>
			</div>
		</div>
	);

	const renderIntegrationsTab = () => (
		<div className="row">
			<div className="col-12">
				<h5>Maps & Location</h5>
				<hr />
			</div>
			<div className="col-12">
				<div className="form-group">
					<label className="label-text">Google Maps API Key</label>
					<input
						type="text"
						className="form-control"
						value={settings.google_maps_api}
						onChange={(e) => handleInputChange('google_maps_api', e.target.value)}
						placeholder="AIzaSy..."
					/>
					<small className="form-text text-muted">Required for location services and maps</small>
				</div>
			</div>
			
			<div className="col-12 mt-4">
				<h5>Social Login</h5>
				<hr />
			</div>
			<div className="col-12">
				<div className="form-check form-switch mb-3">
					<input
						className="form-check-input"
						type="checkbox"
						checked={settings.social_login_google}
						onChange={(e) => handleInputChange('social_login_google', e.target.checked)}
					/>
					<label className="form-check-label">Enable Google Login</label>
				</div>
				<div className="form-check form-switch mb-3">
					<input
						className="form-check-input"
						type="checkbox"
						checked={settings.social_login_facebook}
						onChange={(e) => handleInputChange('social_login_facebook', e.target.checked)}
					/>
					<label className="form-check-label">Enable Facebook Login</label>
				</div>
			</div>

			<div className="col-12 mt-4">
				<h5>Payment Gateways</h5>
				<hr />
			</div>
			<div className="col-12">
				<div className="form-check form-switch mb-3">
					<input
						className="form-check-input"
						type="checkbox"
						checked={settings.payment_stripe_enabled}
						onChange={(e) => handleInputChange('payment_stripe_enabled', e.target.checked)}
					/>
					<label className="form-check-label">Enable Stripe Payments</label>
				</div>
				<div className="form-check form-switch mb-3">
					<input
						className="form-check-input"
						type="checkbox"
						checked={settings.payment_paypal_enabled}
						onChange={(e) => handleInputChange('payment_paypal_enabled', e.target.checked)}
					/>
					<label className="form-check-label">Enable PayPal Payments</label>
				</div>
			</div>
		</div>
	);

	const renderSeoTab = () => (
		<div className="row">
			<div className="col-12">
				<div className="form-group">
					<label className="label-text">Meta Title</label>
					<input
						type="text"
						className="form-control"
						value={settings.seo_meta_title}
						onChange={(e) => handleInputChange('seo_meta_title', e.target.value)}
						maxLength="60"
						placeholder="Your site title for search engines"
					/>
					<small className="form-text text-muted">Recommended: 50-60 characters</small>
				</div>
			</div>
			<div className="col-12">
				<div className="form-group">
					<label className="label-text">Meta Description</label>
					<textarea
						className="form-control"
						rows="3"
						value={settings.seo_meta_description}
						onChange={(e) => handleInputChange('seo_meta_description', e.target.value)}
						maxLength="160"
						placeholder="Brief description of your site"
					/>
					<small className="form-text text-muted">Recommended: 150-160 characters</small>
				</div>
			</div>
			<div className="col-12">
				<div className="form-group">
					<label className="label-text">Meta Keywords</label>
					<input
						type="text"
						className="form-control"
						value={settings.seo_meta_keywords}
						onChange={(e) => handleInputChange('seo_meta_keywords', e.target.value)}
						placeholder="keyword1, keyword2, keyword3"
					/>
					<small className="form-text text-muted">Separate keywords with commas</small>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Google Analytics ID</label>
					<input
						type="text"
						className="form-control"
						value={settings.analytics_google}
						onChange={(e) => handleInputChange('analytics_google', e.target.value)}
						placeholder="G-XXXXXXXXXX"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Facebook Pixel ID</label>
					<input
						type="text"
						className="form-control"
						value={settings.analytics_facebook_pixel}
						onChange={(e) => handleInputChange('analytics_facebook_pixel', e.target.value)}
						placeholder="123456789012345"
					/>
				</div>
			</div>
		</div>
	);

	const renderAdvancedTab = () => (
		<div className="row">
			<div className="col-12">
				<div className="form-check form-switch mb-3">
					<input
						className="form-check-input"
						type="checkbox"
						checked={settings.debug_mode}
						onChange={(e) => handleInputChange('debug_mode', e.target.checked)}
					/>
					<label className="form-check-label">Debug Mode</label>
					<small className="form-text text-muted">Enable for development only</small>
				</div>
				<div className="form-check form-switch mb-3">
					<input
						className="form-check-input"
						type="checkbox"
						checked={settings.cache_enabled}
						onChange={(e) => handleInputChange('cache_enabled', e.target.checked)}
					/>
					<label className="form-check-label">Enable Caching</label>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Max Upload Size (MB)</label>
					<input
						type="number"
						className="form-control"
						value={settings.max_upload_size}
						onChange={(e) => handleInputChange('max_upload_size', e.target.value)}
						min="1"
						max="100"
					/>
				</div>
			</div>
			<div className="col-md-6">
				<div className="form-group">
					<label className="label-text">Backup Frequency</label>
					<select
						className="form-control"
						value={settings.backup_frequency}
						onChange={(e) => handleInputChange('backup_frequency', e.target.value)}
					>
						<option value="daily">Daily</option>
						<option value="weekly">Weekly</option>
						<option value="monthly">Monthly</option>
						<option value="never">Never</option>
					</select>
				</div>
			</div>
		</div>
	);

	const renderTabContent = () => {
		switch (activeTab) {
			case 'general': return renderGeneralTab();
			case 'email': return renderEmailTab();
			case 'security': return renderSecurityTab();
			case 'integrations': return renderIntegrationsTab();
			case 'seo': return renderSeoTab();
			case 'advanced': return renderAdvancedTab();
			default: return renderGeneralTab();
		}
	};

	return (
		<AdminLayout
			pageTitle="System Settings"
			breadcrumbItems={breadcrumbItems}
			showStats={false}
		>
			<div className="row">
				<div className="col-lg-12">
					<div className="form-box">
						<div className="form-title-wrap">
							<h3 className="title">System Configuration</h3>
							<p className="text-muted">Manage your system settings and preferences</p>
						</div>

						{error && (
							<div className="alert alert-danger">
								<i className="la la-exclamation-triangle me-2"></i>
								{error}
							</div>
						)}

						{success && (
							<div className="alert alert-success">
								<i className="la la-check-circle me-2"></i>
								{success}
							</div>
						)}

						<div className="form-content">
							{/* Tabs */}
							<ul className="nav nav-tabs" role="tablist">
								{tabs.map(tab => (
									<li key={tab.key} className="nav-item" role="presentation">
										<button
											className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
											onClick={() => setActiveTab(tab.key)}
											type="button"
											role="tab"
										>
											<i className={`la ${tab.icon} me-2`}></i>
											{tab.label}
										</button>
									</li>
								))}
							</ul>

							{/* Tab Content */}
							<form onSubmit={handleSave}>
								<div className="tab-content mt-4">
									<div className="tab-pane fade show active">
										{loading ? (
											<div className="text-center py-5">
												<div className="spinner-border text-primary" role="status">
													<span className="visually-hidden">Loading...</span>
												</div>
											</div>
										) : (
											renderTabContent()
										)}
									</div>
								</div>

								{/* Save Button */}
								<div className="btn-box pt-3 border-top mt-4">
									<button
										type="submit"
										className="btn btn-primary"
										disabled={saving || loading}
									>
										{saving ? (
											<>
												<span className="spinner-border spinner-border-sm me-2" role="status"></span>
												Saving...
											</>
										) : (
											<>
												<i className="la la-save me-2"></i>
												Save Settings
											</>
										)}
									</button>
									<button
										type="button"
										className="btn btn-secondary ms-2"
										onClick={fetchSettings}
										disabled={loading}
									>
										<i className="la la-refresh me-2"></i>
										Reset
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}

