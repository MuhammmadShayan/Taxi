'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminPickupLocations() {
	const [locations, setLocations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('name');
	const [showAddModal, setShowAddModal] = useState(false);
	const [editingLocation, setEditingLocation] = useState(null);
	const [newLocation, setNewLocation] = useState({
		name: '',
		address: '',
		city: '',
		country: '',
		latitude: '',
		longitude: '',
		type: 'agency',
		contact_phone: '',
		contact_email: '',
		opening_hours: '',
		is_active: true
	});

	// Load locations from API
	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				const res = await fetch('/api/admin/pickup-locations', { cache: 'no-store' });
				if (!res.ok) throw new Error('Failed to load pickup locations');
				const data = await res.json();
				setLocations(Array.isArray(data?.locations) ? data.locations : []);
			} catch (e) {
				console.error('Pickup locations load error:', e);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const handleAddLocation = () => {
		const id = Math.max(...locations.map(l => l.id)) + 1;
		const location = {
			...newLocation,
			id,
			created_at: new Date().toISOString()
		};
		setLocations([location, ...locations]);
		setNewLocation({
			name: '',
			address: '',
			city: '',
			country: '',
			latitude: '',
			longitude: '',
			type: 'agency',
			contact_phone: '',
			contact_email: '',
			opening_hours: '',
			is_active: true
		});
		setShowAddModal(false);
	};

	const handleEditLocation = (location) => {
		setEditingLocation(location);
		setNewLocation({ ...location });
		setShowAddModal(true);
	};

	const handleUpdateLocation = () => {
		setLocations(locations.map(l => 
			l.id === editingLocation.id ? { ...newLocation } : l
		));
		setEditingLocation(null);
		setShowAddModal(false);
		setNewLocation({
			name: '',
			address: '',
			city: '',
			country: '',
			latitude: '',
			longitude: '',
			type: 'agency',
			contact_phone: '',
			contact_email: '',
			opening_hours: '',
			is_active: true
		});
	};

	const handleDeleteLocation = (id) => {
		if (confirm('Are you sure you want to delete this pickup location?')) {
			setLocations(locations.filter(l => l.id !== id));
		}
	};

	const toggleLocationStatus = (id) => {
		setLocations(locations.map(l => 
			l.id === id ? { ...l, is_active: !l.is_active } : l
		));
	};

	const filteredLocations = locations
		.filter(location => 
			location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
			location.address.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			switch(sortBy) {
				case 'name': return a.name.localeCompare(b.name);
				case 'city': return a.city.localeCompare(b.city);
				case 'type': return a.type.localeCompare(b.type);
				case 'created_at': return new Date(b.created_at) - new Date(a.created_at);
				default: return 0;
			}
		});

	const getTypeIcon = (type) => {
		switch(type) {
			case 'airport': return 'la la-plane';
			case 'train_station': return 'la la-train';
			case 'bus_station': return 'la la-bus';
			case 'hotel': return 'la la-bed';
			case 'city_center': return 'la la-building';
			default: return 'la la-map-marker';
		}
	};

	const getTypeBadge = (type) => {
		const badges = {
			airport: 'badge bg-primary',
			train_station: 'badge bg-success',
			bus_station: 'badge bg-info',
			hotel: 'badge bg-warning',
			city_center: 'badge bg-secondary',
			agency: 'badge bg-dark'
		};
		return badges[type] || 'badge bg-light';
	};

	return (
		<AdminLayout
			pageTitle="Pickup Locations"
			breadcrumbItems={[
				{ label: 'Home', href: '/' },
				{ label: 'Admin', href: '/admin' },
				{ label: 'Pickup Locations' }
			]}
		>
			<div className="dashboard-content">
				<div className="dashboard-tlbar d-flex align-items-center justify-content-between mb-4">
					<div className="dashboard-tlbar-left">
						<h3 className="dashboard-heading">Pickup Locations Management</h3>
						<p className="dashboard-text">Manage pickup and drop-off locations for vehicle rentals</p>
					</div>
					<div className="dashboard-tlbar-right">
						<button 
							onClick={() => setShowAddModal(true)}
							className="btn btn-primary"
						>
							<i className="la la-plus me-2"></i>Add New Location
						</button>
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="row mb-4">
					<div className="col-md-3">
						<div className="card bg-primary text-white">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<div>
										<h4 className="mb-0">{locations.length}</h4>
										<p className="mb-0">Total Locations</p>
									</div>
									<i className="la la-map-marker fa-2x"></i>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card bg-success text-white">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<div>
										<h4 className="mb-0">{locations.filter(l => l.is_active).length}</h4>
										<p className="mb-0">Active Locations</p>
									</div>
									<i className="la la-check-circle fa-2x"></i>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card bg-warning text-white">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<div>
										<h4 className="mb-0">{locations.filter(l => l.type === 'airport').length}</h4>
										<p className="mb-0">Airport Locations</p>
									</div>
									<i className="la la-plane fa-2x"></i>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card bg-info text-white">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<div>
										<h4 className="mb-0">{new Set(locations.map(l => l.city)).size}</h4>
										<p className="mb-0">Cities Covered</p>
									</div>
									<i className="la la-globe fa-2x"></i>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className="card mb-4">
					<div className="card-body">
						<div className="row align-items-center">
							<div className="col-md-6">
								<div className="input-group">
									<input
										type="text"
										className="form-control"
										placeholder="Search locations, cities, or addresses..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
									<span className="input-group-text">
										<i className="la la-search"></i>
									</span>
								</div>
							</div>
							<div className="col-md-3">
								<select
									className="form-select"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
								>
									<option value="name">Sort by Name</option>
									<option value="city">Sort by City</option>
									<option value="type">Sort by Type</option>
									<option value="created_at">Sort by Date Added</option>
								</select>
							</div>
							<div className="col-md-3">
								<div className="text-muted">
									{filteredLocations.length} of {locations.length} locations
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Locations Table */}
				<div className="card">
					<div className="card-body">
						{loading ? (
							<div className="text-center py-5">
								<div className="spinner-border text-primary" role="status">
									<span className="visually-hidden">Loading...</span>
								</div>
								<p className="mt-2">Loading pickup locations...</p>
							</div>
						) : (
							<div className="table-responsive">
								<table className="table table-hover">
									<thead>
										<tr>
											<th>Location</th>
											<th>Type</th>
											<th>Address</th>
											<th>Contact</th>
											<th>Hours</th>
											<th>Status</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{filteredLocations.map(location => (
											<tr key={location.id}>
												<td>
													<div className="d-flex align-items-center">
														<i className={`${getTypeIcon(location.type)} me-2 text-primary`}></i>
														<div>
															<strong>{location.name}</strong>
															<br />
															<small className="text-muted">{location.city}, {location.country}</small>
														</div>
													</div>
												</td>
												<td>
													<span className={getTypeBadge(location.type)}>
														{location.type.replace('_', ' ').toUpperCase()}
													</span>
												</td>
												<td>
													<small>{location.address}</small>
													{location.latitude && location.longitude && (
														<div className="mt-1">
															<small className="text-muted">
																📍 {location.latitude}, {location.longitude}
															</small>
														</div>
													)}
												</td>
												<td>
													<div>
														{location.contact_phone && (
															<div><small><i className="la la-phone me-1"></i>{location.contact_phone}</small></div>
														)}
														{location.contact_email && (
															<div><small><i className="la la-envelope me-1"></i>{location.contact_email}</small></div>
														)}
													</div>
												</td>
												<td>
													<small>{location.opening_hours || 'Not specified'}</small>
												</td>
												<td>
													<button
														className={`btn btn-sm ${location.is_active ? 'btn-success' : 'btn-secondary'}`}
														onClick={() => toggleLocationStatus(location.id)}
													>
														{location.is_active ? 'Active' : 'Inactive'}
													</button>
												</td>
												<td>
													<div className="btn-group">
														<button
															className="btn btn-sm btn-outline-warning"
															onClick={() => handleEditLocation(location)}
														>
															<i className="la la-edit"></i>
														</button>
														<button
															className="btn btn-sm btn-outline-danger"
															onClick={() => handleDeleteLocation(location.id)}
														>
															<i className="la la-trash"></i>
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
								{filteredLocations.length === 0 && (
									<div className="text-center py-4">
										<i className="la la-map-marker fa-3x text-muted mb-3"></i>
										<h5 className="text-muted">No pickup locations found</h5>
										<p className="text-muted">
											{searchTerm ? 'Try adjusting your search criteria' : 'Click "Add New Location" to get started'}
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Add/Edit Location Modal */}
			{showAddModal && (
				<>
					<div className="modal-backdrop fade show" onClick={() => setShowAddModal(false)} style={{zIndex: 1040}}></div>
					<div className="modal fade show" style={{display: 'block', zIndex: 1050}} tabIndex="-1">
						<div className="modal-dialog modal-lg">
							<div className="modal-content" onClick={(e) => e.stopPropagation()}>
							<div className="modal-header">
								<h5 className="modal-title">
									{editingLocation ? 'Edit Location' : 'Add New Pickup Location'}
								</h5>
								<button 
									type="button" 
									className="btn-close" 
									onClick={() => setShowAddModal(false)}
								></button>
							</div>
							<div className="modal-body">
								<form>
									<div className="row">
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label">Location Name *</label>
												<input
													type="text"
													className="form-control"
													value={newLocation.name}
													onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
													placeholder="Enter location name"
												/>
											</div>
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label">Type *</label>
												<select
													className="form-select"
													value={newLocation.type}
													onChange={(e) => setNewLocation({...newLocation, type: e.target.value})}
												>
													<option value="agency">Agency Office</option>
													<option value="airport">Airport</option>
													<option value="train_station">Train Station</option>
													<option value="bus_station">Bus Station</option>
													<option value="hotel">Hotel</option>
													<option value="city_center">City Center</option>
												</select>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-md-8">
											<div className="mb-3">
												<label className="form-label">Address *</label>
												<input
													type="text"
													className="form-control"
													value={newLocation.address}
													onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
													placeholder="Enter full address"
												/>
											</div>
										</div>
										<div className="col-md-4">
											<div className="mb-3">
												<label className="form-label">City *</label>
												<input
													type="text"
													className="form-control"
													value={newLocation.city}
													onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
													placeholder="Enter city"
												/>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-md-4">
											<div className="mb-3">
												<label className="form-label">Country *</label>
												<input
													type="text"
													className="form-control"
													value={newLocation.country}
													onChange={(e) => setNewLocation({...newLocation, country: e.target.value})}
													placeholder="Enter country"
												/>
											</div>
										</div>
										<div className="col-md-4">
											<div className="mb-3">
												<label className="form-label">Latitude</label>
												<input
													type="number"
													step="any"
													className="form-control"
													value={newLocation.latitude}
													onChange={(e) => setNewLocation({...newLocation, latitude: e.target.value})}
													placeholder="e.g., 33.5731"
												/>
											</div>
										</div>
										<div className="col-md-4">
											<div className="mb-3">
												<label className="form-label">Longitude</label>
												<input
													type="number"
													step="any"
													className="form-control"
													value={newLocation.longitude}
													onChange={(e) => setNewLocation({...newLocation, longitude: e.target.value})}
													placeholder="e.g., -7.5898"
												/>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label">Contact Phone</label>
												<input
													type="tel"
													className="form-control"
													value={newLocation.contact_phone}
													onChange={(e) => setNewLocation({...newLocation, contact_phone: e.target.value})}
													placeholder="+212 5XX XX XX XX"
												/>
											</div>
										</div>
										<div className="col-md-6">
											<div className="mb-3">
												<label className="form-label">Contact Email</label>
												<input
													type="email"
													className="form-control"
													value={newLocation.contact_email}
													onChange={(e) => setNewLocation({...newLocation, contact_email: e.target.value})}
													placeholder="location@holikey.com"
												/>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-md-8">
											<div className="mb-3">
												<label className="form-label">Opening Hours</label>
												<input
													type="text"
													className="form-control"
													value={newLocation.opening_hours}
													onChange={(e) => setNewLocation({...newLocation, opening_hours: e.target.value})}
													placeholder="e.g., 08:00 - 20:00 or 24/7"
												/>
											</div>
										</div>
										<div className="col-md-4">
											<div className="mb-3">
												<label className="form-label">Status</label>
												<div className="form-check form-switch mt-2">
													<input
														className="form-check-input"
														type="checkbox"
														checked={newLocation.is_active}
														onChange={(e) => setNewLocation({...newLocation, is_active: e.target.checked})}
													/>
													<label className="form-check-label">
														Active Location
													</label>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
							<div className="modal-footer">
								<button 
									type="button" 
									className="btn btn-secondary"
									onClick={() => setShowAddModal(false)}
								>
									Cancel
								</button>
								<button 
									type="button" 
									className="btn btn-primary"
									onClick={editingLocation ? handleUpdateLocation : handleAddLocation}
									disabled={!newLocation.name || !newLocation.address || !newLocation.city || !newLocation.country}
								>
									{editingLocation ? 'Update Location' : 'Add Location'}
								</button>
							</div>
						</div>
					</div>
				</div>
				</>
			)}
		</AdminLayout>
	);
}

