'use client';

import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function AdminContentDashboard() {
  const contentSections = [
    {
      title: 'Team Members',
      description: 'Manage team member profiles, positions, and social links',
      href: '/admin/content/team-members',
      icon: 'la la-users',
      color: 'primary'
    },
    {
      title: 'About Sections',
      description: 'Manage about page content sections and company information',
      href: '/admin/content/about-sections',
      icon: 'la la-info-circle',
      color: 'success'
    },
    {
      title: 'Destinations',
      description: 'Manage featured destinations and travel locations',
      href: '/admin/content/destinations',
      icon: 'la la-map-marker',
      color: 'info'
    },
    {
      title: 'Site Statistics',
      description: 'Manage homepage statistics and fun facts',
      href: '/admin/content/statistics',
      icon: 'la la-chart-bar',
      color: 'warning'
    },
    {
      title: 'FAQ Items',
      description: 'Manage frequently asked questions and answers',
      href: '/admin/content/faq',
      icon: 'la la-question-circle',
      color: 'secondary'
    },
    {
      title: 'Site Settings',
      description: 'Manage global site settings and configuration',
      href: '/admin/content/settings',
      icon: 'la la-cog',
      color: 'dark'
    }
  ];

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Content Management</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <p className="text-muted">
                  Manage all dynamic content on your website. Click on any section below to start editing.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {contentSections.map((section, index) => (
            <div key={index} className="col-md-6 col-xl-4 mb-4">
              <Link href={section.href} className="text-decoration-none">
                <div className="card h-100 card-hover">
                  <div className="card-body">
                    <div className="d-flex align-items-start">
                      <div className={`avatar-sm bg-${section.color} bg-soft rounded-circle flex-shrink-0 me-3`}>
                        <span className={`avatar-title bg-${section.color} text-white rounded-circle`}>
                          <i className={section.icon}></i>
                        </span>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="card-title mb-1">{section.title}</h5>
                        <p className="card-text text-muted small mb-0">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <div className="text-end">
                      <span className={`btn btn-sm btn-${section.color}`}>
                        Manage <i className="la la-arrow-right ms-1"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Link href="/admin/content/team-members" className="btn btn-outline-primary w-100">
                      <i className="la la-plus me-2"></i>
                      Add Team Member
                    </Link>
                  </div>
                  <div className="col-md-4 mb-3">
                    <Link href="/admin/content/destinations" className="btn btn-outline-info w-100">
                      <i className="la la-plus me-2"></i>
                      Add Destination
                    </Link>
                  </div>
                  <div className="col-md-4 mb-3">
                    <Link href="/admin/content/faq" className="btn btn-outline-secondary w-100">
                      <i className="la la-plus me-2"></i>
                      Add FAQ Item
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h6 className="mb-1">Database Migration Required?</h6>
                    <p className="text-muted mb-0 small">
                      If you haven't run the database migration yet, you'll need to set up the dynamic content tables first.
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <button className="btn btn-warning btn-sm" onClick={() => {
                      alert('Run the following command in your project directory:\nnode scripts/setup-dynamic-content.js');
                    }}>
                      <i className="la la-database me-2"></i>
                      Migration Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .bg-soft {
          opacity: 0.1;
        }
        .avatar-sm {
          width: 2.25rem;
          height: 2.25rem;
        }
        .avatar-title {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }
      `}</style>
    </AdminLayout>
  );
}

