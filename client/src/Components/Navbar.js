import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const [user, setUser] = useState({});

    const isLoggedIn = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) return;

                const response = await axios.get(
                    "http://localhost:5000/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUser(response.data);

            } catch (error) {
                console.log(error);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Logged out  Successfully");
        navigate("/login");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">

                <Link className="navbar-brand fw-bold" to="/">MERN Blog</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/create-blog">Create Blog</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/my-blogs">My Blogs</Link>
                                </li>

                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle d-flex align-items-center text-white"
                                        href="/#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                    >{user.profileImage && (<img src={`http://localhost:5000/uploads/${user.profileImage}`}
                                        alt="Profile"
                                        className="rounded-circle me-2"

                                        style={{
                                            width:"35px",
                                            height:"35px",
                                            objectFit:"cover"
                                        }}
                                        />
                                    )}
                                        
                                        <span className="fw-bold">{user.name}</span>
                                    </a>

                                    <ul className="dropdown-menu dropdown-menu-end">

                                        <li>
                                            <Link className="dropdown-item" to="/dashboard">
                                                📊 Dashboard
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="dropdown-item" to="/profile">
                                                👤 Profile
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="dropdown-item" to="/bookmarks">
                                                ⭐ Saved Blogs
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="dropdown-item" to="/admin/users">
                                                👨‍💼 Admin
                                            </Link>
                                        </li>

                                        <li><hr className="dropdown-divider" /></li>

                                        <li>
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={handleLogout}
                                            >
                                                🚪 Logout
                                            </button>
                                        </li>

                                    </ul>
                                </li>

                            </>
                        )}
                    </ul>
                </div>


            </div>

        </nav>
    );
}

export default Navbar;