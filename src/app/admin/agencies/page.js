'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';

export default function AdminAgencies() {
	const [agencies, setAgencies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'delete', 'view'
	const [selectedAgency, setSelectedAgency] = useState(null);
	const [formData, setFormData] = useState({
		business_name: '',
		contact_name: '',
		business_email: '',
		business_phone: '',
		business_address: '',
		business_city: '',
		business_country: '',
		commission_rate: 10,
		status: 'pending'
	});

	useEffect(() => {
		fetchAgencies();
	}, []); // Only run once on mount

	// Debounced search to prevent constant re-renders
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			// No need to re-fetch, just filter locally
		}, 300);
		return () => clearTimeout(timeoutId);
	}, [searchTerm, filterStatus]);

	const fetchAgencies = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/agencies');
			if (!response.ok) throw new Error('Failed to fetch agencies');
			const data = await response.json();
			setAgencies(data.agencies || []);
		} catch (err) {
			console.error('Error fetching agencies:', err);
			setError('Failed to load agencies from database');
			setAgencies([]);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (agencyId, newStatus) => {
		try {
			const response = await fetch(`/api/admin/agencies/${agencyId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus })
			});
			if (!response.ok) throw new Error('Failed to update status');
			
			// Update local state
			setAgencies(agencies.map(agency => 
				agency.agency_id === agencyId ? { ...agency, status: newStatus } : agency
			));
		} catch (err) {
			console.error('Error updating agency status:', err);
			alert('Failed to update agency status');
		}
	};

	// Handle form submission for add/edit
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = modalType === 'add' ? '/api/admin/agencies' : `/api/admin/agencies/${selectedAgency?.agency_id}`;
			const method = modalType === 'add' ? 'POST' : 'PUT';
			const body = modalType === 'add' ? formData : { ...formData, agency_id: selectedAgency?.agency_id };
			
			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			
			if (!response.ok) throw new Error('Failed to save agency');
			
			setShowModal(false);
			resetForm();
			fetchAgencies();
			alert(modalType === 'add' ? 'Agency created successfully!' : 'Agency updated successfully!');
		} catch (err) {
			console.error('Error saving agency:', err);
			alert('Failed to save agency');
		}
	};

	// Handle delete
	const handleDelete = async () => {
		if (!selectedAgency) return;
		
		try {
			const response = await fetch(`/api/admin/agencies/${selectedAgency.agency_id}`, {
				method: 'DELETE'
			});
			
			if (!response.ok) throw new Error('Failed to delete agency');
			
			setShowModal(false);
			setSelectedAgency(null);
			fetchAgencies();
			alert('Agency deleted successfully!');
		} catch (err) {
			console.error('Error deleting agency:', err);
			alert('Failed to delete agency');
		}
	};

	// Open modal functions
	const openAddModal = () => {
		setModalType('add');
		resetForm();
		setShowModal(true);
	};

	const openEditModal = (agency) => {
		setModalType('edit');
		setSelectedAgency(agency);
		setFormData({
			business_name: agency.business_name || '',
			contact_name: agency.contact_name || '',
			business_email: agency.business_email || '',
			business_phone: agency.business_phone || '',
			business_address: agency.business_address || '',
			business_city: agency.business_city || '',
			business_country: agency.business_country || '',
			commission_rate: agency.commission_rate || 10,
			status: agency.status || 'pending'
		});
		setShowModal(true);
	};

	const openDeleteModal = (agency) => {
		setModalType('delete');
		setSelectedAgency(agency);
		setShowModal(true);
	};

	const openViewModal = (agency) => {
		setModalType('view');
		setSelectedAgency(agency);
		setShowModal(true);
	};

	const resetForm = () => {
		setFormData({
			business_name: '',
			contact_name: '',
			business_email: '',
			business_phone: '',
			business_address: '',
			business_city: '',
			business_country: '',
			commission_rate: 10,
			status: 'pending'
		});
	};

	// Handle form input changes
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const filteredAgencies = agencies.filter(agency => {
		const matchesSearch = (agency.business_name + ' ' + agency.contact_name + ' ' + agency.business_email)
			.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = filterStatus === 'all' || agency.status === filterStatus;
		
		return matchesSearch && matchesStatus;
	});

	const getStatusBadgeClass = (status) => {
		switch (status) {
			case 'approved': return 'bg-success';
			case 'pending': return 'bg-warning';
			case 'rejected': return 'bg-danger';
			case 'suspended': return 'bg-secondary';
			default: return 'bg-secondary';
		}
	};

	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Admin', href: '/admin' },
		{ label: 'Agencies' }
	];

	return (
		<AdminLayout
			pageTitle="Agency Management"
			breadcrumbItems={breadcrumbItems}
			showStats={false}
		>
			<div className="row">
				<div className="col-lg-12">
					<div className="form-box">
						<div className="form-title-wrap">
							<div className="d-flex justify-content-between align-items-center">
								<h3 className="title">All Agencies ({filteredAgencies.length})</h3>
								<div className="d-flex gap-2">
									<select 
										className="form-select form-select-sm"
										value={filterStatus}
										onChange={(e) => setFilterStatus(e.target.value)}
									>
										<option value="all">All Status</option>
										<option value="pending">Pending</option>
										<option value="approved">Approved</option>
										<option value="rejected">Rejected</option>
										<option value="suspended">Suspended</option>
									</select>
								</div>
							</div>
						</div>
						
						<div className="form-content">
							<div className="mb-3">
								<div className="row">
									<div className="col-md-6">
										<div className="form-group">
											<input
												type="text"
												className="form-control"
												placeholder="Search agencies by name, contact, or email..."
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
											/>
										</div>
									</div>
									<div className="col-md-6 text-end">
										<button className="btn btn-primary btn-sm me-2" onClick={fetchAgencies}>
											<i className="la la-refresh me-1"></i>Refresh
										</button>
									<button className="btn btn-success btn-sm" onClick={openAddModal}>
										<i className="la la-plus me-1"></i>Add Agency
									</button>
									</div>
								</div>
							</div>

							{error && (
								<div className="alert alert-danger">
									<i className="la la-exclamation-triangle me-2"></i>
									{error}. Please check your database connection.
								</div>
							)}

							{loading ? (
								<div className="text-center py-4">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							) : (
								<div className="table-responsive">
									<table className="table table-hover">
										<thead>
											<tr>
												<th>ID</th>
												<th>Business Name</th>
												<th>Contact</th>
												<th>Email</th>
												<th>Phone</th>
												<th>Commission</th>
												<th>Status</th>
												<th>Created</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{filteredAgencies.length > 0 ? (
												filteredAgencies.map((agency) => (
													<tr key={agency.agency_id}>
														<td>#{agency.agency_id}</td>
														<td>
															<div className="d-flex align-items-center">
																<div className="agency-info">
																	<h6 className="mb-0">{agency.business_name}</h6>
																	<small className="text-muted">{agency.business_city}, {agency.business_country}</small>
																</div>
															</div>
														</td>
														<td>{agency.contact_name || 'N/A'}</td>
														<td>{agency.business_email || 'N/A'}</td>
														<td>{agency.business_phone || 'N/A'}</td>
														<td>{agency.commission_rate}%</td>
														<td>
															<select
																className={`form-select form-select-sm badge ${getStatusBadgeClass(agency.status)}`}
																value={agency.status}
																onChange={(e) => handleStatusChange(agency.agency_id, e.target.value)}
																style={{ border: 'none', color: 'white' }}
															>
																<option value="pending">Pending</option>
																<option value="approved">Approved</option>
																<option value="rejected">Rejected</option>
																<option value="suspended">Suspended</option>
															</select>
														</td>
														<td>{new Date(agency.created_at).toLocaleDateString()}</td>
														<td>
															<div className="btn-group btn-group-sm">
										<button 
											className="btn btn-outline-primary btn-sm"
											title="View Details"
											onClick={() => openViewModal(agency)}
										>
											<i className="la la-eye"></i>
										</button>
															<button 
																className="btn btn-outline-secondary btn-sm"
																title="Edit Agency"
																onClick={() => openEditModal(agency)}
															>
																<i className="la la-edit"></i>
															</button>
															<button 
																className="btn btn-outline-danger btn-sm"
																title="Delete Agency"
																onClick={() => openDeleteModal(agency)}
															>
																<i className="la la-trash"></i>
															</button>
															</div>
														</td>
													</tr>
												))
											) : (
												<tr>
													<td colSpan="9" className="text-center py-4">
														<i className="la la-building" style={{fontSize: '48px', color: '#ccc'}}></i>
														<p className="text-muted mt-2">No agencies found</p>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Modal for Add/Edit/Delete */}
			{showModal && (
				<div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
							<h5 className="modal-title">
								{modalType === 'add' && 'Add New Agency'}
								{modalType === 'edit' && 'Edit Agency'}
								{modalType === 'delete' && 'Confirm Delete'}
								{modalType === 'view' && 'Agency Details'}
							</h5>
								<button 
									type="button" 
									className="btn-close" 
									onClick={() => setShowModal(false)}
								></button>
							</div>
							
							{modalType === 'delete' ? (
								<div className="modal-body">
									<div className="text-center">
										<i className="la la-exclamation-triangle text-warning" style={{ fontSize: '48px' }}></i>
										<h4 className="mt-3">Are you sure?</h4>
										<p>Do you want to delete the agency <strong>{selectedAgency?.business_name}</strong>?</p>
										<p className="text-muted">This action cannot be undone.</p>
									</div>
								</div>
							) : modalType === 'view' ? (
								<div className="modal-body">
									<div className="row">
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Agency ID</label>
												<p className="form-control-plaintext">#{selectedAgency?.agency_id}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Status</label>
												<p className="form-control-plaintext">
													<span className={`badge ${getStatusBadgeClass(selectedAgency?.status)}`}>
														{selectedAgency?.status?.toUpperCase()}
													</span>
												</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Business Name</label>
												<p className="form-control-plaintext">{selectedAgency?.business_name || 'N/A'}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Contact Name</label>
												<p className="form-control-plaintext">{selectedAgency?.contact_name || 'N/A'}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Business Email</label>
												<p className="form-control-plaintext">{selectedAgency?.business_email || 'N/A'}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Business Phone</label>
												<p className="form-control-plaintext">{selectedAgency?.business_phone || 'N/A'}</p>
											</div>
										</div>
										<div className="col-12">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Business Address</label>
												<p className="form-control-plaintext">{selectedAgency?.business_address || 'N/A'}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">City</label>
												<p className="form-control-plaintext">{selectedAgency?.business_city || 'N/A'}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Country</label>
												<p className="form-control-plaintext">{selectedAgency?.business_country || 'N/A'}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Commission Rate</label>
												<p className="form-control-plaintext">{selectedAgency?.commission_rate}%</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Created At</label>
												<p className="form-control-plaintext">{new Date(selectedAgency?.created_at).toLocaleString()}</p>
											</div>
										</div>
									</div>
								</div>
							) : (
								<form onSubmit={handleSubmit}>
									<div className="modal-body">
										<div className="row">
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Business Name *</label>
													<input
														type="text"
														name="business_name"
														className="form-control"
														value={formData.business_name}
														onChange={handleInputChange}
														required
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Contact Name *</label>
													<input
														type="text"
														name="contact_name"
														className="form-control"
														value={formData.contact_name}
														onChange={handleInputChange}
														required
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Business Email *</label>
													<input
														type="email"
														name="business_email"
														className="form-control"
														value={formData.business_email}
														onChange={handleInputChange}
														required
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Business Phone</label>
													<input
														type="text"
														name="business_phone"
														className="form-control"
														value={formData.business_phone}
														onChange={handleInputChange}
													/>
												</div>
											</div>
											<div className="col-12">
												<div className="form-group mb-3">
													<label className="form-label">Business Address</label>
													<textarea
														name="business_address"
														className="form-control"
														rows="2"
														value={formData.business_address}
														onChange={handleInputChange}
													></textarea>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">City</label>
													<input
														type="text"
														name="business_city"
														className="form-control"
														value={formData.business_city}
														onChange={handleInputChange}
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Country</label>
													<input
														type="text"
														name="business_country"
														className="form-control"
														value={formData.business_country}
														onChange={handleInputChange}
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Commission Rate (%) *</label>
													<input
														type="number"
														name="commission_rate"
														className="form-control"
														value={formData.commission_rate}
														onChange={handleInputChange}
														min="0"
														max="100"
														step="0.1"
														required
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Status *</label>
													<select
														name="status"
														className="form-select"
														value={formData.status}
														onChange={handleInputChange}
														required
													>
														<option value="pending">Pending</option>
														<option value="approved">Approved</option>
														<option value="rejected">Rejected</option>
														<option value="suspended">Suspended</option>
													</select>
												</div>
											</div>
										</div>
									</div>
								</form>
							)}
							
							<div className="modal-footer">
								<button 
									type="button" 
									className="btn btn-secondary" 
									onClick={() => setShowModal(false)}
								>
									Cancel
								</button>
								{modalType === 'delete' ? (
									<button 
										type="button" 
										className="btn btn-danger" 
										onClick={handleDelete}
									>
										Delete Agency
									</button>
								) : modalType === 'view' ? null : (
									<button 
										type="button" 
										className="btn btn-primary" 
										onClick={handleSubmit}
									>
										{modalType === 'add' ? 'Create Agency' : 'Update Agency'}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</AdminLayout>
	);
}
