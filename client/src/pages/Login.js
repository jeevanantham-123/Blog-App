import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
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
                "https://blog-app-hjga.onrender.com/login",
                user
            );

            localStorage.setItem("token", response.data.token);

            toast.success(response.data.message);

            navigate("/");

            window.location.reload();
        }

        catch (error) {
            toast.error("login failed");
            console.log(error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg p-4">
                        <h2 className="text-center">Login</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="email"
                                className="form-control mb-3"
                                name="email"
                                placeholder="Enter Email"
                                value={user.email}
                                onChange={handleChange}
                            />

                            <br></br>

                            <input type="password"
                                className="form-control mb-3"
                                name="password"
                                placeholder="Enter password"
                                value={user.password}
                                onChange={handleChange}
                            />
                            <br></br>
                            <div className="text-end mb-3">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>

                            <button className="btn btn-primary w-100" type="submit">Login</button>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;