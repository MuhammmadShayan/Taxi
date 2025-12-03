'use client';

import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../../components/AdminLayout';

export default function CarScrapingPage() {
    const [scrapingStatus, setScrapingStatus] = useState('idle'); // idle, loading, success, error
    const [scrapingData, setScrapingData] = useState(null);
    const [enrichmentStatus, setEnrichmentStatus] = useState('idle'); // idle, loading, success, error
    const [enrichmentData, setEnrichmentData] = useState(null);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState({
        pakwheelsPages: 2,
        carsdotcomPages: 2,
        autotraderPages: 2,
        cargurusPages: 2,
        carmaxPages: 2,
        vroomPages: 2,
        includeAllSources: false,
        apiKey: 'AIzaSyA760-E0vJztYtAzbhKgcs8rf6EOhMm-bk'
    });
    const [systemInfo, setSystemInfo] = useState(null);

    const breadcrumbItems = useMemo(() => [
        { label: 'Home', href: '/' },
        { label: 'Admin', href: '/admin' },
        { label: 'Scrape Cars' }
    ], []);

    useEffect(() => {
        fetchSystemInfo();
    }, []);

    const fetchSystemInfo = async () => {
        try {
            const response = await fetch('/api/admin/scrape-cars');
            const contentType = response.headers.get('content-type') || '';

            if (!contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Error fetching system info (non-JSON response):', text);
                return;
            }

            const data = await response.json();
            if (data.success) {
                setSystemInfo(data.data);
            }
        } catch (error) {
            console.error('Error fetching system info:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name.includes('Pages') ? parseInt(value) || 1 : value)
        }));
    };

    const startScraping = async () => {
        setScrapingStatus('loading');
        setError('');
        setScrapingData(null);

        try {
            const response = await fetch('/api/admin/scrape-cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...settings, action: 'scrape'})
            });

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Unexpected response from server (status ${response.status}): ${text.slice(0, 200)}`);
            }

            const data = await response.json();

            if (data.success) {
                setScrapingStatus('success');
                setScrapingData(data.data);
                // Refresh system info
                fetchSystemInfo();
            } else {
                setScrapingStatus('error');
                setError(data.error || data.details || 'Scraping failed');
            }
        } catch (error) {
            setScrapingStatus('error');
            setError('Network error: ' + error.message);
        }
    };

    const startEnrichment = async () => {
        setEnrichmentStatus('loading');
        setError('');
        setEnrichmentData(null);

        try {
            const response = await fetch('/api/admin/scrape-cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...settings, action: 'enrich'})
            });

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Unexpected response from server (status ${response.status}): ${text.slice(0, 200)}`);
            }

            const data = await response.json();

            if (data.success) {
                setEnrichmentStatus('success');
                setEnrichmentData(data.data);
                // Refresh system info
                fetchSystemInfo();
            } else {
                setEnrichmentStatus('error');
                setError(data.error || data.details || 'Enrichment failed');
            }
        } catch (error) {
            setEnrichmentStatus('error');
            setError('Network error: ' + error.message);
        }
    };

    const resetScraping = () => {
        setScrapingStatus('idle');
        setScrapingData(null);
        setEnrichmentStatus('idle');
        setEnrichmentData(null);
        setError('');
    };

    return (
        <AdminLayout
            pageTitle="Car Scraping Module"
            breadcrumbItems={breadcrumbItems}
            showStats={false}
        >
        <div className="row">
            <div className="col-lg-12">
                <div className="form-box">
                    <div className="form-title-wrap">
                        <h3 className="title">Car Scraping Configuration</h3>
                    </div>
                    <div className="form-content">

            {/* System Information */}
            {systemInfo && (
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #dee2e6', 
                    borderRadius: '8px', 
                    padding: '20px', 
                    marginBottom: '30px' 
                }}>
                    <h3 style={{ color: '#495057', marginBottom: '15px' }}>System Status</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div>
                            <strong>Total Cars in Database:</strong>
                            <div style={{ fontSize: '24px', color: '#28a745', fontWeight: 'bold' }}>
                                {systemInfo.carCount}
                            </div>
                        </div>
                        <div>
                            <strong>Supported Sources:</strong>
                            <div style={{ color: '#6c757d' }}>
                                {systemInfo.supportedSources.join(', ')}
                            </div>
                        </div>
                        <div>
                            <strong>Max Pages per Site:</strong>
                            <div style={{ color: '#6c757d' }}>
                                {systemInfo.maxPagesPerSite}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Scraping Configuration */}
            <div style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #dee2e6', 
                borderRadius: '8px', 
                padding: '20px', 
                marginBottom: '30px' 
            }}>
                <h3 style={{ color: '#495057', marginBottom: '20px' }}>Scraping Configuration</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            PakWheels Pages:
                        </label>
                        <input
                            type="number"
                            name="pakwheelsPages"
                            value={settings.pakwheelsPages}
                            onChange={handleInputChange}
                            min="1"
                            max="200"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                        <small style={{ color: '#6c757d' }}>Number of pages to scrape (1-200)</small>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Cars.com Pages:
                        </label>
                        <input
                            type="number"
                            name="carsdotcomPages"
                            value={settings.carsdotcomPages}
                            onChange={handleInputChange}
                            min="1"
                            max="200"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                        <small style={{ color: '#6c757d' }}>Number of pages to scrape (1-200)</small>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            API Key:
                        </label>
                        <input
                            type="password"
                            name="apiKey"
                            value={settings.apiKey}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                        <small style={{ color: '#6c757d' }}>Google AI Studio API key for authentication</small>
                    </div>
                </div>
                
                {/* Advanced Options */}
                <div style={{ 
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '15px',
                    marginTop: '20px'
                }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="includeAllSources"
                                checked={settings.includeAllSources}
                                onChange={handleInputChange}
                                style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                            />
                            <span style={{ fontWeight: 'bold', color: '#495057' }}>
                                Include Additional Sources (AutoTrader, CarGurus, CarMax, Vroom)
                            </span>
                        </label>
                        <small style={{ color: '#6c757d', marginLeft: '28px', display: 'block', marginTop: '5px' }}>
                            Enable scraping from all available sources for maximum car variety
                        </small>
                    </div>
                    
                    {settings.includeAllSources && (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                            gap: '15px',
                            paddingTop: '15px',
                            borderTop: '1px solid #dee2e6'
                        }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                    AutoTrader Pages:
                                </label>
                                <input
                                    type="number"
                                    name="autotraderPages"
                                    value={settings.autotraderPages}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="200"
                                    style={{
                                        width: '100%',
                                        padding: '6px 10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '13px'
                                    }}
                                />
                                <small style={{ color: '#6c757d' }}>UK/European cars</small>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                    CarGurus Pages:
                                </label>
                                <input
                                    type="number"
                                    name="cargurusPages"
                                    value={settings.cargurusPages}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="200"
                                    style={{
                                        width: '100%',
                                        padding: '6px 10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '13px'
                                    }}
                                />
                                <small style={{ color: '#6c757d' }}>Canadian market</small>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                    CarMax Pages:
                                </label>
                                <input
                                    type="number"
                                    name="carmaxPages"
                                    value={settings.carmaxPages}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="200"
                                    style={{
                                        width: '100%',
                                        padding: '6px 10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '13px'
                                    }}
                                />
                                <small style={{ color: '#6c757d' }}>Used car dealer</small>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                    Vroom Pages:
                                </label>
                                <input
                                    type="number"
                                    name="vroomPages"
                                    value={settings.vroomPages}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="200"
                                    style={{
                                        width: '100%',
                                        padding: '6px 10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        fontSize: '13px'
                                    }}
                                />
                                <small style={{ color: '#6c757d' }}>Online marketplace</small>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <button
                    onClick={() => setSettings(prev => ({ ...prev, carsdotcomPages: 60 }))}
                    className="btn btn-outline-success"
                >Target ~1200 Cars (Cars.com 60 pages)</button>
                <button
                    onClick={() => setSettings(prev => ({ ...prev, carsdotcomPages: 100 }))}
                    className="btn btn-outline-secondary ms-2"
                >Aggressive (~2000 Cars)</button>
            </div>

            {/* Action Buttons */}
            <div style={{ marginBottom: '30px' }}>
                <button
                    onClick={startScraping}
                    disabled={scrapingStatus === 'loading' || enrichmentStatus === 'loading'}
                    style={{
                        backgroundColor: scrapingStatus === 'loading' ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: (scrapingStatus === 'loading' || enrichmentStatus === 'loading') ? 'not-allowed' : 'pointer',
                        marginRight: '10px'
                    }}
                >
                    {scrapingStatus === 'loading' ? 'Scraping New Cars...' : 'Scrape New Cars Only'}
                </button>

                <button
                    onClick={startEnrichment}
                    disabled={scrapingStatus === 'loading' || enrichmentStatus === 'loading'}
                    style={{
                        backgroundColor: enrichmentStatus === 'loading' ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: (scrapingStatus === 'loading' || enrichmentStatus === 'loading') ? 'not-allowed' : 'pointer',
                        marginRight: '10px'
                    }}
                >
                    {enrichmentStatus === 'loading' ? 'Enriching Data...' : 'Enrich Existing Vehicles'}
                </button>

                {(scrapingStatus !== 'idle' || enrichmentStatus !== 'idle') && (
                    <button
                        onClick={resetScraping}
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Loading Indicators */}
            {scrapingStatus === 'loading' && (
                <div style={{ 
                    backgroundColor: '#e7f3ff', 
                    border: '1px solid #0066cc', 
                    borderRadius: '8px', 
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid #f3f3f3',
                            borderTop: '2px solid #0066cc',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginRight: '10px'
                        }}></div>
                        <strong>Scraping new cars from Cars.com (skipping existing)...</strong>
                    </div>
                    <p style={{ margin: '10px 0 0 0', color: '#0066cc' }}>
                        Only new vehicles not already in the database will be added. Please wait...
                    </p>
                </div>
            )}

            {enrichmentStatus === 'loading' && (
                <div style={{ 
                    backgroundColor: '#e8f5e8', 
                    border: '1px solid #28a745', 
                    borderRadius: '8px', 
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid #f3f3f3',
                            borderTop: '2px solid #28a745',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginRight: '10px'
                        }}></div>
                        <strong>Enriching existing vehicle data with missing details and images...</strong>
                    </div>
                    <p style={{ margin: '10px 0 0 0', color: '#28a745' }}>
                        Filling empty fields and downloading images for vehicles with incomplete data. Please wait...
                    </p>
                </div>
            )}

            {/* Error Display */}
            {(scrapingStatus === 'error' || enrichmentStatus === 'error') && (
                <div style={{ 
                    backgroundColor: '#ffe6e6', 
                    border: '1px solid #cc0000', 
                    borderRadius: '8px', 
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h4 style={{ color: '#cc0000', margin: '0 0 10px 0' }}>
                        {scrapingStatus === 'error' ? 'Scraping Failed' : 'Enrichment Failed'}
                    </h4>
                    <p style={{ color: '#cc0000', margin: 0 }}>{error}</p>
                </div>
            )}

            {/* Success Results */}
            {scrapingStatus === 'success' && scrapingData && (
                <div style={{ 
                    backgroundColor: '#e6ffe6', 
                    border: '1px solid #00cc00', 
                    borderRadius: '8px', 
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h4 style={{ color: '#00cc00', margin: '0 0 15px 0' }}>Scraping Completed Successfully!</h4>
                    
                    {/* Summary Stats */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                        gap: '15px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                                {scrapingData.totalScraped}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Total Scraped</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                                {scrapingData.totalSaved}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Successfully Saved</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                                {scrapingData.totalFailed}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Failed</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>
                                {scrapingData.uniqueCars}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Unique Cars</div>
                        </div>
                    </div>

                    {/* Saved Cars Preview */}
                    {scrapingData.savedCars && scrapingData.savedCars.length > 0 && (
                        <div>
                            <h5 style={{ margin: '20px 0 10px 0' }}>Recently Added Cars (Preview)</h5>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>ID</th>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Make</th>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Model</th>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Year</th>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Price/Day</th>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Source</th>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scrapingData.savedCars.map((car, index) => (
                                            <tr key={index}>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{car.id}</td>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{car.make}</td>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{car.model}</td>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{car.year}</td>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>${car.price_per_day}</td>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{car.source}</td>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{car.location}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Failed Cars (if any) */}
                    {scrapingData.failedCars && scrapingData.failedCars.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h5 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>Failed Cars</h5>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>
                                {scrapingData.failedCars.map((car, index) => (
                                    <div key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
                                        <strong>{car.make} {car.model} {car.year}</strong> - {car.error}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Enrichment Results */}
            {enrichmentStatus === 'success' && enrichmentData && (
                <div style={{ 
                    backgroundColor: '#e8f5e8', 
                    border: '1px solid #28a745', 
                    borderRadius: '8px', 
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h4 style={{ color: '#28a745', margin: '0 0 15px 0' }}>Data Enrichment Completed Successfully!</h4>
                    
                    {/* Summary Stats */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                        gap: '15px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                                {enrichmentData.totalProcessed}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Vehicles Processed</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                                {enrichmentData.totalEnriched}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Successfully Enriched</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                                {enrichmentData.totalFailed}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Failed</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>
                                {enrichmentData.enrichedVehicles ? enrichmentData.enrichedVehicles.filter(v => v.hasImage).length : 0}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Images Added</div>
                        </div>
                    </div>

                    {/* Enriched Vehicles Preview */}
                    {enrichmentData.enrichedVehicles && enrichmentData.enrichedVehicles.length > 0 && (
                        <div>
                            <h5 style={{ margin: '20px 0 10px 0' }}>Recently Enriched Vehicles (Preview)</h5>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>ID</th>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Vehicle</th>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Fields Added</th>
                                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Image</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrichmentData.enrichedVehicles.map((vehicle, index) => (
                                            <tr key={index}>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{vehicle.id}</td>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>
                                                    {vehicle.make} {vehicle.model} {vehicle.year}
                                                </td>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>
                                                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>{vehicle.fieldsAdded}</span> fields
                                                </td>
                                                <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>
                                                    {vehicle.hasImage ? 
                                                        <span style={{ color: '#28a745' }}>✓ Added</span> : 
                                                        <span style={{ color: '#6c757d' }}>- No image</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Failed Vehicles (if any) */}
                    {enrichmentData.failedVehicles && enrichmentData.failedVehicles.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h5 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>Failed Enrichments</h5>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>
                                {enrichmentData.failedVehicles.map((vehicle, index) => (
                                    <div key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
                                        <strong>#{vehicle.id} {vehicle.make} {vehicle.model} {vehicle.year}</strong> - {vehicle.error}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

                    {/* CSS for spinner animation */}
                    <style jsx>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                    </div>
                </div>
            </div>
        </div>
        </AdminLayout>
    );
}

