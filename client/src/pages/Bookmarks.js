import { useEffect, useState } from "react";
import axios from "axios";

function Bookmarks() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/bookmarks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBlogs(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>⭐ Saved Blogs</h2>

            {blogs.length === 0 ? (
                <h5>No bookmarked blogs.</h5>
            ) : (
                blogs.map((blog) => (
                    <div className="card mb-3" key={blog._id}>
                        <div className="card-body">
                            <h4>{blog.title}</h4>
                            <p>{blog.content}</p>
                            <small>
                                By {blog.createdBy?.name}
                            </small>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Bookmarks; 