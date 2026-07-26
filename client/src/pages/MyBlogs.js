import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MyBlogs.css";

function MyBlogs() {

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchMyBlogs();
    }, []);

    const fetchMyBlogs = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://blog-app-hjga.onrender.com/my-blogs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBlogs(response.data);

        } catch (error) {

            console.log(error);

            alert("Failed to fetch your blogs");
        }
    };

    return (

        <div className="container mt-5">

            <h2 className="text-center mb-4">My Blogs</h2>

            <div className="row">

                {blogs.length === 0 ? (

                    <h4 className="text-center">No Blogs Found</h4>

                ) : (

                    blogs.map((blog) => (

                        <div className="col-md-4 mb-4" key={blog._id}>

                            <div className="card shadow blog-card h-100">

                                {blog.image && (
                                    <img
                                        src={`https://blog-app-hjga.onrender.com/uploads/${blog.image}`}
                                        className="card-img-top"
                                        alt={blog.title}
                                    />
                                )}

                                <div className="card-body">

                                    <span className="badge bg-primary">
                                        {blog.category}
                                    </span>

                                    <h4 className="mt-3">
                                        {blog.title}
                                    </h4>

                                    <p>
                                        {blog.content.substring(0,120)}...
                                    </p>

                                    <p>
                                        <strong>Author :</strong> {blog.createdBy?.name}
                                    </p>

                                    <p>❤️ {blog.likes} Likes</p>

                                    <div className="d-flex justify-content-between">

                                        <Link
                                            to={`/edit-blog/${blog._id}`}
                                            className="btn btn-warning"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            className="btn btn-danger"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );
}

export default MyBlogs;