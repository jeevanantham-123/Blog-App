const User = require("../models/User");

const adminMiddleware = async (req,res,next) => {
    try{
        const user = await User.findById(req.user.userId);

        console.log(user);

        console.log("isUser:",user.isAdmin);

        // if(!user || !user.isAdmin){
        //     return res.status(403).json({
        //         message:"Access denied. admin only."
        //     });
        // }
        next();
    }

    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Server error"
        });
    }
};

module.exports = adminMiddleware;