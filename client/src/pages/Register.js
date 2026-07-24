import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/register",
                user
            );

            toast.success(response.data.message);
            navigate("/login");
        } catch (error) {
            toast.error("Registration failed");
            console.log(error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg p-4 register-card">
                        <h2 className="text-center mb-4">Create Account</h2>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="form-control mb-3"
                                name="name"
                                placeholder="Enter Name"
                                value={user.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="email"
                                className="form-control mb-3"
                                name="email"
                                placeholder="Enter Email"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="password"
                                className="form-control mb-3"
                                name="password"
                                placeholder="Enter Password"
                                value={user.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="submit"
                                className="btn btn-success w-100"
                            >
                                Register
                            </button>
                        </form>

                        <p className="text-center mt-3">
                            Already have an account?{" "}
                            <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;