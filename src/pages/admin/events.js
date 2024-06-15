import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/loading';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [formType, setFormType] = useState('');
  const [formData, setFormData] = useState({
    file: null,
    title: '',
    description: '',
    type: ''
  });
  const [loading, setLoading] = useState(false);


  const token = localStorage.getItem('token');
  const navigate = useNavigate();

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

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.file);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Posts/add`, {
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
          title: '',
          description: '',
          type: ''
        });
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate(`../event`);
      }
    } catch (error) {
      console.error('Error creating post', error);
      toast.error('Failed to create post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  const [events, setevents] = useState([]);
  const [blogs, setblogs] = useState([]);
  const [pics, setpics] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchclaims = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Posts/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setevents(data.data);
          // console.log(data.data)
        } else {
          console.error('Failed to fetch claims:', data.message);
        }

        // Set loading to false after fetching data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching claims:', error);
        // Set loading to false in case of an error
        setLoading(false);
      }
    };

    fetchclaims();
  }, []);

  useEffect(() => {
    const fetchclaims = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Posts/pics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setpics(data.data);
          // console.log(data.data)
        } else {
          console.error('Failed to fetch claims:', data.message);
        }

        // Set loading to false after fetching data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching claims:', error);
        // Set loading to false in case of an error
        setLoading(false);
      }
    };

    fetchclaims();
  }, []);


  useEffect(() => {
    const fetchclaims = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Posts/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setblogs(data.data);
          // console.log(data.data)
        } else {
          console.error('Failed to fetch claims:', data.message);
        }

        // Set loading to false after fetching data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching claims:', error);
        // Set loading to false in case of an error
        setLoading(false);
      }
    };

    fetchclaims();
  }, []);

  const handleView = (id) => {
    navigate(`../onePost/${id}`);
  };


  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Blank Page</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">posts</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className='col-md-4'> {/* Placeholder for content */} </div>
            <div className='col-md-4'> {/* Placeholder for content */} </div>
            <div className='col-md-4'>
              <button type="button" className="btn btn-primary col-md-12" data-bs-toggle="modal" data-bs-target="#disablebackdrop">
                Add Post
              </button>
            </div>

            {/* Modal Structure */}
            <div className="modal fade" id="disablebackdrop" tabIndex="-1" data-bs-backdrop="false">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">ADD POST</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="card">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-sm-12">
                              <br />
                              {formType !== 'pic' && (
                                <>
                                  <div className="form-floating mb-3">
                                    <input type="text" name='title' className="form-control" id="floatingTitle" placeholder="Title" value={formData.title} onChange={handleChange} />
                                    <label htmlFor="floatingTitle">Title</label>
                                  </div>
                                  <div className="form-floating mb-3">
                                    <textarea className="form-control" name='description' placeholder="Description" id="floatingDescription" value={formData.description} onChange={handleChange}></textarea>
                                    <label htmlFor="floatingDescription">Description</label>
                                  </div>
                                </>
                              )}
                              <div className="form-floating mb-3">
                                <select className="form-select" id="floatingType" name='type' aria-label="Floating label select example" value={formData.type} onChange={handleChange}>
                                  <option value="">Select Type</option>
                                  <option value="event">Event</option>
                                  <option value="blog">Blog</option>
                                  <option value="pic">Pic</option>
                                </select>
                                <label htmlFor="floatingType">Type</label>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="file" className="form-control" id="floatingFile" name='file' onChange={handleChange} />
                                <label htmlFor="floatingFile">Upload Image</label>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className={`btn btn-primary d-block  ${loading ? 'loading' : ''}`} disabled={loading}>
                              {loading ? 'loading....' : 'save'}</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Modal */}

          </div>
        </section>

        <section className="section">
        <div class="row">
              <div class="col-lg-12">
          <br/>
                <div class="card" style={{padding:'0.5cm'}}>
                  <div class="card-body">
                    <h5 class="card-title" >
                      <center>
                     millacle church posts
                      </center>
                      </h5>
                    <p></p>
                  </div>
                </div>
          
              </div>
          
            
            </div>
          <div className="row">
            <div className="col-lg-12">
              <br />

              {events.length > 0 ? (
                <div className="card">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">List of event posts</h5>
                    <table className="table datatable">
                      <thead>
                        <tr>
                          <th><b>no</b></th>
                          <th>Title</th>
                          <th data-type="date" data-format="YYYY/DD/MM">dates/time</th>  </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <LoadingSpinner />
                        ) : (
                          events.map((post) => (
                            <tr key={post.id}>
                              <td>{post.id}</td>  <td>{post.title}</td><td> {post.date} &nbsp; {post.time}</td>
                              <td>
                                <button className='btn btn-outline-primary' onClick={() => handleView(post.id)}>view</button>
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

                </center>
              )}
              {blogs.length > 0 ? (
                <div className="card">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">List of blog posts</h5>
                    <table className="table datatable">
                      <thead>
                        <tr>
                          <th><b>no</b></th>
                          <th>Title</th>
                          <th data-type="date" data-format="YYYY/DD/MM">dates/time</th>  </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <LoadingSpinner />
                        ) : (
                          blogs.map((post) => (
                            <tr key={post.id}>
                              <td>{post.id}</td>  <td>{post.title}</td><td> {post.date} &nbsp; {post.time}</td>
                              <td>
                                <button className='btn btn-outline-primary' onClick={() => handleView(post.id)}>view</button>
                              </td>
                            </tr>
                          ))
                        )}


                      </tbody>
                    </table>
                  </div>
                </div>

              ) : (<center></center>)}
              {pics.length > 0 ? (
                <div className="card">
                  <div className="card-body table-responsive">
                    <h5 className="card-title">List of pictures posts</h5>
                    <table className="table datatable">
                      <thead>
                        <tr>
                          <th><b>no</b></th>
                          <th>pictues</th>
                          <th data-type="date" data-format="YYYY/DD/MM">dates/time</th>  </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <LoadingSpinner />
                        ) : (
                          pics.map((post) => (
                            <tr key={post.id}>
                              <td>{post.id}</td>
                              <td>
                                <img src={post.file} alt="Image" class="phone-1" data-aos="fade-right" style={{ height: '1.5cm', width: '1.5cm', borderRadius: '10%' }} />
                              </td>
                              <td> {post.date} &nbsp; {post.time}</td>
                              <td>
                                <button className='btn btn-outline-primary' onClick={() => handleView(post.id)}>view</button>
                              </td>
                            </tr>
                          ))
                        )}


                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (<center></center>)}




            </div>
          </div>
        </section>

        <ToastContainer />
      </main>
    </>
  );
}

export default Home;
