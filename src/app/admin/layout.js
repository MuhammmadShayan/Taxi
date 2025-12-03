export const metadata = {
	title: 'Admin - KiraStay',
	description: 'Admin dashboard',
};

export default function AdminLayout({ children }) {
	return (
		<div className="admin-layout">
			<div className="" >
				
				{children}
			</div>
		</div>
	);
}



