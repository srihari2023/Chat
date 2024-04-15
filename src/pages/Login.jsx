import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Components/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const email = e.target[0].value;
        const password = e.target[1].value;

        // Basic form validation
        if (!email || !password) {
            toast.error("Please enter both email and password.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (error) {
            toast.error("Error signing in: " + error.message);
        }
    };

    return (
        <div className="formContainer">
            <ToastContainer />
            <div className="formWrapper">
            <h1 style={{ color: "whitesmoke", marginBottom: "20px" }}>Let's Chat</h1>
                <span className="logo">LOGIN</span>
                {/* <span className="title" style={{color:"whitesmoke"}}>Login</span> */}
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button>Sign In</button>
                </form>
                <p>You don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;
