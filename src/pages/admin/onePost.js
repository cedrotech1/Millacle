import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/loading';

function Home() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editLoading, setEditLoading] = useState(false);
  const [formType, setFormType] = useState('');
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    file: null,
  });

  useEffect(() => {
    if (isNaN(id)) {
      navigate('/');
    }
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Posts/one/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setPost(data.data);
          setFormData({
            title: data.data.title,
            description: data.data.description,
            date: data.data.date,
            time: data.data.time,
            file: null,
          });
        } else {
          console.error('Failed to fetch post:', data.message);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleDelete = async (postId) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this post?');
      if (!isConfirmed) {
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Posts/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('../event');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('../event');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Posts/update/${id}`, {
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
        setPost((prevKorari) => ({
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

  return (
    <>
    {post.length > 0 ? (<>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Post Details</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">Post Details</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  {post.length > 0 && (
                    post[0].file !== 'null' ? (
                      <img
                        src={post[0].file}
                        alt="Post Image"
                        className="phone-1"
                        style={{ width: '100%', paddingTop: '0.5cm', borderRadius: '1%' }}
                      />
                    ) : (
                      <img
                        src='../assets/img/nopic.png'
                        alt="Post Image"
                        className="phone-1"
                        style={{ width: '100%', paddingTop: '0.5cm', borderRadius: '1%' }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Post Information</h5>
                  {post.length > 0 && (
                    <>
                    {
                      post[0].type=='pic'? 
                      <></>
                      :<>
                        <p><strong>Title:</strong> {post[0].title}</p>
                        <p><strong>Description:</strong> {post[0].description}</p></>

                    }
                    
                      <p><strong>Date:</strong> {post[0].date}, {post[0].time}</p>

                      {post[0].PostsUser && (
                        <>
                          <h5>Posted By</h5>
                          <p><strong>Names:</strong> {post[0].PostsUser.firstname} {post[0].PostsUser.lastname}</p>
                          <p><strong>Email:</strong> {post[0].PostsUser.email}</p>
                          <button className="btn btn-outline-danger m-2" onClick={() => handleDelete(post[0].id)}>Delete Post</button>
                          <button className="btn btn-outline-primary" disabled data-bs-toggle="modal" data-bs-target="#disablebackdrop">Edit Post</button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
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
                          <button type="submit"  className={`btn btn-primary d-block ${editLoading ? 'loading' : ''}`} disabled={true}>
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
      </>
    ) : (
                <center>

                </center>
              )}
    </>
    );
}

export default Home;
