import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://blog-app-hjga.onrender.com/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(response.data);

        } catch (error) {
            console.log(error);
            alert("Failed to load users");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Admin - All Users</h2>

            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminUsers;