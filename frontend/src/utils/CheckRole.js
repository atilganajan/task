import axios from 'axios';
import Swal from "sweetalert2";

const checkRole = async (role) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        return false;
    }

    try {
        const response = await axios.get('http://localhost:8000/api/check-role', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.role === role;
    } catch (error) {
    
        if(error.response.data.message === "Token has expired"){
            localStorage.removeItem('jwtToken');
            setTimeout(function (){
                window.location.reload()
            },2000)
        }
        return false;
    }
};

export default checkRole;