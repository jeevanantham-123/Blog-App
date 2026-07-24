import { Routes, Route } from "react-router-dom";
import CreateBlog from "./pages/CreateBlog";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogDetails from "./pages/BlogDetails";
import EditBlog from "./pages/EditBlog";
import MyBlogs from "./pages/MyBlogs";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./AdminUsers";
import NotFound from "./NotFound";
import Footer from "./Footer";
import ForgotPassword from "./pages/ForgotPassword";
import Bookmarks from "./pages/Bookmarks";
// function Home(){
//   return <h1>Home Page</h1>;
// }

// function Login(){
//   return <h1>Login Page</h1>
// }

// function Register(){
//   return <h1>Register page</h1>
// }
function App() {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/edit-blog/:id" element={<EditBlog />} />
            <Route path="/my-blogs" element={<MyBlogs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/bookmarks" element={<Bookmarks/>} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>


        <Footer />

      </div>

    </>
  );
}

export default App;
