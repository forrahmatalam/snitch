import { readAccessToken } from '../utils/auth.utils.js';



export const authenticate =(req,res,next)=>{

    const accessToken = req.headers.authorization?.split(' ')[1];

    if(!accessToken){
        return res.status(400).json({
            message: "Access token not found",
        });
    }

    try{
        const decoded = readAccessToken(accessToken);
        if (!decoded.userId) {
            return res.status(401).json({
                message: "Access token does not contain a user ID. Please log in again.",
            });
        }

        req.user = decoded;

        next(); 
    }catch(err){

        return res.status(401).json({
            message: "invalid or expired access token",
        });
    }

}
