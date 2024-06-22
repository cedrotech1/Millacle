
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';


import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';
function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleSidebar = () => {
    setShowMenu(!showMenu);
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


  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    let userId; // Declare userId variable outside try-catch to widen its scope
  
    if (userString) {
      try {
        const user = JSON.parse(userString);
        userId = user.id; // Assign userId inside try block
        console.log('User ID:', userId);
      } catch (error) {
        console.error('Error parsing user object:', error);
      }
    } else {
      console.error('User object not found in local storage');
      setLoadingUpdate(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setFormData({
            firstname: data.user.firstname,
            lastname: data.user.lastname,
            phone: data.user.phone || ''
          });
        } else {
          console.error('Failed to fetch user:', data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);






  return (
    <>
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <a href="/" className="logo d-flex align-items-center">
            {/* <img src="assets/img/logo.png" alt=""/> */}
            <span className="d-none d-lg-block">Millacle</span>
          </a>
          <i className="bi bi-list toggle-sidebar-btn" onClick={handleToggleSidebar}></i>
        </div>

        <div className="search-bar">
        
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item d-block d-lg-none">
              <a className="nav-link nav-icon search-bar-toggle" href="#">

              </a>
            </li>

     

     

            <li className="nav-item dropdown pe-1">
  <a className="nav-link nav-profile d-flex align-items-center pe-0" href="../profile">
    {loading ? (
      <div>Loading...</div>
    ) : (
      user && (
        <>
          <img src={user.file || 'assets/img/v.jpg'} alt="Profile" className="rounded-circle" style={{ height: '1.2cm', width: '1.2cm' }} />
          <span className="ps-2 d-md-inline d-none">{user.firstname}</span>
        </>
      )
    )}
  </a>
</li>

          </ul>
        </nav>
      </header>

      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <a href="/">
              {/* <img src="assets/img/logo.png" alt="" className="img-fluid" /> */}
            </a>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        {/* <aside id="sidebar" className="sidebar"> */}
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <a className="nav-link collapsed" href="/">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
        </li>
        {role === 'superadmin' && (
          <React.Fragment>
       
            <li className="nav-item">
              <a className="nav-link collapsed" href="../users">
                <i className="bi bi-person"></i>
                <span>Manage Users</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed" href="../event">
                <i className="bi bi-journal-text"></i>
                <span>Manage Posts</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link collapsed" href="../gives">
              <i class="bi bi-dash-circle"></i>
                <span>Manage Amaturo</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link collapsed" href="../chair">
                <i className="bi bi-journal-text"></i>
                <span>Manage korari</span>
              </a>
            </li>

            <li className="nav-item">
          <a className="nav-link collapsed" href="../profile">
            <i className="bi bi-gear"></i>
            <span>Settings</span>
          </a>
        </li>
           
          </React.Fragment>
        )}

{role === 'user' && (
          <React.Fragment>
            <li className="nav-item">
              <a className="nav-link collapsed" href="../profile">
                <i className="bi bi-person-circle"></i>
                <span>Profile</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link collapsed" href="../users">
                <i className="bi bi-person"></i>
                <span>Manage Users</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed" href="../event">
                <i className="bi bi-journal-text"></i>
                <span>Manage Posts</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link collapsed" href="../chair">
                <i className="bi bi-journal-text"></i>
                <span>Manage korari</span>
              </a>
            </li>
          
          </React.Fragment>
        )}

  

        <li className="nav-item">
          <a className="nav-link collapsed" href="../logout">
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </a>
        </li>
        </ul>
    {/* </aside> */}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Header;
