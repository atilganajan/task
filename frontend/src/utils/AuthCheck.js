import React, { useEffect } from 'react';

const AuthCheck = () => {
    const isAuthenticated = !!localStorage.getItem('jwtToken');

    useEffect(() => {
        if (!isAuthenticated) {

        }
    }, [isAuthenticated]);

    return isAuthenticated;
};

export default AuthCheck;
