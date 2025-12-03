'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminTeamMembers() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    description: '',
    image: '',
    email: '',
    phone: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_linkedin: '',
    sort_order: 0
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team-members');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const method = editingMember ? 'PUT' : 'POST';
      const url = editingMember ? `/api/team-members/${editingMember.id}` : '/api/team-members';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTeamMembers();
        resetForm();
        alert(editingMember ? 'Team member updated successfully!' : 'Team member created successfully!');
      } else {
        alert('Error saving team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Error saving team member');
    }
  };

  const handleEdit = (member) => {
    setFormData(member);
    setEditingMember(member);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      description: '',
      image: '',
      email: '',
      phone: '',
      social_facebook: '',
      social_twitter: '',
      social_instagram: '',
      social_linkedin: '',
      sort_order: 0
    });
    setEditingMember(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Team Members Management</h4>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cancel' : 'Add New Member'}
                </button>
              </div>

              {showForm && (
                <div className="card-body border-bottom">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Position *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Image URL</label>
                        <input
                          type="url"
                          className="form-control"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Sort Order</label>
                        <input
                          type="number"
                          className="form-control"
                          name="sort_order"
                          value={formData.sort_order}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Facebook URL</label>
                        <input
                          type="url"
                          className="form-control"
                          name="social_facebook"
                          value={formData.social_facebook}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Twitter URL</label>
                        <input
                          type="url"
                          className="form-control"
                          name="social_twitter"
                          value={formData.social_twitter}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Instagram URL</label>
                        <input
                          type="url"
                          className="form-control"
                          name="social_instagram"
                          value={formData.social_instagram}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">LinkedIn URL</label>
                        <input
                          type="url"
                          className="form-control"
                          name="social_linkedin"
                          value={formData.social_linkedin}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-success me-2">
                      {editingMember ? 'Update' : 'Create'} Team Member
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Email</th>
                        <th>Sort Order</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member) => (
                        <tr key={member.id}>
                          <td>
                            {member.image && (
                              <img 
                                src={member.image} 
                                alt={member.name}
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                className="rounded"
                              />
                            )}
                          </td>
                          <td>{member.name}</td>
                          <td>{member.position}</td>
                          <td>{member.email}</td>
                          <td>{member.sort_order}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => handleEdit(member)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

