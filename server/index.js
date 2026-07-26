const express = require("express");

require("dotenv").config();

const cors = require("cors");

const app = express();

app.use(cors({
    origin:"https://blog-app-1-i5j0.onrender.com",
    credentials:true
}));

app.use(express.json());

app.use("/uploads",express.static("uploads"));

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey";

const bcrypt = require("bcrypt");

const connectDB = require("./config/db");

const User =require("./models/User");

const Blog = require("./models/Blog");

const authMiddleware = require("./middleware/authMiddleware");

const Comment = require("./models/Comment");

const multer = require("multer");

const path = require("path");

const adminMiddleware = require("./middleware/adminMiddleware");


connectDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;

const storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,"uploads/");
    },
    filename : function (req,file,cb){
        cb(null,Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


app.get("/",(req,res)=>{
    res.send("Welcome to blog App");
});

app.get("/about",(req,res)=>{
    res.send("This is the about page");
});

app.get("/contact",(req,res)=>{
    res.send("Contact page");
});

app.get("/users",async(req,res)=>{
    try{
        const users = await
        User.find();

        res.json(users);
    }
    catch(error){
        console.log(error);
        res.status(500).send("Error fetching users");
    }
})

app.get("/blogs",async (req,res) =>{
    try{
        const search = req.query.search || "";

        const category = req.query.category || "All";

        const page = Number(req.query.page) || 1;

        const limit= 6;

        const skip =(page-1)*limit;

        let filter ={
            title : {
                $regex:search,
                $options :"i"
            }
        };

        if(category && category !== "All"){
            filter.category = category;
        }

        const blogs = await Blog.find(filter).populate("createdBy","name email").skip(skip).limit(limit);

        const totalBlogs = await Blog.countDocuments(filter);

        res.status(200).json({blogs,
            totalPages:Math.ceil(totalBlogs / limit),currentPage : page});

    }
    catch(error){
        console.log(error);
        res.status(500).send("Failed to fetch blogs");
    }
});

app.get("/my-blogs",authMiddleware, async (req,res) => {

    try{
        const blogs = await Blog.find({
            createdBy : req.user.userId
        }).populate("createdBy","name email");


        res.status(200).json(blogs);
    }

    catch(error){
        console.log(error);

        res.status(500).json({
            message : "Failed to fetch Your blogs"
        });
    }

});

app.get("/blogs/:id", async (req,res) =>{
    try{
        const blog = await Blog.findByIdAndUpdate(req.params.id,
            { $inc :{views : 1} },
            { new :true}).populate("createdBy","name email");

        if(!blog){
            return res.status(404).send("Blog not found");
        }

        res.send(blog);
    }

    catch(error){
        console.log(error);
        res.status(500).send("Failed to fetch blogs");
    }
});

app.get("/recemt-blogs",async (req,res) => {
    try{
        const blogs = await Blog.find().sort({
            createdAt:-1
        }).limit(4).populate("createdby","name");
        res.json(blogs);
    }

    catch(error){
        console.log(error);

        res.status(500).json({
            message:"Failed to fetch recent blogs"
        });
    }
});

app.get("/profile",authMiddleware, async (req,res) => {
    try{
        const user = await User.findById(req.user.userId).select("-password");

        const totalBlogs = await Blog.countDocuments({
            createdBy:req.user.userId
        });

        res.status(200).json({
            name:user.name,
            email:user.email,
            totalBlogs:totalBlogs,
            profileImage:user.profileImage
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            message:"Failed to fetch profile"
        });
    }
});

app.get("/dashboard",authMiddleware,async (req,res) => {
    try{
        const totalBlogs =await Blog.countDocuments({
            createdBy : req.user.userId
        });

        const totalComments = await Comment.countDocuments({
            createdBy:req.user.userId
        });

        const totalLikes = await Blog.aggregate([
            {
            $match : {
                createdBy:new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group : {
                _id:null,totalLikes :{$sum:"$likes"}
            }
        }
        ]);

        res.json({
            totalBlogs,
            totalComments,
            totalLikes:totalLikes.length ? totalLikes[0].totalLikes :0
        });
    }

    catch(error){
        console.log(error);

        res.status(500).json({
            message:"Dashboard failed"
        });
    }
});

app.put("/blogs/:id/like", async (req,res) => {
    try{
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc:{likes:1}},{new:true}
        );

        if(!blog){
            return res.status(404).json({
                message :"Blog not found"
            });
        }
        
        res.status(200).json({
            message:"Blog liked successfully",
            likes: blog.likes
        });
    }

    catch(error){
        console.log(error);

        res.status(500).json({
            message:"Failed to like blog"
        });
    }
});

app.put("/profile",authMiddleware, async (req,res) => {
    try{
        const { name,email } = req.body;

        const user = await User.findById(req.user.userId);

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        user.name = name;
        user.email = email;

        await user.save();

        res.status(200).json({
            message:"Profile updated Successfully"
        });
    }

    catch(error){
        console.log(error);

        res.status(500).json({
            message:"failed to update profile"
        });
    }
});

app.put("/upload-profile-image",authMiddleware,
upload.single("profileImage"),
async (req, res) => {
    try {

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.profileImage = req.file ? req.file.filename : "";

        await user.save();

        res.status(200).json({
            message: "Profile image uploaded successfully",
            profileImage: user.profileImage
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to upload profile image"
        });
    }
});

app.put("/change-password",authMiddleware,async (req,res) => 
{
    try{
        const { oldPassword,newPassword } = req.body;

        const user = await User.findById(req.user.userId);

        if(!user){
            return res.status(404).json({
                message :"User not found"
            });
        }

        const isMatch = await bcrypt.compare(oldPassword,user.password);

        if(!isMatch){
            return res.status(400).json({
                message : "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            message:"Password changed successfully"
        });
    }

    catch(error){
        console.log(error);
        res.status(500).json({
            message:"failed to change password "
        });
    }
});

app.use(express.json());

app.post("/register", async (req,res) => {
    try{
        const {name,email,password} = req.body;

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            name,email,password:hashedPassword
        })

        await user.save();

        res.status(201).json({
            message:"User Registered Successfully"
        })
    }

    catch(error){
        console.log("REGISTRATION FAILED",error);
        
        res.status(500).json({message:error.message});
    }
});

