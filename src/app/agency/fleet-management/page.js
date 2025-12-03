'use client';

import { useState, useEffect } from 'react';
import AgencyVehicleSelector from '../../../components/AgencyVehicleSelector';

export default function FleetManagementPage() {
    const [activeTab, setActiveTab] = useState('add');
    const [myVehicles, setMyVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agency, setAgency] = useState(null);

    useEffect(() => {
        if (activeTab === 'manage') {
            fetchMyVehicles();
        }
    }, [activeTab]);

    const fetchMyVehicles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch('/api/agency/vehicles/select', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setAgency(data.agency);
                setMyVehicles(data.vehicles);
            } else {
                console.error('Failed to fetch vehicles:', data.message);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVehicleStatusChange = async (vehicleId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`/api/agency/vehicles/${vehicleId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                // Refresh the vehicles list
                fetchMyVehicles();
            } else {
                alert('Failed to update vehicle status');
            }
        } catch (error) {
            console.error('Error updating vehicle status:', error);
            alert('Error updating vehicle status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Add vehicles from our catalog and manage your rental fleet
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('add')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'add'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Add Vehicle
                            </button>
                            <button
                                onClick={() => setActiveTab('manage')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'manage'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                My Fleet ({myVehicles.length})
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'add' && (
                            <div>
                                <AgencyVehicleSelector />
                            </div>
                        )}

                        {activeTab === 'manage' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        My Fleet {agency && `- ${agency.business_name}`}
                                    </h2>
                                    <button
                                        onClick={fetchMyVehicles}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Refresh
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center items-center p-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-3 text-gray-600">Loading vehicles...</span>
                                    </div>
                                ) : myVehicles.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 text-6xl mb-4">🚗</div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles in your fleet</h3>
                                        <p className="text-gray-600 mb-4">Start by adding vehicles from our catalog</p>
                                        <button
                                            onClick={() => setActiveTab('add')}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            Add Your First Vehicle
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {myVehicles.map((vehicle) => (
                                            <div key={vehicle.vehicle_id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                                                {/* Vehicle Image */}
                                                <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                                                    {vehicle.images && vehicle.images.length > 0 ? (
                                                        <img
                                                            src={vehicle.images[0]}
                                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = '/images/cars/default-car.jpg';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-gray-400 text-sm">No image</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Status Badge */}
                                                    <div className="absolute top-2 right-2">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            vehicle.status === 'available' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : vehicle.status === 'rented'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : vehicle.status === 'maintenance'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {vehicle.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Vehicle Details */}
                                                <div className="p-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {vehicle.brand} {vehicle.model} {vehicle.year}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {vehicle.vehicle_number}
                                                    </p>
                                                    
                                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                                        <div>💰 ${vehicle.daily_rate}/day</div>
                                                        <div>⛽ {vehicle.energy}</div>
                                                        <div>👥 {vehicle.seats} seats</div>
                                                        <div>🚪 {vehicle.doors} doors</div>
                                                    </div>

                                                    {/* Features */}
                                                    <div className="flex flex-wrap gap-1 mb-3">
                                                        {vehicle.air_conditioning && (
                                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">AC</span>
                                                        )}
                                                        {vehicle.navigation_system && (
                                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">GPS</span>
                                                        )}
                                                        {vehicle.bluetooth && (
                                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Bluetooth</span>
                                                        )}
                                                        {vehicle.wifi && (
                                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">WiFi</span>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex space-x-2">
                                                        <select
                                                            value={vehicle.status}
                                                            onChange={(e) => handleVehicleStatusChange(vehicle.vehicle_id, e.target.value)}
                                                            className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1"
                                                        >
                                                            <option value="available">Available</option>
                                                            <option value="rented">Rented</option>
                                                            <option value="maintenance">Maintenance</option>
                                                            <option value="inactive">Inactive</option>
                                                        </select>
                                                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
