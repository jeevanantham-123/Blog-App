import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ChangePassword() {

    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: ""
    });

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await axios.put(
                "https://blog-app-hjga.onrender.com/change-password",
                passwords,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(response.data.message);

            setPasswords({
                oldPassword: "",
                newPassword: ""
            });

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message || "Failed to change password"
            );
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <div className="card shadow-lg p-4">

                        <h2 className="text-center mb-4">
                            Change Password
                        </h2>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label className="form-label">
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    name="oldPassword"
                                    placeholder="Enter current password"
                                    value={passwords.oldPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                Change Password
                            </button>

                        </form>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default ChangePassword;