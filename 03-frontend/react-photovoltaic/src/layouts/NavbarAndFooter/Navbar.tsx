import { Link, NavLink } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";

export const Navbar = () => {

  const { oktaAuth, authState } = useOktaAuth();

  const [show, setShow] = useState(false);

  const [lastLogintime, setLastLoginTime] = useState('');


  if (!authState) {
    return <SpinnerLoading />
  }

  const handleLogout = () => oktaAuth.signOut();

  const showUserProfile = () => {
    setShow(true);


    let unix_timestamp = authState.idToken?.claims.auth_time!;
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    setLastLoginTime(formattedTime);
  }

  const closeUserProfile = () => setShow(false);



  console.log(authState);

  return (
    <>

      <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
        <div className='container-fluid'>
          <span className='navbar-brand'>Photovoltaic System</span>
          <button className='navbar-toggler' type='button'
            data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
            aria-controls='navbarNavDropdown' aria-expanded='false'
            aria-label='Toggle Navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNavDropdown'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/home'> Home</NavLink>
              </li>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/search'> Search Products</NavLink>
              </li>

              {
                authState.isAuthenticated ?
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='/manage'> Manage Products</NavLink>
                  </li>
                  :
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='/login'> Manage Products</NavLink>
                  </li>
              }


            </ul>
            <ul className='navbar-nav ms-auto'>

              {authState.isAuthenticated &&

                <li className='nav-item m-1'>
                  <button className='btn btn-outline-info' data-toggle="modal" onClick={showUserProfile}>
                    View Profile
                  </button>
                </li>
              }

              {!authState.isAuthenticated ?

                <li className='nav-item m-1'>
                  <Link type='button' className='btn btn-outline-light' to='/login'>
                    Sign in
                  </Link>
                </li>
                :
                <li className='btn btn-outline-light' onClick={handleLogout}> Logout</li>
              }



            </ul>
          </div>
        </div>
      </nav>

      <Modal show={show} onHide={closeUserProfile} centered>
        <Modal.Header>
          User Profile
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Name: {authState.idToken?.claims.name}</p>
            <p>Email: {authState.idToken?.claims.email}</p>
            <p>Last Login Time : {lastLogintime}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUserProfile}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  );
}