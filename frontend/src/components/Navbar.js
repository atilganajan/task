import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import AuthCheck from '../utils/AuthCheck';
import axios from "axios";
import Swal from "sweetalert2";

const Navbar = () => {
    const isAuthenticated = AuthCheck();
    const [logoutClicked, setLogoutClicked] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/auth/logout?token=${localStorage.getItem('jwtToken')}`);
            setLogoutClicked(true);
            if (response.data.status === true) {
                localStorage.removeItem('jwtToken');
                Swal.fire({
                    position: "center",
                    icon: 'success',
                    title: 'Logout',
                    text: response.data.message,
                    showConfirmButton: false,
                    timer: 2000
                });

                setTimeout(function () {
                    window.location.reload()
                }, 2000)

            } else {
                Swal.fire({
                    position: "center",
                    icon: 'error',
                    title: 'Logout',
                    text: "Unexpected error",
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: 'error',
                title: 'Logout',
                text: "Unexpected error",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    return (
        <nav className="bg-gray-800 p-4 ">
            <div className="container mx-auto flex justify-between items-center">

                <Link to="/" className="text-white text-lg font-bold">Home</Link>
                <Link to="/category" className="text-white text-lg font-bold">Categories</Link>

                <div className="space-x-4">
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="text-white cursor-pointer">
                            {logoutClicked ? 'Logging Out...' : 'Logout'}
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="text-white">Login</Link>
                            <Link to="/register" className="text-white">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
