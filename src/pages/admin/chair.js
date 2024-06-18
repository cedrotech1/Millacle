import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/loading';

function Home() {
  const [formType, setFormType] = useState('');
  const [formData, setFormData] = useState({
    file: null,
    name: '',
    admin: '',
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users?role=user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUsers(data.users);
        } else {
          console.error('Failed to fetch users:', data.message);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({
        ...formData,
        file: e.target.files[0] // assuming only one file is uploaded
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
    setFormType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.admin) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.file);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('admin', formData.admin); // Assuming formData.admin holds the selected admin ID

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Korari/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        // Clear form data after successful submission
        setFormData({
          file: null,
          name: '',
          admin: '', // Reset admin selection or set default as needed
        });
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate(`../event`);
      }
    } catch (error) {
      console.error('Error creating Chair', error);
      toast.error('Failed to create Chair. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const [korari, setkorari] = useState([]);

  useEffect(() => {
    const fetchclaims = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Korari/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setkorari(data.data);
          console.log(data.data);
        } else {
          console.error('Failed to fetch claims:', data.message);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching claims:', error);
        setLoading(false);
      }
    };

    fetchclaims();
  }, []);

  const handleView = (id) => {
    navigate(`../oneChair/${id}`);
  };

  const [role, setRole] = useState(null); // Initialize role state

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setRole(user.role); // Set role state based on user object
      } catch (error) {
        console.error('Error parsing user object:', error);
      }
    } else {
      console.error('User object not found in local storage');
    }
  }, []);
  console.log(formData);

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Blank Page</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">Chairs</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className='col-md-4'></div>
            <div className='col-md-4'></div>
            <div className='col-md-4'>
              
              {role === 'superadmin' && (
                <button type="button" className="btn btn-primary col-md-12" data-bs-toggle="modal" data-bs-target="#disablebackdrop">
                  Add Chair
                </button>
              )}
           
            </div>

            <div className="modal fade" id="disablebackdrop" tabIndex="-1" data-bs-backdrop="false">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">ADD Chair</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="card">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-sm-12">
                              <br/>
                              <div className="form-floating mb-3">
                                <input type="text" name='name' className="form-control" id="floatingTitle" placeholder="name" value={formData.name} onChange={handleChange} />
                                <label htmlFor="floatingTitle">Name</label>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="file" className="form-control" id="floatingFile" name='file' onChange={handleChange} />
                                <label htmlFor="floatingFile">Upload Image</label>
                              </div>
                            </div>
                          </div>
                          <div className="form-floating mb-3">
                            <select className="form-select" name="admin" value={formData.admin} onChange={handleChange}>
                              <option value="" disabled>Select Admin</option>
                              {users.map(user => (
                                <option key={user.id} value={user.id}>{`${user.firstname} ${user.lastname}`}</option>
                              ))}
                            </select>
                            <label htmlFor="floatingAdmin">Select Admin</label>
                          </div>

                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className={`btn btn-primary d-block ${loading ? 'loading' : ''}`} disabled={loading}>
                              {loading ? 'Loading...' : 'Save'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <br />

              {korari.length > 0 ? (
                <div className="card">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">List of Chairs</h5>
                    <table className="table datatable">
                      <thead>
                        <tr>
                          <th><b>No</b></th>
                          <th>Name</th>
                          <th>Image</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <LoadingSpinner />
                        ) : (
                          korari.map((Chair) => (
                            <tr key={Chair.id}>
                              <td>{Chair.id}</td>
                              <td>{Chair.name}</td>
                              <td>
                                {Chair && Chair.file !== 'null' ? (
                                  <img src={Chair.file} alt="Image" className="phone-1" data-aos="fade-right" style={{ height: '1.5cm', width: '1.5cm', borderRadius: '10%' }} />
                                ) : (
                                  <img src='../assets/img/nopic.png' alt="Image" className="phone-1" data-aos="fade-right" style={{ height: '1.5cm', width: '1.5cm', borderRadius: '10%' }} />
                                )}
                              </td>
                              <td>
                                <button className='btn btn-outline-primary' onClick={() => handleView(Chair.id)}>View</button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <center>
                  No Chairs found.
                </center>
              )}
            </div>
          </div>
        </section>

        <ToastContainer />
      </main>
    </>
  );
}

export default Home;
