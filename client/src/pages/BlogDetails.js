import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogDetails.css";
import { toast } from "react-toastify";

function BlogDetails() {

    const { id } = useParams();

    const [blog, setBlog] = useState({});

    const [comments, setComments] = useState([]);

    const [text, setText] = useState("");

    useEffect(() => {
        fetchBlog();
        fetchComment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBlog = async () => {
        try {
            const response = await axios.get(
                `https://blog-app-hjga.onrender.com/blogs/${id}`
            );

            console.log(response.data);
            setBlog(response.data);
        }

        catch (error) {
            console.log(error);
        }
    };

    const fetchComment = async () => {
        try {
            const response = await axios.get(
                `https://blog-app-hjga.onrender.com/blogs/${id}/comments`
            );

            setComments(response.data);
        }

        catch (error) {
            console.log(error);

        }
    };

    const addComment = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                `https://blog-app-hjga.onrender.com/blogs/${id}/comments`, { text },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setText("");
            fetchComment();
        }

        catch (error) {
            console.log(error);
            toast.error("Failed to add comment");
        }
    };

    return (
        <div className="container mt-5">

            <div className="card shadow-lg border-0">

                {blog.image && (
                    <img
                        src={`https://blog-app-hjga.onrender.com/uploads/${blog.image}`}
                        alt={blog.title}
                        className="blog-image"
                    />
                )}

                <div className="card-body">

                    <span className="badge bg-primary mb-3">
                        {blog.category}
                    </span>

                    <h1 className="blog-title">
                        {blog.title}
                    </h1>

                    <p className="text-muted">
                        <strong>Author:</strong> {blog.createdBy?.name}
                    </p>

                    <hr />

                    <div className="blog-content">
                        {blog.content}
                    </div>

                </div>

            </div>

            <div className="comment-section mt-5">

                <h3 className="mb-3">Comments</h3>

                <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write your comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <button
                    className="btn btn-success mt-3"
                    onClick={addComment}
                >
                    Post Comment
                </button>

                <hr />

                {comments.length === 0 ? (
                    <p className="text-muted">No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="card shadow-sm p-3 mb-3"
                        >
                            <h6 className="mb-1">
                                {comment.createdBy?.name}
                            </h6>

                            <p className="mb-0">
                                {comment.text}
                            </p>
                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default BlogDetails;