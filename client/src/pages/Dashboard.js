import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [data, setData] = useState({
        totalBlogs: 0,
        totalComments: 0,
        totalLikes: 0,
    });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            if(!token){
                alert("please log in first");
                return;
            }

            const response = await axios.get("https://blog-app-hjga.onrender.com/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setData(response.data);
        }

        catch (error) {
            console.log(error);

            alert("Failed to load dashboard");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Dashboard</h2>
            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5>Total Blogs</h5>
                            <h2>{data.totalBlogs}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5>Total Likes</h5>
                            <h2>{data.totalLikes}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5>total Comments</h5>
                            <h2>{data.totalComments}</h2>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Dashboard;