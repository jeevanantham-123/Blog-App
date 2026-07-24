import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ForgotPassword() {
    const [form, setForm] = useState({
        email :"",
        newPassword:""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/forgot-password",
                form
            );

            toast.success(response.data.message);
            setForm({
                email:"",
                newPassword:""
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Forgot Password</h2>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                className="form-control mb-3"
                                placeholder="Enter your email"
                                name="email"
                                value={form.email}
                                onChange={(e) => setForm({...form,email:e.target.value})}
                                required
                            />

                            <input type="password" 
                            name="newPassword"
                            className="form-control mb-3"
                            placeholder="Enter new password" 
                            value={form.newPassword}
                            onChange={(e) => setForm({...form,newPassword:e.target.value})}
                            required />

                            <button
                                className="btn btn-primary w-100"
                                type="submit"
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;