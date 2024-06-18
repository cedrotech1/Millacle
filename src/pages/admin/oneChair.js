import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/loading';

function OneChair() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [korari, setKorari] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', file: null });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchKorari = async () => {
      try {
        if (isNaN(id)) {
          navigate('/');
        }
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Korari/one/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setKorari(data.data);
          setFormData({ name: data.data.korari.name, file: null });
        } else {
          toast.error('Failed to fetch korari details');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching korari details:', error);
        toast.error('Error fetching korari details');
        setLoading(false);
      }
    };

    fetchKorari();
  }, [id, navigate]);

  const handleView = (postId) => {
    navigate(`../onePost/${postId}`);
  };

  const handleDelete = async (userId) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this korari?');
      if (!isConfirmed) {
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Korari/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('/chair');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error deleting korari:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    const form = new FormData();
    form.append('name', formData.name);
    if (formData.file) {
      form.append('file', formData.file);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Korari/update/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Korari updated successfully');
        await navigate('../chair');
        setKorari((prevKorari) => ({
          ...prevKorari,
          korari: {
            ...prevKorari.korari,
            name: formData.name,
            file: result.data.file || prevKorari.korari.file,
          },
          
        }));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error updating korari:', error);
      toast.error('Error updating korari');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!korari) {
    return <div>No korari details available</div>;
  }

  const { korari: korariDetails, allposts } = korari;
  const { event, blog, pic } = allposts;

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Korari Details</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">Korari Details</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="modal fade" id="disablebackdrop" tabIndex="-1" data-bs-backdrop="false">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">EDIT KORARI</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-sm-12">
                            <br />
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                name="name"
                                className="form-control"
                                id="floatingTitle"
                                placeholder="name"
                                value={formData.name}
                                onChange={handleChange}
                              />
                              <label htmlFor="floatingTitle">Name</label>
                            </div>
                            <div className="form-floating mb-3">
                              <input
                                type="file"
                                className="form-control"
                                id="floatingFile"
                                name="file"
                                onChange={handleChange}
                              />
                              <label htmlFor="floatingFile">Upload Image</label>
                            </div>
                          </div>
                        </div>

                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="submit" className={`btn btn-primary d-block ${editLoading ? 'loading' : ''}`} disabled={editLoading}>
                            {editLoading ? 'Loading...' : 'Save'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-6">
                  <div className="card">
                    <div className="card-body">
                    {korariDetails && korariDetails.file && korariDetails.file !== 'null' ? (
                        <img
                          src={korariDetails.file}
                          alt="Korari Image"
                          className="phone-1"
                          style={{ width: '100%', paddingTop: '0.5cm', borderRadius: '1%' }}
                        />
                      ) : (
                        <img
                          src="../assets/img/nopic.png"
                          alt="Korari Image"
                          className="phone-1"
                          style={{ width: '100%', paddingTop: '0.5cm', borderRadius: '1%' }}
                        />
                      )}

                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Korari Information</h5>
                      <p><strong>Name:</strong> {korariDetails.name}</p>
                      <p><strong>Created At:</strong> {new Date(korariDetails.createdAt).toLocaleString()}</p>
                      <br />
                      <h5>Chair Admin</h5>
                      {/* <p><strong>Names:</strong> {korariDetails.KorariUser.firstname} {korariDetails.KorariUser.lastname}</p>
                      <p><strong>Email:</strong> {korariDetails.KorariUser.email}</p> */}
                      <button className="btn btn-outline-danger" onClick={() => handleDelete(korariDetails.id)}>Delete Korari</button>
                     &nbsp; <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#disablebackdrop">Edit Korari</button>
                    </div>
                  </div>
                </div>
              </div>
              <br />

              {event.length > 0 ? (
                <div className="card mb-3">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">Associated Events</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Created At</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.map((post) => (
                          <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{new Date(post.startdate).toLocaleString()}</td>
                            <td>{new Date(post.enddate).toLocaleString()}</td>
                            <td>{new Date(post.createdAt).toLocaleString()}</td>
                            <td>
                              <button className="btn btn-outline-primary" onClick={() => handleView(post.id)}>
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p>
                  {/* No associated events found. */}
                  </p>
              )}

              {blog.length > 0 ? (
                <div className="card mb-3">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">Associated Blogs</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Created At</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blog.map((post) => (
                          <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{new Date(post.createdAt).toLocaleString()}</td>
                            <td>
                              <button className="btn btn-outline-primary" onClick={() => handleView(post.id)}>
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p></p>
              )}

              {pic.length > 0 ? (
                <div className="card mb-3">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">Associated Pics</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Created At</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pic.map((post) => (
                          <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{new Date(post.createdAt).toLocaleString()}</td>
                            <td>
                              <button className="btn btn-outline-primary" onClick={() => handleView(post.id)}>
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </section>
      </main>

      <ToastContainer />
    </>
  );
}

export default OneChair;
