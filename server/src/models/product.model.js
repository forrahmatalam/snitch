import mongoose from "mongoose";

const productsSchema =new mongoose.Schema({
    tite:{
        type:String,
        required:true,
        minLength:2,
        maxLength:50
    },
    description:{
        type:String,
        required:true,
        minLength:2,
        maxLength:500
    },
    price:{
        amount:{
            type:Number,
            required:true,         
        },
        currency:{
            type:String,
            required:true,
            enum:["INR","USD"],
            default:"INR"
        }
    },
    image:[{
        type:String,
    }],
    validate:{
        validator:image=>image.length <= 5,
        message:"You can only upload 5 images"
    },

   size:{
        {
            type:String,
            required:true,
            enum:["XS","S","M","L","XL","XXL"],
            default:"M"
        }
    },
    stock:{
        type:Number,
        min:0,
        default:0
    },
    seller:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
})

const productsModel = mongoose.model("Product",productsSchema);

export default productsModel;