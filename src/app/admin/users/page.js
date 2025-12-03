'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterRole, setFilterRole] = useState('all');
	const [filterStatus, setFilterStatus] = useState('all');
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'delete'
	const [selectedUser, setSelectedUser] = useState(null);
	const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		role: 'customer',
		status: 'active'
	});

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const queryParams = new URLSearchParams({
				page: pagination.page,
				limit: pagination.limit,
				search: searchTerm,
				role: filterRole,
				status: filterStatus
			});
			const response = await fetch(`/api/admin/users?${queryParams}`);
			if (!response.ok) throw new Error('Failed to fetch users');
			const data = await response.json();
			setUsers(data.users || []);
			setPagination(prev => ({ ...prev, total: data.total || 0 }));
		} catch (err) {
			console.error('Error fetching users:', err);
			setError('Failed to load users from database');
			setUsers([]);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (userId, newStatus) => {
		try {
			const response = await fetch(`/api/admin/users`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ user_id: userId, status: newStatus })
			});
			if (!response.ok) throw new Error('Failed to update status');
			
			// Update local state
			setUsers(users.map(user => 
				user.user_id === userId ? { ...user, status: newStatus } : user
			));
		} catch (err) {
			console.error('Error updating user status:', err);
			alert('Failed to update user status');
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = modalType === 'add' ? '/api/admin/users' : '/api/admin/users';
			const method = modalType === 'add' ? 'POST' : 'PUT';
			const body = modalType === 'add' ? formData : { ...formData, user_id: selectedUser?.user_id };
			
			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			
			if (!response.ok) throw new Error('Failed to save user');
			
			setShowModal(false);
			resetForm();
			fetchUsers();
			alert(modalType === 'add' ? 'User created successfully!' : 'User updated successfully!');
		} catch (err) {
			console.error('Error saving user:', err);
			alert('Failed to save user');
		}
	};

	// Handle delete
	const handleDelete = async () => {
		if (!selectedUser) return;
		
		try {
			const response = await fetch(`/api/admin/users?user_id=${selectedUser.user_id}`, {
				method: 'DELETE'
			});
			
			if (!response.ok) throw new Error('Failed to delete user');
			
			setShowModal(false);
			setSelectedUser(null);
			fetchUsers();
			alert('User deleted successfully!');
		} catch (err) {
			console.error('Error deleting user:', err);
			alert('Failed to delete user');
		}
	};

	// Open modal functions
	const openAddModal = () => {
		setModalType('add');
		resetForm();
		setShowModal(true);
	};

	const openEditModal = (user) => {
		setModalType('edit');
		setSelectedUser(user);
		setFormData({
			first_name: user.first_name || '',
			last_name: user.last_name || '',
			email: user.email || '',
			phone: user.phone || '',
			role: user.role || 'customer',
			status: user.status || 'active'
		});
		setShowModal(true);
	};

	const openViewModal = (user) => {
		setModalType('view');
		setSelectedUser(user);
		setShowModal(true);
	};

	const openDeleteModal = (user) => {
		setModalType('delete');
		setSelectedUser(user);
		setShowModal(true);
	};

	const resetForm = () => {
		setFormData({
			first_name: '',
			last_name: '',
			email: '',
			phone: '',
			role: 'customer',
			status: 'active'
		});
	};

	// Handle form input changes
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Pagination handlers
	const handlePageChange = (newPage) => {
		setPagination(prev => ({ ...prev, page: newPage }));
	};

	// Apply search filters with debounce
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when filtering
			fetchUsers();
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchTerm, filterRole, filterStatus]);

	// Apply pagination
	useEffect(() => {
		fetchUsers();
	}, [pagination.page, pagination.limit]);

	// Calculate pagination info
	const totalPages = Math.ceil(pagination.total / pagination.limit);
	const startIndex = (pagination.page - 1) * pagination.limit;
	const endIndex = Math.min(startIndex + pagination.limit, pagination.total);

	const getRoleBadgeClass = (role) => {
		switch (role) {
			case 'admin': return 'bg-danger';
			case 'agency_owner': return 'bg-warning';
			case 'customer': return 'bg-primary';
			default: return 'bg-secondary';
		}
	};

	const getStatusBadgeClass = (status) => {
		switch (status) {
			case 'active': return 'bg-success';
			case 'inactive': return 'bg-secondary';
			case 'suspended': return 'bg-danger';
			default: return 'bg-secondary';
		}
	};

	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Admin', href: '/admin' },
		{ label: 'Users' }
	];

	return (
		<AdminLayout
			pageTitle="User Management"
			breadcrumbItems={breadcrumbItems}
			showStats={false}
		>
			<div className="row">
				<div className="col-lg-12">
					<div className="form-box">
						<div className="form-title-wrap">
							<div className="d-flex justify-content-between align-items-center">
								<h3 className="title">All Users ({pagination.total})</h3>
								<div className="d-flex gap-2">
									<select 
										className="form-select form-select-sm"
										value={filterRole}
										onChange={(e) => setFilterRole(e.target.value)}
									>
										<option value="all">All Roles</option>
										<option value="customer">Customers</option>
										<option value="agency_owner">Agency Owners</option>
										<option value="admin">Admins</option>
									</select>
									<select 
										className="form-select form-select-sm"
										value={filterStatus}
										onChange={(e) => setFilterStatus(e.target.value)}
									>
										<option value="all">All Status</option>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
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
												placeholder="Search users by name or email..."
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
											/>
										</div>
									</div>
									<div className="col-md-6 text-end">
										<button className="btn btn-primary btn-sm me-2" onClick={fetchUsers}>
											<i className="la la-refresh me-1"></i>Refresh
										</button>
									<button className="btn btn-success btn-sm" onClick={openAddModal}>
										<i className="la la-plus me-1"></i>Add User
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
												<th>Name</th>
												<th>Email</th>
												<th>Phone</th>
												<th>Role</th>
												<th>Status</th>
												<th>Created</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{users.length > 0 ? (
												users.map((user) => (
													<tr key={user.user_id}>
														<td>#{user.user_id}</td>
														<td>
															<div className="d-flex align-items-center">
																<div className="avatar avatar-sm me-2">
																	<img 
																		src={user.profile_image || '/html-folder/images/team8.jpg'} 
																		alt={user.first_name} 
																		className="rounded-circle"
																	/>
																</div>
																<div>
																	<h6 className="mb-0">{user.first_name} {user.last_name}</h6>
																</div>
															</div>
														</td>
														<td>{user.email}</td>
														<td>{user.phone || 'N/A'}</td>
														<td>
															<span className={`badge ${getRoleBadgeClass(user.role)}`}>
																{user.role?.replace('_', ' ')?.toUpperCase()}
															</span>
														</td>
														<td>
															<select
																className={`form-select form-select-sm badge ${getStatusBadgeClass(user.status)}`}
																value={user.status}
																onChange={(e) => handleStatusChange(user.user_id, e.target.value)}
																style={{ border: 'none', color: 'white' }}
															>
																<option value="active">Active</option>
																<option value="inactive">Inactive</option>
																<option value="suspended">Suspended</option>
															</select>
														</td>
														<td>{new Date(user.created_at).toLocaleDateString()}</td>
														<td>
											<div className="btn-group btn-group-sm">
												<button 
													className="btn btn-outline-primary btn-sm"
													title="View Details"
													onClick={() => openViewModal(user)}
												>
													<i className="la la-eye"></i>
												</button>
												<button 
													className="btn btn-outline-secondary btn-sm"
													title="Edit User"
													onClick={() => openEditModal(user)}
												>
													<i className="la la-edit"></i>
												</button>
												<button
													className="btn btn-outline-success btn-sm"
													title="Login as this user"
													onClick={async () => {
														try {
															const resp = await fetch('/api/admin/impersonate', {
																method: 'POST',
																headers: { 'Content-Type': 'application/json' },
																credentials: 'include',
																body: JSON.stringify({ user_id: user.user_id })
															});
															const data = await resp.json();
															if (resp.ok && data.success) {
																window.location.href = data.redirectTo || '/';
															} else {
																alert(data.error || 'Failed to impersonate user');
															}
														} catch (e) {
															console.error('Impersonate failed', e);
															alert('Failed to impersonate user');
														}
													}}
												>
													<i className="la la-sign-in"></i>
												</button>
												{user.user_id !== 1 && ( // Don't allow deleting admin user
													<button 
														className="btn btn-outline-danger btn-sm"
														title="Delete User"
														onClick={() => openDeleteModal(user)}
													>
														<i className="la la-trash"></i>
													</button>
												)}
											</div>
														</td>
													</tr>
												))
											) : (
												<tr>
													<td colSpan="8" className="text-center py-4">
														<i className="la la-users" style={{fontSize: '48px', color: '#ccc'}}></i>
														<p className="text-muted mt-2">No users found</p>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							)}
							
							{/* Pagination */}
							{totalPages > 1 && (
								<div className="d-flex justify-content-between align-items-center mt-3">
									<div className="text-muted">
										Showing {startIndex + 1}-{endIndex} of {pagination.total} users
									</div>
									<nav>
										<ul className="pagination pagination-sm mb-0">
											<li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
												<button 
													className="page-link" 
													onClick={() => handlePageChange(pagination.page - 1)}
													disabled={pagination.page === 1}
												>
													Previous
												</button>
											</li>
											{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
												<li key={page} className={`page-item ${pagination.page === page ? 'active' : ''}`}>
													<button 
														className="page-link" 
														onClick={() => handlePageChange(page)}
													>
														{page}
													</button>
												</li>
											))}
											<li className={`page-item ${pagination.page === totalPages ? 'disabled' : ''}`}>
												<button 
													className="page-link" 
													onClick={() => handlePageChange(pagination.page + 1)}
													disabled={pagination.page === totalPages}
												>
													Next
												</button>
											</li>
										</ul>
									</nav>
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
									{modalType === 'add' && 'Add New User'}
									{modalType === 'edit' && 'Edit User'}
									{modalType === 'delete' && 'Confirm Delete'}
									{modalType === 'view' && 'User Details'}
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
										<p>Do you want to delete the user <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>?</p>
										<p className="text-muted">This action cannot be undone.</p>
									</div>
								</div>
							) : modalType === 'view' ? (
								<div className="modal-body">
									<div className="row">
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">User ID</label>
												<p className="form-control-plaintext">#{selectedUser?.user_id}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Role</label>
												<p className="form-control-plaintext">
													<span className={`badge ${getRoleBadgeClass(selectedUser?.role)}`}>
														{selectedUser?.role?.replace('_', ' ')?.toUpperCase()}
													</span>
												</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Name</label>
												<p className="form-control-plaintext">{selectedUser?.first_name} {selectedUser?.last_name}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Email</label>
												<p className="form-control-plaintext">{selectedUser?.email}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Phone</label>
												<p className="form-control-plaintext">{selectedUser?.phone || 'N/A'}</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Status</label>
												<p className="form-control-plaintext">
													<span className={`badge ${getStatusBadgeClass(selectedUser?.status)}`}>
														{selectedUser?.status?.toUpperCase()}
													</span>
												</p>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group mb-3">
												<label className="form-label fw-bold">Created At</label>
												<p className="form-control-plaintext">{selectedUser?.created_at ? new Date(selectedUser.created_at).toLocaleString() : 'N/A'}</p>
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
													<label className="form-label">First Name *</label>
													<input
														type="text"
														name="first_name"
														className="form-control"
														value={formData.first_name}
														onChange={handleInputChange}
														required
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Last Name *</label>
													<input
														type="text"
														name="last_name"
														className="form-control"
														value={formData.last_name}
														onChange={handleInputChange}
														required
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Email *</label>
													<input
														type="email"
														name="email"
														className="form-control"
														value={formData.email}
														onChange={handleInputChange}
														required
														disabled={modalType === 'edit'} // Don't allow email changes
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Phone</label>
													<input
														type="text"
														name="phone"
														className="form-control"
														value={formData.phone}
														onChange={handleInputChange}
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group mb-3">
													<label className="form-label">Role *</label>
													<select
														name="role"
														className="form-select"
														value={formData.role}
														onChange={handleInputChange}
														required
													>
														<option value="customer">Customer</option>
														<option value="agency_owner">Agency Owner</option>
														<option value="admin">Admin</option>
													</select>
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
														<option value="active">Active</option>
														<option value="inactive">Inactive</option>
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
										Delete User
									</button>
								) : modalType === 'view' ? null : (
									<button 
										type="button" 
										className="btn btn-primary" 
										onClick={handleSubmit}
									>
										{modalType === 'add' ? 'Create User' : 'Update User'}
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



