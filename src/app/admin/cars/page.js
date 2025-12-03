'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminCars() {
	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		const fetchCars = async () => {
			try {
				setLoading(true);
				setError(null);
				console.log('Fetching cars from /api/cars...');
				
				const response = await fetch('/api/cars');
				const data = await response.json();
				
				console.log('API Response:', data);
				
				if (!response.ok) {
					throw new Error(data.error || `HTTP ${response.status}`);
				}
				
				setCars(data.cars || []);
			} catch (err) {
				console.error('Error fetching cars:', err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		
		fetchCars();
	}, []);
	return (
		<AdminLayout>
			<div className="dashboard-content">
				<div className="dashboard-tlbar d-flex align-items-center justify-content-between">
					<div className="dashboard-tlbar-left">
						<h3 className="dashboard-heading">Car Management</h3>
						<p className="dashboard-text">Manage all vehicles in your fleet</p>
					</div>
					<div className="dashboard-tlbar-right">
						<Link href="/admin/dashboard-add-car" className="btn btn-primary">
							<i className="la la-plus me-2"></i>Add New Car
						</Link>
					</div>
				</div>

				<div className="dashboard-cards">
					<div className="card">
						<div className="card-body">
							{loading && (
								<div className="text-center py-4">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
									<p className="mt-2">Loading vehicles...</p>
								</div>
							)}
							
							{error && (
								<div className="alert alert-danger" role="alert">
									<h6 className="alert-heading">Error Loading Vehicles</h6>
									<p className="mb-0">{error}</p>
								</div>
							)}
							
							{!loading && !error && (
								<div className="table-responsive">
									<table className="table table-hover">
										<thead>
											<tr>
												<th>Image</th>
												<th>ID</th>
												<th>Make</th>
												<th>Model</th>
												<th>Year</th>
												<th>Price/Day</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{cars.length === 0 ? (
												<tr>
													<td colSpan="7" className="text-center py-4">
														<div className="text-muted">
															<i className="la la-car" style={{fontSize: '3rem'}}></i>
															<p className="mt-2 mb-0">No vehicles found</p>
															<p className="small">Add some vehicles or use the scraping tool to populate data</p>
														</div>
													</td>
												</tr>
											) : cars.map(c => {
											let img = '/html-folder/images/car-img.png';
											try {
												if (c.images) {
													const parsed = Array.isArray(c.images) ? c.images : JSON.parse(c.images);
													if (Array.isArray(parsed) && parsed[0]) img = parsed[0];
													else if (typeof parsed === 'string' && parsed) img = parsed;
												}
											} catch(_) {}
											return (
											<tr key={c.id}>
												<td>
													<img 
														src={img} 
														alt="Car thumbnail" 
														className="rounded" 
														style={{ width: 64, height: 48, objectFit: 'cover' }} 
													/>
												</td>
												<td><strong>{c.id}</strong></td>
												<td>{c.make}</td>
												<td>{c.model}</td>
												<td>{c.year}</td>
												<td><strong>${c.price_per_day}</strong></td>
												<td>
													<div className="btn-group">
														<Link href={`/cars/${c.id}`} className="btn btn-sm btn-outline-primary">
															<i className="la la-eye"></i>
														</Link>
														<Link href={`/admin/dashboard-manage-car?id=${c.id}`} className="btn btn-sm btn-outline-warning">
															<i className="la la-edit"></i>
														</Link>
													</div>
												</td>
											</tr>
											);
										})}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}



