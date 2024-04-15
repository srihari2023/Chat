import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Add from "../Img/add.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../Components/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Registration = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        // Basic form validation
        if (!displayName || !email || !password || !file) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const storageRef = ref(storage, `${user.uid}/avatar.jpg`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                null,
                (error) => {
                    toast.error("Error uploading avatar: " + error.message);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    await updateProfile(user, {
                        displayName,
                        photoURL: downloadURL,
                    });

                    await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL,
                    });

                    await setDoc(doc(db, "userChats", user.uid), {});
                    navigate("/Login");
                }
            );
        } catch (error) {
            toast.error("Error creating user: " + error.message);
        }
    };

    return (
        <div className="formContainer">
            <ToastContainer />
            <div className="formWrapper">
            <h1 style={{ color: "whitesmoke", marginBottom: "20px" }}>Let's Chat</h1>
            <span className="logo">LOGIN</span>
                {/* <span className="title" style={{ color: "whitesmoke" }}>Register</span> */}
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Display Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <input style={{ display: "none" }} type="file" id="file" />
                    <label htmlFor="file">
                        <img src={Add} alt="" />
                        <span>Add an Avatar</span>
                    </label>
                    <button type="submit">Sign Up</button>
                    {error && <span style={{ color: "whitesmoke" }}>{error}</span>}
                </form>
                <p>Already have an account? <Link to="/Login">Login</Link></p>
            </div>
        </div>
    );
};

export default Registration;
