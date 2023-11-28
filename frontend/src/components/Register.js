import React, { useState } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register', {
                name: name,
                email: email,
                password: password,
            }, {
                withCredentials: true,
            });
                Swal.fire({
                    position: "center",
                    icon: 'success',
                    title: 'Registration Successful',
                    text: response.data.message,
                    showConfirmButton: false,
                    timer: 2000
                });

                setTimeout(function (){
                    navigate("/login");
                },2000)

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Error',
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
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    Name:
                </label>
                <input
                    type="text"
                    id="name"
                    className="border-2 border-gray-500 p-2 w-full"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
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
                className="bg-green-500 text-white p-2 rounded"
                onClick={handleRegister}
            >
                Register
            </button>
        </div>
    );
};

export default Register;
