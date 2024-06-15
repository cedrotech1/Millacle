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
          console.log(data.data);
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
  }, [id]);

  const handleView = (postId) => {
    navigate(`../onePost/${postId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!korari) {
    return <div>No korari details available</div>;
  }

  const { korari: korariDetails, allposts } = korari;
  const { event, blog, pic } = allposts;

  const handleDelete = async (userId) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this korari ?');
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
      console.error('Error deleting user:', error);
    }
  };

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
          <div className="row">
            <div className="col-lg-12">

              {/* <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Korari Information</h5>
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img src={korariDetails.file} className="img-fluid rounded-start" alt={korariDetails.name} />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{korariDetails.name}</h5>
                        <p className="card-text">
                          Admin: {korariDetails.KorariUser.firstname} {korariDetails.KorariUser.lastname}<br />
                          Email: {korariDetails.KorariUser.email}
                        </p>
                        <p className="card-text"><small className="text-muted">Created at: {new Date(korariDetails.createdAt).toLocaleString()}</small></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
               <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                 
                  {korariDetails && korariDetails.file!='null' ? (
                     <img src={korariDetails.file} alt="Korari Image" className="phone-1" style={{ width: '100%', paddingTop: '0.5cm', borderRadius: '1%' }} />
                  ) : (
                    <img src='../assets/img/nopic.png' alt="Korari Image" className="phone-1" style={{ width: '100%', paddingTop: '0.5cm', borderRadius: '1%' }} />
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
                  <br/>
                  <h5>Chair Admin</h5>
                  <p><strong>Names:</strong> {korariDetails.KorariUser.firstname} {korariDetails.KorariUser.lastname}</p>
                  <p><strong>Email:</strong> {korariDetails.KorariUser.email}</p>

                  <button className='btn btn-outline-danger' onClick={() => handleDelete(korariDetails.id)}>Delete Korari</button>


                </div>
              </div>
            </div>
          </div>
          <br/>

              {event.length > 0 ? (
                <div className="card mb-3">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">Associated Events</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Date & Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <LoadingSpinner />
                        ) : (
                          event.map((e) => (
                            <tr key={e.id}>
                              <td>{e.id}</td>
                              <td>{e.title}</td>
                              <td>{`${e.date} ${e.time}`}</td>
                              <td>
                                <button className='btn btn-outline-primary' onClick={() => handleView(e.id)}>View</button>
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
                  {/* No Events available */}
                  </center>
              )}
  <br/>
              {blog.length > 0 ? (
                <div className="card mb-3">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">Associated Blogs</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Date & Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <LoadingSpinner />
                        ) : (
                          blog.map((b) => (
                            <tr key={b.id}>
                              <td>{b.id}</td>
                              <td>{b.title}</td>
                              <td>{`${b.date} ${b.time}`}</td>
                              <td>
                                <button className='btn btn-outline-primary' onClick={() => handleView(b.id)}>View</button>
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
                  {/* No Blogs available */}
                  </center>
              )}
  <br/>
              {pic.length > 0 ? (
                <div className="card mb-3">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">Associated Pics</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>picture</th>
                          <th>Date & Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <LoadingSpinner />
                        ) : (
                          pic.map((p) => (
                            <tr key={p.id}>
                              <td>{p.id}</td>
                              <td>
                              <img src={p.file} alt="Image" class="phone-1" data-aos="fade-right" style={{ height: '1.5cm', width: '1.5cm', borderRadius: '10%' }} />
                                </td>
                              <td>{`${p.date} ${p.time}`}</td>
                              <td>
                                <button className='btn btn-outline-primary' onClick={() => handleView(p.id)}>View</button>
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
                  {/* No Pics available */}
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

export default OneChair;
