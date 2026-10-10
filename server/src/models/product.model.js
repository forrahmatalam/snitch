import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    title:{
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
    images:{
        type: [{ type: String }],
        validate: {
            validator: images => images.length <= 5,
            message: "You can only upload 5 images"
        }
    },
    sizes:{
        type: [{
            _id: false,
            size: { type: String, required: true, enum: ["XS", "S", "M", "L", "XL", "XXL"] },
            stock: { type: Number, required: true, min: 0 }
        }],
        required: true,
        validate: { validator: sizes => sizes.length > 0, message: "At least one size is required" }
    },
    seller:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    published:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

const productsModel = mongoose.model("Product",productsSchema);

export default productsModel;
