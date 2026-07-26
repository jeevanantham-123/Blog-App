import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Profile.css";

function Profile() {

    const [user, setUser] = useState({});

    const [image, setImage] = useState(null);

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

            setUser(response.data);

        } catch (error) {
            console.log(error);
            toast.error("Failed to load profile");
        }
    };

    const uploadImage = async () => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("profileImage", image);

            const response = await axios.put(
                "https://blog-app-hjga.onrender.com/upload-profile-image",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            toast.success(response.data.message);
            fetchProfile();

        } catch (error) {
            console.log(error);
            toast.error("Failed to upload image");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <div className="card shadow-lg border-0 rounded-4 text-center p-4">

                        {user.profileImage ? (
                            <img
                                src={`https://blog-app-hjga.onrender.com/uploads/${user.profileImage}`}
                                alt="Profile"
                                className="rounded-circle mx-auto mb-3"
                                style={{
                                    width: "170px",
                                    height: "170px",
                                    objectFit: "cover",
                                    border: "5px solid #0d6efd"
                                }}
                            />
                        ) : (
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                alt="Default"
                                className="rounded-circle mx-auto mb-3"
                                style={{
                                    width: "170px",
                                    height: "170px",
                                    border: "5px solid #0d6efd"
                                }}
                            />
                        )}

                        <h2 className="fw-bold">{user.name}</h2>
                        <p className="text-muted">{user.email}</p>

                        <h5 className="mb-4">
                            📝 Total Blogs : <span className="text-primary">{user.totalBlogs}</span>
                        </h5>

                        <input
                            type="file"
                            className="form-control mb-3"
                            onChange={(e) => setImage(e.target.files[0])}
                        />

                        <button
                            className="btn btn-primary w-100 mb-3"
                            onClick={uploadImage}
                        >
                            Upload Profile Picture
                        </button>

                        <div className="d-grid gap-2">
                            <Link
                                to="/edit-profile"
                                className="btn btn-warning"
                            >
                                Edit Profile
                            </Link>

                            <Link
                                to="/change-password"
                                className="btn btn-dark"
                            >
                                Change Password
                            </Link>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Profile;