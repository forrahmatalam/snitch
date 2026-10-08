import userModel from '../models/user.model.js';
import bcrypt from "bcrypt";
import {createAccessToken, createRefreshToken ,readRefreshToken} from '../utils/auth.utils.js';

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

//jb data read krna hoto cookies ka use krte hai aur jb send krna hoto cookie ka use krte hai 
// Register route
export const register = async (req, res) => {
    
    const { email, name, password } = req.body;

    const isUserExist =await userModel.findOne({email});

    if(isUserExist){
        return res.status(400).json({
            message: "User already exist",
            errors: [
                {
                    field: "email",
                    message: "User already exist"
                }
            ]
        });
    }

    const user =await userModel.create({
        email,
        name, 
        passwordHash: await bcrypt.hash(password, 12)
    });


    const accessToken = createAccessToken({id: user._id, role: user.role});
    const refreshToken = createRefreshToken({id: user._id, role: user.role});

res.cookie('refreshToken', refreshToken, refreshCookieOptions);

await userModel.findOneAndUpdate(
    { _id: user._id },
    {
        refreshToken: refreshToken
    }
);

    return res.status(201).json({
        message: "User created successfully",
        data:{
            user:{
                id: user._id,
                email: user.email,
                name: user.name,
            },
            accessToken,
            }
        });
        
   

};
// Login route
export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password",
          
        });
    }


    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

    if(!isPasswordMatch){
        return res.status(400).json({
            message: "Invalid email or password",
           
        });
    }

    const accessToken = createAccessToken({id: user._id, role: user.role});
    const refreshToken = createRefreshToken({id: user._id, role: user.role});

await userModel.findOneAndUpdate(
    { _id: user._id },
    {
        refreshToken: refreshToken
    }
);

res.cookie('refreshToken', refreshToken, refreshCookieOptions);

return res.status(200).json({
    message: "Login successful",
    data:{
        user:{
            id: user._id,
            email: user.email,
            name: user.name,
        },
        accessToken,
        }
    });

};


//refresh token
export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    //check if refresh token is avaailable or not
    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh token not found",
        });
    };

    //Ab refresh token sahi hai ya nhi ye check krnah hai
   
    try{
const decoded = readRefreshToken(refreshToken);
const {userId, role} = decoded;

const user = await userModel.findById(userId);

if(!user || refreshToken !== user.refreshToken){
    if(user){
        await userModel.findOneAndUpdate(
            { _id: user._id },
            {
                refreshToken: null
            }
        );
    }

    return res.status(400).json({
        message: "Refresh token mismatch",
    });
}


const newRefreshToken = createRefreshToken({
    id: userId,
    role
});
const accessToken = createAccessToken({
    id: user._id,
    role: user.role
});

await userModel.findOneAndUpdate(
    { _id: user._id },
    {
        refreshToken: newRefreshToken
    }
);

res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

res.status(200).json({
    message: "Refresh token updated successfully",
    data:{
        user:{
            id: user._id,
            email:user.email,
            name:user.name
        },
         accessToken
        
    }
});

    } catch(err){
        return res.status(401).json({
            message: "Invalid or expired refresh token",
        });
    }


};


//get rpofile using middleware
export const getMe = async (req, res) => {
 const {userId, role} = req.user;
 const user = await userModel.findById(userId);
 res.status(200).json({
     message: "User fetched successfully",
     data:{
         user:{
             id: user._id,
             email: user.email,
             name: user.name,
         },
         accessToken: createAccessToken({id: user._id, role: user.role})
     }
 });
};