app.post("/login", async (req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email:email});

        if(!user){
            return res.status(404).json({
                message:"user not found"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid Password",});
        }

       const token = jwt.sign({
        userId :user._id,
        email:user.email
       },
    JWT_SECRET,
    {
    expiresIn:"1d"
      });

      res.status(200).json({
        message:"Login Successful",
        token
      });
    }
    catch(error){
        console.log("error",error);
        console.log("Response : ",error.response);
        console.log("Data :"+error.response?.data);

        alert("Login Failed");

        res.status(500).json({
            message:"login failed",
        });
    }
});

app.post("/forgot-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to reset password"
        });
    }
});

app.post("/blogs", async (req,res) => {
    try{
        const blog = new Blog(req.body);

        await blog.save();

        res.send("Blog Created Successfully");
    }
    catch(error){
        console.log(error);
        res.status(500).send("Blog creation failed");
    }
})

app.post("/create-blog", authMiddleware, upload.single("image"),async (req,res) => {
    try{
        const {title,content,category} = req.body;

        const blog = new Blog({
            title,
            content,
            category,
            image: req.file ? req.file.filename:"",
            createdBy:req.user.userId
        });

        await blog.save();

        res.status(201).json({
            message:"Blog Created SuccessFully",
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Failed to create Blog",
        });
    }
});

app.post("/blogs/:id/comments",authMiddleware, async (req,res) => {
    try{
        const { text } = req.body;

        const comment = new Comment({
            text,
            blogId:req.params.id,
            createdBy : req.user.userId
        });

        await comment.save();

        res.status(201).json({
            message : "Comment added Successfully",comment
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Failed to add comment"
        });
    }
});

app.get("/blogs/:id/comments",async (req,res) => {
    try{
        const comments = await Comment.find({
            blogId : req.params.id
        }).populate("createdBy","name");

        res.status(200).json(comments);
    }

    catch(error){
        console.log(error);
        res.status(500).json({
            message :"Failed to fetch commnets"
        });
    }
});

app.put("/blogs/:id", authMiddleware,async (req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);

        if(!blog){
            return res.status(404).send("Blog not found");
        }

        if(blog.createdBy.toString() !== req.user.userId){

        return res.status(403).json({

        message : "You are not authorized to update this blog"

        });

        }

        blog.title = req.body.title;

        blog.content = req.body.content;

        await blog.save();

        res.status(200).json({
            message : "Blog updated Successfully",blog
        });
    }

    catch(error){
        console.log(error);
        res.status(500).send("Blog Update Failed");
    }
});

app.delete("/blogs/:id",authMiddleware, async (req,res) =>{
    try{
        const blog = await Blog.findById(req.params.id);

        if(!blog){
            return res.status(404).send("Blog not found");
        }

        if(blog.createdBy.toString() !== req.user.userId){
            return res.status(403).json({
                message : "You are not Authorized to delete this blog"
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            message : "Deleted Successfully"
        });
    }

    catch(error){
        console.log(error);
        res.status(500).send("Blog Deleted failed");
    }
} )

app.get("/admin/users",authMiddleware,adminMiddleware,async (req,res) => {
    try{
        const users = await User.find().select("-password");

        res.status(200).json(users);
    }

    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Failed to fetch users"
        });
    }
});

app.put("/bookmark/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        const blogId = req.params.id;

        if (user.bookmarks.includes(blogId)) {
            // Remove bookmark
            user.bookmarks = user.bookmarks.filter(
                (id) => id.toString() !== blogId
            );

            await user.save();

            return res.json({
                message: "Bookmark removed",
                bookmarked: false
            });
        }

        // Add bookmark
        user.bookmarks.push(blogId);
        await user.save();

        res.json({
            message: "Blog bookmarked",
            bookmarked: true
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get("/bookmarks",authMiddleware,async (req,res) => {
    try{
        const user = await User.findById(req.user.userId).populate({
            path:"bookmarks",
            populate:{
                path:"createdBy",
                select : "name profileImage"
            }
        });

        res.json(user.bookmarks);
    }

    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
});