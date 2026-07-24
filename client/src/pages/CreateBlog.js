import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreateBlog.css";

function CreateBlog() {

    const [blog, setBlog] = useState({
        title: "",
        content: "",
        category: "Technology",
        image: null
    });

    const[preview,setPreview] = useState("");

    const handleChange = (e) => {
        setBlog({
            ...blog,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        setBlog({
            ...blog,
            image:file
        });
        if(file){
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", blog.title);
            formData.append("content", blog.content);
            formData.append("category", blog.category);
            formData.append("image", blog.image);

            const response = await axios.post(
                "http://localhost:5000/create-blog",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            toast.success(response.data.message);

            setBlog({
                title: "",
                content: "",
                category: "Technology",
                image: null
            });

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to create blog");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">

                    <div className="card shadow-lg p-4 create-blog-card">

                        <h2 className="text-center mb-4">
                            Create New Blog
                        </h2>

                        <form onSubmit={handleSubmit}>

                            <input
                                type="text"
                                className="form-control mb-3"
                                name="title"
                                placeholder="Enter Blog Title"
                                value={blog.title}
                                onChange={handleChange}
                                required
                            />

                            <textarea
                                className="form-control mb-3"
                                name="content"
                                rows="8"
                                placeholder="Write your blog..."
                                value={blog.content}
                                onChange={handleChange}
                                required
                            />

                            <select
                                className="form-select mb-3"
                                name="category"
                                value={blog.category}
                                onChange={handleChange}
                            >
                                <option>Technology</option>
                                <option>Education</option>
                                <option>Travel</option>
                                <option>Sports</option>
                                <option>Health</option>
                                <option>Food</option>
                                <option>Others</option>
                            </select>

                            <input
                                type="file"
                                className="form-control mb-4"
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            {preview && (
                                <div className="mt-3 text-center">
                                    <img src={preview} alt="Preview" 
                                    style={{width:"250px",
                                    borderRadius : "10px"
                                    }}
                                    />
                                    </div>
                            )}
                            

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                Publish Blog
                            </button>

                        </form>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default CreateBlog;