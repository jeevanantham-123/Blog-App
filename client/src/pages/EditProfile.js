import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function EditProfile() {
    const [user, setUser] = useState({
        name: "",
        email: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://blog-app-hjga.onrender.com/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser({
                name: response.data.name,
                email: response.data.email
            });

        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await axios.put(
                "https://blog-app-hjga.onrender.com/profile",
                user,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(response.data.message);

        } catch (error) {
            console.log(error);
            toast.error("Failed to Update Profile");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <div className="card shadow-lg p-4">

                        <h2 className="text-center mb-4">
                            Edit Profile
                        </h2>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label className="form-label">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                Update Profile
                            </button>

                        </form>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default EditProfile;