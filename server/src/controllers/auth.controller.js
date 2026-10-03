import userModel from '../models/user.model.js';
import bcrypt from "bcrypt";
import {createAccessToken, createRefreshToken} from '../utils/auth.utils.js';


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

res.cookie('refreshToken', refreshToken,{
    httpOnly: true,
});

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

    const accessToken = createAccessToken({userId: user._id, role: user.role});
    const refreshToken = createRefreshToken({userId: user._id, role: user.role});

await userModel.findOneAndUpdate(
    { _id: user._id },
    {
        refreshToken: refreshToken
    }
);

res.cookie('refreshToken', refreshToken,{
    httpOnly: true,
});

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

export default { register };