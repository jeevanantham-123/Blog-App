import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function EditBlog() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [blog, setBlog] = useState({
        title: "",
        content: ""
    });

    useEffect(() => {
        fetchBlog();
    }, []);

    const fetchBlog = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/blogs/${id}`
            );

            setBlog(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setBlog({
            ...blog,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/blogs/${id}`,
                blog,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Blog Updated Successfully");

            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error("Failed to Update Blog");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">

                    <div className="card shadow-lg p-4">

                        <h2 className="text-center mb-4">
                            Edit Blog
                        </h2>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label className="form-label">
                                    Blog Title
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={blog.title}
                                    onChange={handleChange}
                                    placeholder="Enter Blog Title"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Blog Content
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="8"
                                    name="content"
                                    value={blog.content}
                                    onChange={handleChange}
                                    placeholder="Write your blog..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-warning w-100"
                            >
                                Update Blog
                            </button>

                        </form>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default EditBlog;