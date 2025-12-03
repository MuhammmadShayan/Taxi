'use client';

import DriverSidebar from './components/DriverSidebar';
import AgencyHeader from './components/AgencyHeader';

export default function DriverLayout({ children }) {
	return (
		<div className="section-bg">
			{/* User Canvas Menu */}
			<div className="user-canvas-container">
				<div className="side-menu-close">
					<i className="la la-times"></i>
				</div>
				{/* Tabs UI retained for consistency; content can be wired similarly if needed */}
				<div className="user-canvas-nav">
					<div className="section-tab section-tab-2 text-center pt-4 pb-3 ps-4">
						<ul className="nav nav-tabs" id="driverTab" role="tablist">
							<li className="nav-item"><a className="nav-link active" id="driver-notification-tab" href="#driver-notification" role="tab" aria-selected="true">Notifications</a></li>
							<li className="nav-item"><a className="nav-link" id="driver-message-tab" href="#driver-message" role="tab" aria-selected="false">Messages</a></li>
							<li className="nav-item"><a className="nav-link" id="driver-account-tab" href="#driver-account" role="tab" aria-selected="false">Account</a></li>
						</ul>
					</div>
				</div>
			</div>

			{/* Sidebar Navigation */}
			<DriverSidebar />

			{/* Dashboard Area */}
			<section className="dashboard-area">
				<AgencyHeader basePath="driver" userName="Driver" />
				{children}
			</section>

			{/* Back to top */}
			<div id="back-to-top">
				<i className="la la-angle-up" title="Go top"></i>
			</div>
		</div>
	);
}
}


