import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/loading';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [post, setpost] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
 

  useEffect(() => {
    if (isNaN(id)) {
      navigate('/');
    }
    const fetchclaims = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Posts/one/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setpost(data.data);
          console.log(data.data)
        } else {
          console.error('Failed to fetch posts:', data.message);
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

  const handleDelete = async (pid) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this post?');
      if (!isConfirmed) {
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/Posts/delete/${pid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await navigate('../event');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error deleting claim:', error);
    }
  };
  
  const handleUpdate = (id) => {
    navigate(`../onePost/${id}`);
  };

  return (
   <>
 <main id="main" class="main">

<div class="pagetitle">
  <h1>Blank Page</h1>
  <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/">Home</a></li>
      <li class="breadcrumb-item">Pages</li>
      <li class="breadcrumb-item active">Blank</li>
    </ol>
  </nav>
</div>

<section class="section">
  <div class="row">
    <div class="col-lg-6">

      <div class="card">
        <div class="card-body">
        {post.length > 0 && (
  post[0].file !== 'null' ? (
    <img src={post[0].file} alt="Korari Image" className="phone-1" style={{ width: '100%', paddingTop: '0.5cm', borderRadius: '1%' }} />
  ) : (
    <img src='../assets/img/nopic.png' alt="Korari Image" className="phone-1" style={{ width: '100%', paddingTop: '0.5cm', borderRadius: '1%' }} />
  )
)}

        </div>
      </div>

    </div>

    <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Post Details</h5>
            {post.length > 0 && (
              <>

          {post[0].type!=='pic' && (
                  <>
                   <p><strong>Title:</strong> {post[0].title}</p>
                <p><strong>Description</strong> {post[0].description}</p>
                  </>
                )}
              
                <p><strong>Date:</strong> {post[0].date}, {post[0].time}</p>
           
                {post[0].PostsUser && (
                  <>
                  <h5>POSTED BY</h5>
                    <p><strong>Names:</strong> {post[0].PostsUser.firstname} {post[0].PostsUser.lastname}</p>
                    <p><strong>Email:</strong> {post[0].PostsUser.email}</p> 
                    <button className='btn btn-outline-danger m-2' onClick={() => handleDelete(post[0].id)}>delete a post</button>
                    <button className='btn btn-outline-success' onClick={() => handleUpdate(post[0].id)}>edit a post</button>
                  </>
                 
                )}
              </>
              
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
  <ToastContainer />
</main>
   </>
  );
}

export default Home;
