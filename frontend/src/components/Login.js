import React, { useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', {
                email: email,
                password: password,
            }, {
                withCredentials: true,
            });
                Swal.fire({
                    position: "center",
                    icon: 'success',
                    title: 'Login Successful',
                    text: response.data.message,
                    showConfirmButton: false,
                    timer: 2000
                });

                const token = response.data.token;

                localStorage.setItem('jwtToken', token);

                setTimeout(function (){
                    window.location.href="/";
                },2000)

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Error',
                html: getErrorMessages(error.response.data.errors ?? ""),
            });
        }
    };


    const getErrorMessages = (errors)=>{
        let messages ="";
        if(errors){
            for (var field in errors) {
                if (errors.hasOwnProperty(field)) {
                    var errorMessages = errors[field];
                    errorMessages.forEach(function (errorMessage) {
                        messages +=`<li>${errorMessage}</li>`;
                    });
                }
            }
        }else{
            messages ="Unexpected error"
        }
        return messages;
    }

    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email:
                </label>
                <input
                    type="email"
                    id="email"
                    className="border-2 border-gray-500 p-2 w-full"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    className="border-2 border-gray-500 p-2 w-full"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleLogin}
            >
                Login
            </button>
        </div>
    );
};

export default Login;
