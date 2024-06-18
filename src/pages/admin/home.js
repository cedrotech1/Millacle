import React, { useState, useEffect } from 'react';

function Home() {
  const [statistics, setStatistics] = useState({
    churchPosts: 0,
    korariPosts: 0,
    church: {
      pic: 0,
      event: 0,
      blog: 0
    },
    korari: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/v1/Korari/statistic', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setStatistics(data.data);
        } else {
          console.error('Failed to fetch statistics:', data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Blank Page</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item">Pages</li>
            <li className="breadcrumb-item active">Home</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Number of Church Posts</h5>
                <h6 className='text-center' style={{fontSize:'1.5cm',fontFamily:'monospace',marginTop:'-0.5cm'}}>{statistics.churchPosts}</h6>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Number of Korari Posts</h5>
               
                <h6 className='text-center text-center' style={{fontSize:'1.5cm',fontFamily:'monospace',marginTop:'-0.5cm'}}>{statistics.korariPosts}</h6>
                
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Number of Church Pictures</h5>
                <h6 className='text-center' style={{fontSize:'1.5cm',fontFamily:'monospace',marginTop:'-0.5cm'}}>{statistics.church.pic}</h6>
                {/* <p>{statistics.church.pic}</p> */}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Number of Church Events</h5>
                <h6 className='text-center' style={{fontSize:'1.5cm',fontFamily:'monospace',marginTop:'-0.5cm'}}>{statistics.church.event}</h6>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Number of Church Blogs</h5>
                <p></p>
                <div class="ps-3">
                      <h6 className='text-center' style={{fontSize:'1.5cm',fontFamily:'monospace',marginTop:'-0.5cm'}}>{statistics.church.blog}</h6>
                    </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Number of Korari</h5>
                <h6 className='text-center' style={{fontSize:'1.5cm',fontFamily:'monospace',marginTop:'-0.5cm'}}>{statistics.korari}</h6>
               
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">Number of Users</h5>
                <p></p>
                <h6 className='text-center'  style={{fontSize:'1.5cm',fontFamily:'monospace',marginTop:'-0.5cm'}}>{statistics.users}</h6>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
