import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { FaHeart, FaBookmark, FaUser, FaFolder, FaEye, FaCalendarAlt } from "react-icons/fa";

function Home() {

    const [blogs, setBlogs] = useState([]);

    const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    let loggedInUserId = null;

    if (token) {
        const decoded = jwtDecode(token);
        loggedInUserId = decoded.userId;
    }

    useEffect(() => {
        fetchBlogs();
        fetchBookmarks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, category, page]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `http://localhost:5000/blogs?search=${search}&category=${category}&page=${page}`
            );

            setBlogs(response.data.blogs);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const fetchBookmarks = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) return;

            const res = await axios.get(
                "http://localhost:5000/bookmarks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBookmarkedBlogs(res.data.map(blog => blog._id));
        }

        catch (error) {
            console.log(error);
        }
    };

    const deleteBlog = async (id) => {
        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:5000/blogs/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`

                    }
                }
            );

            toast.success("Blog Deleted Successfully");

            fetchBlogs();
        }

        catch (error) {
            console.log(error);

            toast.error("Failed to Delete blog");
        }
    };

    const likeBlog = async (id) => {
        try {
            await axios.put(`http://localhost:5000/blogs/${id}/like`);

            fetchBlogs();
        }

        catch (error) {
            console.log(error);
            toast.error("Failed to like blog");
        }
    };

    const bookmarkBlog = async (id) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.put(
                `http://localhost:5000/bookmark/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);
            fetchBookmarks();

        } catch (error) {
            console.log(error);
            toast.error("Failed to bookmark blog");
        }
    };



    return (
        <div className="container home-container">

            <div className="hero-section text-center mb-5">
                <h1>Welcome to MERN Blog</h1>
                <p>
                    Read inspiring blogs,share your knowledge,
                    and connect with amazing writers.
                </p>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">

                    <input type="text"
                        className="form-control"
                        placeholder="Search blogs....."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} />

                </div>
                <br />
                <br />
                <div className="col-md-4">

                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="All">All Categories</option>
                        <option value="Technology">Technology</option>
                        <option value="Education">Education</option>
                        <option value="Travel">Travel</option>
                        <option value="Sports">Sports</option>
                        <option value="Health">Health</option>
                        <option value="Food">Food</option>
                        <option value="Others">Others</option>
                    </select>

                </div>

            </div>

            <br /><br />

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">loading....</span>
                    </div>
                </div>
            ) : (
                <>
                    <h2>All Blogs</h2>

                    <div className="row">

                        {blogs.length === 0 ? (
                            <div className="text-center mt-5">
                                <h4>No Blogs Found</h4>
                            </div>
                        ) : (
                            blogs.map((blog) => (
                                <div className="col-md-6 col-lg-4 mb-4" key={blog._id}>
                                    <div className="card blog-card h-100">

                                        {blog.image && (
                                            <img
                                                src={`http://localhost:5000/uploads/${blog.image}`}
                                                alt={blog.title}
                                                className="card-img-top blog-image"
                                            />
                                        )}

                                        <div className="card-body">

                                            <h4 className="card-title">{blog.title}</h4>

                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="badge bg-primary">
                                                    <FaFolder className="me-1" />
                                                    {blog.category}
                                                </span>

                                                <span className="text-muted">
                                                    <FaUser className="me-1" />
                                                    {blog.createdBy?.name}
                                                </span>
                                            </div>

                                            <p className="text-muted small">
                                                <FaCalendarAlt className="me-1" />
                                                {new Date(blog.createdAt).toLocaleDateString("en-IN")}
                                            </p>

                                            <p>{blog.content.substring(0, 120)}...</p>

                                            <p className="text-danger fw-bold">
                                                <FaHeart className="me-1" />
                                                {blog.likes} Likes &nbsp;
                                                <FaEye className="ms-3 me-1 text-secondary" />
                                                {blog.views} Views
                                            </p>

                                            <div className="blog-actions">

                                                <Link
                                                    to={`/blogs/${blog._id}`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Read More
                                                </Link>

                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => likeBlog(blog._id)}
                                                >
                                                    👍 Like
                                                </button>

                                                <button
                                                    className={`btn btn-info btn-sm ${bookmarkedBlogs.includes(blog._id)
                                                        ? "btn-warning" : "btn-info"
                                                        }`}
                                                    onClick={() => bookmarkBlog(blog._id)}>

                                                    {bookmarkedBlogs.includes(blog._id) ? (
                                                        <>
                                                            <FaBookmark className="me-1" /> Saved
                                                        </>) : (
                                                        <>
                                                            <FaBookmark className="me-1" />
                                                            save
                                                        </>
                                                    )
                                                    }
                                                </button>

                                                {loggedInUserId === blog.createdBy?._id && (
                                                    <>
                                                        <Link
                                                            to={`/edit-blog/${blog._id}`}
                                                            className="btn btn-warning btn-sm"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => deleteBlog(blog._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <button className="btn btn-secondary me-2" disabled={page === 1} onClick={() => setPage(page - 1)}>
                            Previous
                        </button>

                        <span className="align-self-center">
                            Page {page} of {totalPages}
                        </span>

                        <button className="btn btn-secondary ms-2"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}>
                            Next
                        </button>
                    </div>



                </>
            )}
        </div>
    );
}

export default Home;