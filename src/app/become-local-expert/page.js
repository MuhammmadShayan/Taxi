'use client';
import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function BecomeLocalExpertPage() {
	const [status, setStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setIsLoading(true);
		const formData = new FormData(event.currentTarget);
		const payload = Object.fromEntries(formData.entries());
		
		// Handle checkbox arrays
		const languages = formData.getAll('languages');
		const vehicleTypes = formData.getAll('vehicle_types');
		const services = formData.getAll('services');
		
		try {
			const parts = String(payload.full_name || '').trim().split(' ');
			const first_name = parts.shift() || 'Driver';
			const last_name = parts.join(' ') || 'User';
			
			const res = await fetch('/api/driver/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					// Basic Information
					first_name,
					last_name,
					email: payload.email,
					password: payload.password || 'ChangeMe123!',
					phone: payload.phone,
					city: payload.city,
					state: payload.state,
					country: payload.country,
					zip_code: payload.zip_code,
					date_of_birth: payload.date_of_birth,
					gender: payload.gender,
					address: payload.address,
					
					// Professional Information
					license_number: payload.license_number,
					license_expiry: payload.license_expiry,
					license_class: payload.license_class,
					experience_years: parseInt(payload.experience_years) || 0,
					previous_company: payload.previous_company,
					commercial_license: payload.commercial_license === 'yes',
					
					// Vehicle & Services
					has_own_vehicle: payload.has_own_vehicle === 'yes',
					vehicle_make: payload.vehicle_make,
					vehicle_model: payload.vehicle_model,
					vehicle_year: parseInt(payload.vehicle_year) || null,
					vehicle_plate: payload.vehicle_plate,
					vehicle_types: vehicleTypes,
					services: services,
					
					// Additional Information
					languages: languages,
					emergency_contact_name: payload.emergency_contact_name,
					emergency_contact_phone: payload.emergency_contact_phone,
					background_check_consent: payload.background_check_consent === 'yes',
					terms_accepted: payload.terms_accepted === 'yes',
					marketing_consent: payload.marketing_consent === 'yes',
					about: payload.about,
					why_join: payload.why_join,
					availability_hours: payload.availability_hours,
					preferred_areas: payload.preferred_areas
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed');
			
			setStatus({ type: 'success', message: 'Registration successful! Please check your email for verification.' });
			setTimeout(() => {
				window.location.href = '/driver';
			}, 3000);
		} catch (e) {
			setStatus({ type: 'error', message: e.message });
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<Header />
			<section className="contact-area section--padding">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 mx-auto">
							<div className="section-heading text-center">
								<h2 className="sec__title">Become a Professional Driver</h2>
								<p className="sec__desc">Join our platform and start earning as a professional driver. Complete the form below to get started.</p>
							</div>
						</div>
					</div>
					
					<form onSubmit={handleSubmit} className="row g-4">
						{/* Personal Information Section */}
						<div className="col-12">
							<div className="form-section">
								<h4 className="section-title">Personal Information</h4>
								<div className="row g-3">
									<div className="col-md-6">
										<label className="label-text">Full Name *</label>
										<input name="full_name" className="form-control" required placeholder="Enter your full name" />
									</div>
									<div className="col-md-6">
										<label className="label-text">Email Address *</label>
										<input type="email" name="email" className="form-control" required placeholder="your@email.com" />
									</div>
									<div className="col-md-6">
										<label className="label-text">Phone Number *</label>
										<input name="phone" className="form-control" required placeholder="+1 (555) 123-4567" />
									</div>
									<div className="col-md-6">
										<label className="label-text">Date of Birth *</label>
										<input type="date" name="date_of_birth" className="form-control" required />
									</div>
									<div className="col-md-6">
										<label className="label-text">Gender</label>
										<select name="gender" className="form-select">
											<option value="">Select Gender</option>
											<option value="male">Male</option>
											<option value="female">Female</option>
											<option value="other">Other</option>
										</select>
									</div>
									<div className="col-md-6">
										<label className="label-text">Password *</label>
										<input name="password" type="password" className="form-control" required placeholder="Create a strong password" />
									</div>
								</div>
							</div>
						</div>
						
						{/* Address Information */}
						<div className="col-12">
							<div className="form-section">
								<h4 className="section-title">Address Information</h4>
								<div className="row g-3">
									<div className="col-12">
										<label className="label-text">Street Address *</label>
										<input name="address" className="form-control" required placeholder="123 Main Street" />
									</div>
									<div className="col-md-4">
										<label className="label-text">City *</label>
										<input name="city" className="form-control" required placeholder="New York" />
									</div>
									<div className="col-md-4">
										<label className="label-text">State/Province *</label>
										<input name="state" className="form-control" required placeholder="NY" />
									</div>
									<div className="col-md-4">
										<label className="label-text">ZIP/Postal Code *</label>
										<input name="zip_code" className="form-control" required placeholder="10001" />
									</div>
									<div className="col-md-6">
										<label className="label-text">Country *</label>
										<select name="country" className="form-select" required>
											<option value="">Select Country</option>
											<option value="US">United States</option>
											<option value="CA">Canada</option>
											<option value="PK">Pakistan</option>
											<option value="IN">India</option>
											<option value="UK">United Kingdom</option>
										</select>
									</div>
								</div>
							</div>
						</div>

						{/* Professional Information */}
						<div className="col-12">
							<div className="form-section">
								<h4 className="section-title">Professional Information</h4>
								<div className="row g-3">
									<div className="col-md-6">
										<label className="label-text">Driver's License Number *</label>
										<input name="license_number" className="form-control" required placeholder="D1234567890" />
									</div>
									<div className="col-md-6">
										<label className="label-text">License Expiry Date *</label>
										<input type="date" name="license_expiry" className="form-control" required />
									</div>
									<div className="col-md-6">
										<label className="label-text">License Class *</label>
										<select name="license_class" className="form-select" required>
											<option value="">Select License Class</option>
											<option value="Class A">Class A (Commercial)</option>
											<option value="Class B">Class B (Commercial)</option>
											<option value="Class C">Class C (Regular)</option>
											<option value="CDL">CDL (Commercial Driver's License)</option>
										</select>
									</div>
									<div className="col-md-6">
										<label className="label-text">Years of Driving Experience *</label>
										<select name="experience_years" className="form-select" required>
											<option value="">Select Experience</option>
											<option value="1">1-2 years</option>
											<option value="3">3-5 years</option>
											<option value="6">6-10 years</option>
											<option value="11">11-15 years</option>
											<option value="16">16+ years</option>
										</select>
									</div>
									<div className="col-md-6">
										<label className="label-text">Previous Company/Experience</label>
										<input name="previous_company" className="form-control" placeholder="Uber, Lyft, taxi company, etc." />
									</div>
									<div className="col-md-6">
										<label className="label-text">Do you have a Commercial License?</label>
										<div className="form-check-group">
											<div className="form-check form-check-inline">
												<input className="form-check-input" type="radio" name="commercial_license" value="yes" id="commercial_yes" />
												<label className="form-check-label" htmlFor="commercial_yes">Yes</label>
											</div>
											<div className="form-check form-check-inline">
												<input className="form-check-input" type="radio" name="commercial_license" value="no" id="commercial_no" />
												<label className="form-check-label" htmlFor="commercial_no">No</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Vehicle Information */}
						<div className="col-12">
							<div className="form-section">
								<h4 className="section-title">Vehicle Information</h4>
								<div className="row g-3">
									<div className="col-12">
										<label className="label-text">Do you have your own vehicle? *</label>
										<div className="form-check-group">
											<div className="form-check form-check-inline">
												<input className="form-check-input" type="radio" name="has_own_vehicle" value="yes" id="vehicle_yes" required />
												<label className="form-check-label" htmlFor="vehicle_yes">Yes, I have my own vehicle</label>
											</div>
											<div className="form-check form-check-inline">
												<input className="form-check-input" type="radio" name="has_own_vehicle" value="no" id="vehicle_no" required />
												<label className="form-check-label" htmlFor="vehicle_no">No, I will use company vehicles</label>
											</div>
										</div>
									</div>
									<div className="col-md-3">
										<label className="label-text">Vehicle Make</label>
										<input name="vehicle_make" className="form-control" placeholder="Toyota, Honda, etc." />
									</div>
									<div className="col-md-3">
										<label className="label-text">Vehicle Model</label>
										<input name="vehicle_model" className="form-control" placeholder="Camry, Accord, etc." />
									</div>
									<div className="col-md-3">
										<label className="label-text">Vehicle Year</label>
										<input type="number" name="vehicle_year" className="form-control" placeholder="2020" min="2000" max="2025" />
									</div>
									<div className="col-md-3">
										<label className="label-text">License Plate</label>
										<input name="vehicle_plate" className="form-control" placeholder="ABC-123" />
									</div>
									<div className="col-12">
										<label className="label-text">Vehicle Types (Select all that apply)</label>
										<div className="checkbox-group">
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="vehicle_types" value="sedan" id="sedan" />
												<label className="form-check-label" htmlFor="sedan">Sedan</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="vehicle_types" value="suv" id="suv" />
												<label className="form-check-label" htmlFor="suv">SUV</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="vehicle_types" value="hatchback" id="hatchback" />
												<label className="form-check-label" htmlFor="hatchback">Hatchback</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="vehicle_types" value="luxury" id="luxury" />
												<label className="form-check-label" htmlFor="luxury">Luxury Car</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="vehicle_types" value="van" id="van" />
												<label className="form-check-label" htmlFor="van">Van/Minivan</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="vehicle_types" value="truck" id="truck" />
												<label className="form-check-label" htmlFor="truck">Pickup Truck</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Services & Languages */}
						<div className="col-12">
							<div className="form-section">
								<h4 className="section-title">Services & Languages</h4>
								<div className="row g-3">
									<div className="col-md-6">
										<label className="label-text">Services Offered (Select all that apply)</label>
										<div className="checkbox-group">
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="services" value="airport_transfer" id="airport" />
												<label className="form-check-label" htmlFor="airport">Airport Transfer</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="services" value="city_tour" id="city_tour" />
												<label className="form-check-label" htmlFor="city_tour">City Tours</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="services" value="hourly_rental" id="hourly" />
												<label className="form-check-label" htmlFor="hourly">Hourly Rental</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="services" value="long_distance" id="long_distance" />
												<label className="form-check-label" htmlFor="long_distance">Long Distance Travel</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="services" value="business_travel" id="business" />
												<label className="form-check-label" htmlFor="business">Business Travel</label>
											</div>
										</div>
									</div>
									<div className="col-md-6">
										<label className="label-text">Languages Spoken (Select all that apply)</label>
										<div className="checkbox-group">
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="languages" value="english" id="english" />
												<label className="form-check-label" htmlFor="english">English</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="languages" value="spanish" id="spanish" />
												<label className="form-check-label" htmlFor="spanish">Spanish</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="languages" value="french" id="french" />
												<label className="form-check-label" htmlFor="french">French</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="languages" value="urdu" id="urdu" />
												<label className="form-check-label" htmlFor="urdu">Urdu</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="languages" value="arabic" id="arabic" />
												<label className="form-check-label" htmlFor="arabic">Arabic</label>
											</div>
											<div className="form-check">
												<input className="form-check-input" type="checkbox" name="languages" value="other" id="lang_other" />
												<label className="form-check-label" htmlFor="lang_other">Other</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Availability & Additional Info */}
						<div className="col-12">
							<div className="form-section">
								<h4 className="section-title">Availability & Additional Information</h4>
								<div className="row g-3">
									<div className="col-md-6">
										<label className="label-text">Available Hours *</label>
										<select name="availability_hours" className="form-select" required>
											<option value="">Select Availability</option>
											<option value="full_time">Full-time (40+ hours/week)</option>
											<option value="part_time">Part-time (20-39 hours/week)</option>
											<option value="weekends">Weekends only</option>
											<option value="evenings">Evenings only</option>
											<option value="flexible">Flexible</option>
										</select>
									</div>
									<div className="col-md-6">
										<label className="label-text">Preferred Areas to Drive</label>
										<input name="preferred_areas" className="form-control" placeholder="Downtown, Airport, Suburbs, etc." />
									</div>
									<div className="col-12">
										<label className="label-text">Tell us about yourself *</label>
										<textarea name="about" className="form-control" rows={4} required 
											placeholder="Share your driving experience, customer service skills, and what makes you a great driver..."></textarea>
									</div>
									<div className="col-12">
										<label className="label-text">Why do you want to join our platform? *</label>
										<textarea name="why_join" className="form-control" rows={3} required
											placeholder="Tell us your motivation and goals..."></textarea>
									</div>
								</div>
							</div>
						</div>

						{/* Emergency Contact */}
						<div className="col-12">
							<div className="form-section">
								<h4 className="section-title">Emergency Contact</h4>
								<div className="row g-3">
									<div className="col-md-6">
										<label className="label-text">Emergency Contact Name *</label>
										<input name="emergency_contact_name" className="form-control" required placeholder="John Doe" />
									</div>
									<div className="col-md-6">
										<label className="label-text">Emergency Contact Phone *</label>
										<input name="emergency_contact_phone" className="form-control" required placeholder="+1 (555) 123-4567" />
									</div>
								</div>
							</div>
						</div>

						{/* Agreements & Consent */}
						<div className="col-12">
							<div className="form-section">
								<h4 className="section-title">Agreements & Consent</h4>
								<div className="agreements-section">
									<div className="form-check agreement-check">
										<input className="form-check-input" type="checkbox" name="background_check_consent" value="yes" id="background_check" required />
										<label className="form-check-label" htmlFor="background_check">
											<strong>Background Check Consent *</strong><br />
											<small>I consent to a background check and understand that employment is contingent upon satisfactory results.</small>
										</label>
									</div>
									<div className="form-check agreement-check">
										<input className="form-check-input" type="checkbox" name="terms_accepted" value="yes" id="terms" required />
										<label className="form-check-label" htmlFor="terms">
											<strong>Terms & Conditions *</strong><br />
											<small>I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.</small>
										</label>
									</div>
									<div className="form-check agreement-check">
										<input className="form-check-input" type="checkbox" name="marketing_consent" value="yes" id="marketing" />
										<label className="form-check-label" htmlFor="marketing">
											<strong>Marketing Communications</strong><br />
											<small>I agree to receive promotional emails and updates about new opportunities.</small>
										</label>
									</div>
								</div>
							</div>
						</div>

						{/* Submit Button */}
						<div className="col-12">
							<div className="submit-section">
								<button 
									type="submit" 
									className="theme-btn btn-large"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<span className="spinner"></span>
											Submitting...
										</>
									) : (
										'Submit Driver Application'
									)}
								</button>
								<p className="submit-note">
									By submitting this application, you acknowledge that all information provided is accurate and complete.
								</p>
							</div>
						</div>

						{/* Status Messages */}
						{status && (
							<div className={`col-12 status-message ${status.type}`}>
								<div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
									{status.message}
								</div>
							</div>
						)}
					</form>
				</div>
			</section>
			
			{/* Custom Styles */}
			<style jsx>{`
				.form-section {
					background: #f8f9fa;
					border: 1px solid #e9ecef;
					border-radius: 10px;
					padding: 25px;
					margin-bottom: 20px;
				}
				.section-title {
					color: #2c3e50;
					font-size: 18px;
					font-weight: 600;
					margin-bottom: 20px;
					padding-bottom: 10px;
					border-bottom: 2px solid #3498db;
				}
				.checkbox-group {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
					gap: 10px;
				}
				.form-check-group {
					display: flex;
					gap: 20px;
					margin-top: 8px;
				}
				.agreement-check {
					padding: 15px;
					background: white;
					border: 1px solid #dee2e6;
					border-radius: 8px;
					margin-bottom: 15px;
				}
				.submit-section {
					text-align: center;
					padding: 30px 20px;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					border-radius: 15px;
					color: white;
				}
				.btn-large {
					padding: 15px 40px;
					font-size: 18px;
					font-weight: 600;
				}
				.submit-note {
					font-size: 14px;
					margin-top: 15px;
					opacity: 0.9;
				}
				.spinner {
					display: inline-block;
					width: 20px;
					height: 20px;
					border: 3px solid #f3f3f3;
					border-top: 3px solid #3498db;
					border-radius: 50%;
					animation: spin 2s linear infinite;
					margin-right: 10px;
				}
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
				.status-message {
					margin-top: 20px;
				}
				.alert {
					padding: 15px;
					border-radius: 8px;
					font-weight: 500;
				}
				.alert-success {
					background-color: #d4edda;
					border: 1px solid #c3e6cb;
					color: #155724;
				}
				.alert-danger {
					background-color: #f8d7da;
					border: 1px solid #f5c6cb;
					color: #721c24;
				}
			`}</style>
			
			<Footer />
		</>
	);
}


