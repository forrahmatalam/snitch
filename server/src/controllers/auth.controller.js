import userModel from '../models/user.model.js';
import bcrypt from "bcrypt";


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
        passwordHash:  bcrypt.hashSync(password, 10)
    });
    return res.status(201).json({
        message: "User created successfully",
        user
    });
};

export default { register };