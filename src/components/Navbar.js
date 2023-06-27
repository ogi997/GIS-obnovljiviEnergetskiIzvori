//styling & components
import './Navbar.css';
import Logo from '../assets/logo.jpg';
import { Person, Power, Lock } from "react-bootstrap-icons";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import ChangePassword from "./ChangePassword/ChangePassword";

//redux, state & router
import { Link, useNavigate } from 'react-router-dom';
import { logout, status } from '../redux-store/userSlice';
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { resetTemporaryLayers } from '../redux-store/testslice';

export default function Navbar() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showDropdown, setShowDropdown] = useState(false);
    const [show, setShow] = useState(false);
    const { authenticated } = useSelector((state) => state.users);

    const handleHomeClick = () => {
        dispatch(resetTemporaryLayers()); 
    }

    useEffect(() => {
        dispatch(status());
    }, [dispatch]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    }

    const handleChangePassword = () => {
        handleShow();
    }

    return (
        <div className='navbarMenu'>
            <div className='logo-map'>
                <img className='gisLogo' src={Logo} alt="Logo" />
                <p style={{ marginBottom: "0px" }}><Link className='map-text underline' to="/map">Map</Link></p>
                <p style={{ marginBottom: "0px" }}>
                    <Link className='home underline' to="/" onClick={handleHomeClick} 
                    style={{ color: "white", textDecoration: "none" }}>Home</Link>
                </p>

            </div>


            <div className='twoItems'>
                <p style={{ marginBottom: "0px" }}>
                    {

                        !authenticated && <Link className='home underline' to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
                    }
                </p>



                {
                    authenticated &&
                    <DropdownButton
                        title={<Person style={{ color: 'white' }} />}
                        variant='secondary'
                        onToggle={(isOpen) => setShowDropdown(isOpen)}
                        show={showDropdown}
                    >
                        <Dropdown.Item onClick={handleChangePassword}>
                            <Lock style={{ marginRight: '8px' }} />
                            Change password
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                            <Power style={{ marginRight: '8px' }} />
                            Log out
                        </Dropdown.Item>
                    </DropdownButton>
                }
            </div>

            <ChangePassword show={show} handleClose={handleClose} />
        </div>
    )
}
