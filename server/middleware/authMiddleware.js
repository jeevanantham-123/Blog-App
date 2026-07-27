const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req,res,next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message:"Access Denied"
        });
    }

    const token = authHeader.split(" ")[1];

    console.log("Extracted Token",token);

    // if(!token){
    //     return res.status(401).json({
    //         message : "Access Denied"
    //     });
    // }

    try{
        const decoded = jwt.verify(token,JWT_SECRET);

        console.log("Decoded : "+decoded);

        req.user = decoded;
        next();

        // console.log("Auth",authHeader);
        // console.log("Token : ",token);
    }

    catch(error){

        console.log(error);
        
        return res.status(401).json({
            message : "Invalid Token"
        });
    }
};

module.exports = authMiddleware;