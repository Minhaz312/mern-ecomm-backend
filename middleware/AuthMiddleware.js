import jwt from "jsonwebtoken";

const AuthMiddleware = (req,res,next) => {
    const token = req.headers.authentication;
    console.log(token)
    jwt.verify(token,process.env.JWT_SECRETE,(err,decoded)=>{
        if(err){
            res.status(401).json({success:false});
        }else {
            if(decoded!==null){
                req.body.userId = decoded.me;
                next()
            }else {
                res.status(401).json({success:false});
            }
        }
    })
}

export default AuthMiddleware;