import jwt from "jsonwebtoken";

const AuthMiddleware = (req,res,next) => {
    const token = req.headers.authentication;
    jwt.verify(token,process.env.JWT_SECRETE,(err,decoded)=>{
        if(err){
            console.log('token: ',token)
            console.log('decode failed: ',err)
            res.status(401).json({success:false});
        }else {
            if(decoded!==null){
                req.body.authId = decoded.authId;
                next()
            }else {
                res.status(401).json({success:false});
            }
        }
    })
}

export default AuthMiddleware;