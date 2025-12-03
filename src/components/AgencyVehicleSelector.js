'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';

export default function AgencyVehicleSelector() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicleDetails, setVehicleDetails] = useState(null);
    const [formData, setFormData] = useState({
        category_id: 1,
        type: 'small_car',
        price_low: '',
        price_high: '',
        price_holiday: '',
        daily_rate: '',
        weekly_rate: '',
        monthly_rate: '',
        deposit_amount: 200.00,
        mileage_limit: 200,
        extra_mileage_cost: 0.15,
        description: '',
        air_conditioning: true,
        airbags: true,
        navigation_system: false,
        bluetooth: false,
        wifi: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await fetch('/api/admin/scrape-vehicles?limit=1000');
            const data = await response.json();
            
            if (data.success) {
                const vehicleOptions = data.vehicles.map(vehicle => ({
                    value: vehicle.id,
                    label: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
                    vehicle: vehicle
                }));
                setVehicles(vehicleOptions);
            } else {
                console.error('Failed to fetch vehicles:', data.message);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVehicleSelect = (selectedOption) => {
        setSelectedVehicle(selectedOption);
        setVehicleDetails(selectedOption?.vehicle || null);
        
        if (selectedOption?.vehicle) {
            const vehicle = selectedOption.vehicle;
            setFormData(prev => ({
                ...prev,
                daily_rate: vehicle.daily_rate || prev.daily_rate,
                price_low: vehicle.daily_rate || prev.price_low,
                price_high: vehicle.daily_rate ? (vehicle.daily_rate * 1.3).toFixed(2) : prev.price_high,
                price_holiday: vehicle.daily_rate ? (vehicle.daily_rate * 1.5).toFixed(2) : prev.price_holiday,
                weekly_rate: vehicle.daily_rate ? (vehicle.daily_rate * 6).toFixed(2) : prev.weekly_rate,
                monthly_rate: vehicle.daily_rate ? (vehicle.daily_rate * 25).toFixed(2) : prev.monthly_rate,
                description: `${vehicle.make} ${vehicle.model} ${vehicle.year} - ${vehicle.description || 'Premium rental vehicle'}`
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedVehicle) {
            setMessage('Please select a vehicle first');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch('/api/agency/vehicles/select', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    vehicleId: selectedVehicle.value,
                    agencyVehicleData: formData
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('✅ Vehicle added to your fleet successfully!');
                // Reset form
                setSelectedVehicle(null);
                setVehicleDetails(null);
                setFormData({
                    category_id: 1,
                    type: 'small_car',
                    price_low: '',
                    price_high: '',
                    price_holiday: '',
                    daily_rate: '',
                    weekly_rate: '',
                    monthly_rate: '',
                    deposit_amount: 200.00,
                    mileage_limit: 200,
                    extra_mileage_cost: 0.15,
                    description: '',
                    air_conditioning: true,
                    airbags: true,
                    navigation_system: false,
                    bluetooth: false,
                    wifi: false
                });
            } else {
                setMessage(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '50px',
            borderRadius: '8px',
            borderColor: '#d1d5db',
            fontSize: '16px'
        }),
        option: (provided, state) => ({
            ...provided,
            padding: '12px 16px',
            fontSize: '16px',
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white'
        })
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading vehicles...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Add Vehicle to Fleet</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Vehicle from Catalog
                    </label>
                    <Select
                        options={vehicles}
                        value={selectedVehicle}
                        onChange={handleVehicleSelect}
                        placeholder="Search and select a vehicle..."
                        isSearchable
                        styles={customSelectStyles}
                        className="mb-4"
                    />
                </div>

                {/* Vehicle Preview */}
                {vehicleDetails && (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Vehicle Preview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    {vehicleDetails.make} {vehicleDetails.model} {vehicleDetails.year}
                                </h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><strong>Engine:</strong> {vehicleDetails.energy || 'Gasoline'}</p>
                                    <p><strong>Transmission:</strong> {vehicleDetails.gear_type || 'Automatic'}</p>
                                    <p><strong>Seats:</strong> {vehicleDetails.seats || 5}</p>
                                    <p><strong>Doors:</strong> {vehicleDetails.doors || 4}</p>
                                    {vehicleDetails.mileage && <p><strong>Mileage:</strong> {vehicleDetails.mileage.toLocaleString()}</p>}
                                    <p><strong>Source:</strong> {vehicleDetails.source}</p>
                                </div>
                            </div>
                            <div>
                                {vehicleDetails.images && vehicleDetails.images.length > 0 ? (
                                    <img
                                        src={vehicleDetails.images[0]}
                                        alt={`${vehicleDetails.make} ${vehicleDetails.model}`}
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = '/images/cars/default-car.jpg';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">No image available</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pricing Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate ($)</label>
                        <input
                            type="number"
                            name="daily_rate"
                            value={formData.daily_rate}
                            onChange={handleInputChange}
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate ($)</label>
                        <input
                            type="number"
                            name="weekly_rate"
                            value={formData.weekly_rate}
                            onChange={handleInputChange}
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate ($)</label>
                        <input
                            type="number"
                            name="monthly_rate"
                            value={formData.monthly_rate}
                            onChange={handleInputChange}
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Vehicle Type and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="small_car">Small Car</option>
                            <option value="transporter">Transporter</option>
                            <option value="suv">SUV</option>
                            <option value="luxury">Luxury</option>
                            <option value="motorcycle">Motorcycle</option>
                            <option value="van">Van</option>
                            <option value="truck">Truck</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="1">Economy</option>
                            <option value="2">Compact</option>
                            <option value="3">SUV</option>
                            <option value="4">Luxury</option>
                            <option value="5">Van</option>
                            <option value="6">Truck</option>
                        </select>
                    </div>
                </div>

                {/* Features */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Features</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { key: 'air_conditioning', label: 'Air Conditioning' },
                            { key: 'airbags', label: 'Airbags' },
                            { key: 'navigation_system', label: 'Navigation System' },
                            { key: 'bluetooth', label: 'Bluetooth' },
                            { key: 'wifi', label: 'WiFi' }
                        ].map(feature => (
                            <label key={feature.key} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name={feature.key}
                                    checked={formData[feature.key]}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">{feature.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter vehicle description..."
                    />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={isSubmitting || !selectedVehicle}
                        className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Adding Vehicle...' : 'Add to Fleet'}
                    </button>
                    
                    {message && (
                        <div className={`px-4 py-2 rounded-md text-sm ${
                            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {message}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
