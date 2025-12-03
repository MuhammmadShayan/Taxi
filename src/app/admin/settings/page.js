'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminSettings() {
	const [settings, setSettings] = useState({});
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [activeCategory, setActiveCategory] = useState('general');
	const [editingSetting, setEditingSetting] = useState(null);
	const [showNewSettingModal, setShowNewSettingModal] = useState(false);
	const [newSetting, setNewSetting] = useState({
		setting_key: '',
		setting_value: '',
		description: '',
		type: 'text',
		category: 'general',
		display_order: 0
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/settings?grouped=true');
			if (!response.ok) throw new Error('Failed to fetch settings');
			const data = await response.json();
			setSettings(data.settings || {});
			setCategories(data.categories || []);
			if (data.categories && data.categories.length > 0 && !activeCategory) {
				setActiveCategory(data.categories[0]);
			}
		} catch (err) {
			console.error('Error fetching settings:', err);
			setError('Failed to load settings');
		} finally {
			setLoading(false);
		}
	};

	const handleSaveSetting = async (setting) => {
		try {
			setSaving(true);
			setError(null);
			
			const response = await fetch('/api/admin/settings', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(setting)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to save setting');
			}

			setSuccess('Setting saved successfully!');
			setEditingSetting(null);
			await fetchSettings(); // Refresh settings
			
			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			console.error('Error saving setting:', err);
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const handleCreateSetting = async () => {
		try {
			setSaving(true);
			setError(null);

			const response = await fetch('/api/admin/settings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newSetting)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create setting');
			}

			setSuccess('Setting created successfully!');
			setShowNewSettingModal(false);
			setNewSetting({
				setting_key: '',
				setting_value: '',
				description: '',
				type: 'text',
				category: 'general',
				display_order: 0
			});
			await fetchSettings();
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			console.error('Error creating setting:', err);
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteSetting = async (settingId) => {
		if (!confirm('Are you sure you want to delete this setting? This action cannot be undone.')) {
			return;
		}

		try {
			setError(null);
			const response = await fetch(`/api/admin/settings?id=${settingId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to delete setting');
			}

			setSuccess('Setting deleted successfully!');
			await fetchSettings();
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			console.error('Error deleting setting:', err);
			setError(err.message);
		}
	};

	const getInputType = (type) => {
		switch (type) {
			case 'number': return 'number';
			case 'boolean': return 'select';
			default: return 'text';
		}
	};

	const formatSettingValue = (setting) => {
		if (setting.type === 'boolean') {
			return setting.setting_value === 'true' ? 'Enabled' : 'Disabled';
		}
		if (setting.type === 'number') {
			return setting.setting_value;
		}
		return setting.setting_value || 'Not set';
	};

	const getCategoryIcon = (category) => {
		const icons = {
			general: 'la la-cog',
			contact: 'la la-address-book',
			booking: 'la la-calendar-check',
			payment: 'la la-credit-card',
			email: 'la la-envelope',
			notifications: 'la la-bell',
			maps: 'la la-map-marker',
			security: 'la la-shield-alt',
			uploads: 'la la-cloud-upload-alt',
			seo: 'la la-search',
			social: 'la la-share-alt',
			api: 'la la-code',
			maintenance: 'la la-tools'
		};
		return icons[category] || 'la la-cog';
	};

	const getCategoryTitle = (category) => {
		return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
	};

	const filteredSettings = settings[activeCategory]?.filter(setting => 
		setting.setting_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
		setting.description?.toLowerCase().includes(searchTerm.toLowerCase())
	) || [];

	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Admin', href: '/admin' },
		{ label: 'Settings' }
	];

	return (
		<AdminLayout
			pageTitle="System Settings"
			breadcrumbItems={breadcrumbItems}
			showStats={false}
		>
			{/* Success/Error Messages */}
			{success && (
				<div className="alert alert-success alert-dismissible fade show" role="alert">
					<i className="la la-check-circle me-2"></i>{success}
					<button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
				</div>
			)}
			{error && (
				<div className="alert alert-danger alert-dismissible fade show" role="alert">
					<i className="la la-exclamation-triangle me-2"></i>{error}
					<button type="button" className="btn-close" onClick={() => setError(null)}></button>
				</div>
			)}

			<div className="row">
				{/* Settings Categories Sidebar */}
				<div className="col-lg-3 col-md-4">
					<div className="form-box">
						<div className="form-title-wrap">
							<h5 className="title">Categories</h5>
						</div>
						<div className="form-content">
							{loading ? (
								<div className="text-center py-3">
									<div className="spinner-border spinner-border-sm text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							) : (
								<div className="list-group list-group-flush">
									{categories.map(category => (
										<button
											key={category}
											type="button"
											className={`list-group-item list-group-item-action d-flex align-items-center ${
												activeCategory === category ? 'active' : ''
											}`}
											onClick={() => setActiveCategory(category)}
										>
											<i className={`${getCategoryIcon(category)} me-3`}></i>
											<div className="flex-grow-1">
												<div className="fw-bold">{getCategoryTitle(category)}</div>
												<small className="text-muted">
													{settings[category]?.length || 0} settings
												</small>
											</div>
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Main Settings Content */}
				<div className="col-lg-9 col-md-8">
					<div className="form-box">
						<div className="form-title-wrap">
							<div className="d-flex justify-content-between align-items-center">
								<div>
									<h3 className="title">
										<i className={`${getCategoryIcon(activeCategory)} me-2`}></i>
										{getCategoryTitle(activeCategory)} Settings
									</h3>
									<p className="text-muted mb-0">Manage your {activeCategory} configuration</p>
								</div>
								<button 
									className="btn btn-primary"
									onClick={() => setShowNewSettingModal(true)}
								>
									<i className="la la-plus me-2"></i>Add Setting
								</button>
							</div>
						</div>

						<div className="form-content">
							{/* Search Bar */}
							<div className="row mb-4">
								<div className="col-md-6">
									<div className="input-group">
										<span className="input-group-text">
											<i className="la la-search"></i>
										</span>
										<input
											type="text"
											className="form-control"
											placeholder="Search settings..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
									</div>
								</div>
							</div>

							{loading ? (
								<div className="text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading settings...</span>
									</div>
									<p className="text-muted mt-2">Loading settings...</p>
								</div>
							) : filteredSettings.length === 0 ? (
								<div className="text-center py-5">
									<i className="la la-cog" style={{fontSize: '48px', color: '#ccc'}}></i>
									<h5 className="mt-3 text-muted">No settings found</h5>
									<p className="text-muted">No settings available in this category{searchTerm && ' matching your search'}.</p>
								</div>
							) : (
								<div className="row">
									{filteredSettings.map((setting) => (
										<div key={setting.id} className="col-12 mb-4">
											{editingSetting?.id === setting.id ? (
												/* Edit Mode */
												<div className="card border-primary">
													<div className="card-header bg-primary text-white">
														<h6 className="mb-0">
															<i className="la la-edit me-2"></i>
															Editing: {setting.setting_key}
														</h6>
													</div>
													<div className="card-body">
														<form onSubmit={(e) => {
															e.preventDefault();
															handleSaveSetting(editingSetting);
														}}>
															<div className="row">
																<div className="col-md-6">
																	<label className="form-label">Setting Key</label>
																	<input
																		type="text"
																		className="form-control"
																		value={editingSetting.setting_key}
																		readOnly
																	/>
																</div>
																<div className="col-md-6">
																	<label className="form-label">Type</label>
																	<select
																		className="form-control"
																		value={editingSetting.type}
																		onChange={(e) => setEditingSetting({...editingSetting, type: e.target.value})}
																	>
																		<option value="text">Text</option>
																		<option value="number">Number</option>
																		<option value="boolean">Boolean</option>
																		<option value="json">JSON</option>
																	</select>
																</div>
															</div>
															<div className="row mt-3">
																<div className="col-12">
																	<label className="form-label">Value</label>
																	{editingSetting.type === 'boolean' ? (
																		<select
																			className="form-control"
																			value={editingSetting.setting_value}
																			onChange={(e) => setEditingSetting({...editingSetting, setting_value: e.target.value})}
																		>
																			<option value="true">True</option>
																			<option value="false">False</option>
																		</select>
																	) : editingSetting.type === 'json' ? (
																		<textarea
																			className="form-control"
																			rows={4}
																			value={editingSetting.setting_value}
																			placeholder="Enter valid JSON..."
																			onChange={(e) => setEditingSetting({...editingSetting, setting_value: e.target.value})}
																		/>
																	) : (
																		<input
																			type={getInputType(editingSetting.type)}
																			className="form-control"
																			value={editingSetting.setting_value}
																			placeholder="Enter setting value..."
																			onChange={(e) => setEditingSetting({...editingSetting, setting_value: e.target.value})}
																		/>
																	)}
																</div>
															</div>
															<div className="row mt-3">
																<div className="col-12">
																	<label className="form-label">Description</label>
																	<textarea
																		className="form-control"
																		rows={2}
																		value={editingSetting.description || ''}
																		placeholder="Enter description..."
																		onChange={(e) => setEditingSetting({...editingSetting, description: e.target.value})}
																	/>
																</div>
															</div>
															<div className="d-flex justify-content-end gap-2 mt-4">
																<button 
																	type="button"
																	className="btn btn-secondary"
																	onClick={() => setEditingSetting(null)}
																	disabled={saving}
																>
																	Cancel
																</button>
																<button 
																	type="submit"
																	className="btn btn-primary"
																	disabled={saving}
																>
																	{saving ? (
																		<>
																			<span className="spinner-border spinner-border-sm me-2" role="status"></span>
																			Saving...
																		</>
																	) : 'Save Changes'}
																</button>
															</div>
														</form>
													</div>
												</div>
											) : (
												/* Display Mode */
												<div className="card h-100">
													<div className="card-body">
														<div className="d-flex justify-content-between align-items-start">
															<div className="flex-grow-1">
																<div className="d-flex align-items-center mb-2">
																	<code className="bg-light px-2 py-1 rounded me-2 text-primary">{setting.setting_key}</code>
																	<span className={`badge ${
																		setting.type === 'boolean' ? 'bg-success' :
																		setting.type === 'number' ? 'bg-info' :
																		setting.type === 'json' ? 'bg-warning' : 'bg-secondary'
																	}`}>
																		{setting.type}
																	</span>
																</div>
																<div className="mb-2">
																	<strong className="text-dark">{formatSettingValue(setting)}</strong>
																</div>
																{setting.description && (
																	<p className="text-muted mb-0 small">{setting.description}</p>
																)}
															</div>
															<div className="btn-group">
																<button
																	className="btn btn-outline-primary btn-sm"
																	onClick={() => setEditingSetting({...setting})}
																	title="Edit setting"
																>
																	<i className="la la-edit"></i>
																</button>
																<button
																	className="btn btn-outline-danger btn-sm"
																	onClick={() => handleDeleteSetting(setting.id)}
																	title="Delete setting"
																>
																	<i className="la la-trash"></i>
																</button>
															</div>
														</div>
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* New Setting Modal */}
			{showNewSettingModal && (
				<div className="modal show d-block" tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">
									<i className="la la-plus me-2"></i>Add New Setting
								</h5>
								<button 
									type="button" 
									className="btn-close"
									onClick={() => setShowNewSettingModal(false)}
								></button>
							</div>
							<div className="modal-body">
								<form onSubmit={(e) => {
									e.preventDefault();
									handleCreateSetting();
								}}>
									<div className="row">
										<div className="col-md-6">
											<label className="form-label">Setting Key *</label>
											<input
												type="text"
												className="form-control"
												value={newSetting.setting_key}
												placeholder="e.g., max_upload_size"
												onChange={(e) => setNewSetting({...newSetting, setting_key: e.target.value})}
												required
											/>
										</div>
										<div className="col-md-6">
											<label className="form-label">Type *</label>
											<select
												className="form-control"
												value={newSetting.type}
												onChange={(e) => setNewSetting({...newSetting, type: e.target.value})}
												required
											>
												<option value="text">Text</option>
												<option value="number">Number</option>
												<option value="boolean">Boolean</option>
												<option value="json">JSON</option>
											</select>
										</div>
									</div>
									<div className="row mt-3">
										<div className="col-md-6">
											<label className="form-label">Category</label>
											<select
												className="form-control"
												value={newSetting.category}
												onChange={(e) => setNewSetting({...newSetting, category: e.target.value})}
											>
												{categories.map(category => (
													<option key={category} value={category}>{getCategoryTitle(category)}</option>
												))}
											</select>
										</div>
										<div className="col-md-6">
											<label className="form-label">Display Order</label>
											<input
												type="number"
												className="form-control"
												value={newSetting.display_order}
												placeholder="0"
												onChange={(e) => setNewSetting({...newSetting, display_order: parseInt(e.target.value) || 0})}
											/>
										</div>
									</div>
									<div className="mt-3">
										<label className="form-label">Value</label>
										{newSetting.type === 'boolean' ? (
											<select
												className="form-control"
												value={newSetting.setting_value}
												onChange={(e) => setNewSetting({...newSetting, setting_value: e.target.value})}
											>
												<option value="true">True</option>
												<option value="false">False</option>
											</select>
										) : newSetting.type === 'json' ? (
											<textarea
												className="form-control"
												rows={4}
												value={newSetting.setting_value}
												placeholder="Enter valid JSON..."
												onChange={(e) => setNewSetting({...newSetting, setting_value: e.target.value})}
											/>
										) : (
											<input
												type={getInputType(newSetting.type)}
												className="form-control"
												value={newSetting.setting_value}
												placeholder="Enter setting value..."
												onChange={(e) => setNewSetting({...newSetting, setting_value: e.target.value})}
											/>
										)}
									</div>
									<div className="mt-3">
										<label className="form-label">Description</label>
										<textarea
											className="form-control"
											rows={2}
											value={newSetting.description}
											placeholder="Enter description for this setting..."
											onChange={(e) => setNewSetting({...newSetting, description: e.target.value})}
										/>
									</div>
								</form>
							</div>
							<div className="modal-footer">
								<button 
									type="button" 
									className="btn btn-secondary"
									onClick={() => setShowNewSettingModal(false)}
									disabled={saving}
								>
									Cancel
								</button>
								<button 
									type="button"
									className="btn btn-primary"
									onClick={handleCreateSetting}
									disabled={saving || !newSetting.setting_key}
								>
									{saving ? (
										<>
											<span className="spinner-border spinner-border-sm me-2" role="status"></span>
											Creating...
										</>
									) : 'Create Setting'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</AdminLayout>
	);
}
