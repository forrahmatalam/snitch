import { body } from 'express-validator';

export const createProductValidator = [

body("title")
.exists().withMessage("Title is required").bail()
.trim()
.isString().withMessage("Title must be a string").bail()
.isLength({ min: 2, max: 50 }).withMessage("Title must be between 2 and 50 characters").bail()
.isAlpha("en-US",{ignore:" "}).withMessage("Title must be alphabetic characters").bail(),

body("description")
.exists().withMessage("Description is required").bail()
.trim()
.isString().withMessage("Description must be a string").bail()
.isLength({ min: 2, max: 500 }).withMessage("Description must be between 2 and 500 characters").bail(),

body("price.amount")
.exists().withMessage("Price is required").bail()
.trim()
.isFloat({min:0}).withMessage("Price must be a float number").bail()
.isLength({ min: 1, max: 10 }).withMessage("Price must be between 1 and 10 characters").bail(),

body("price.currency")
.exists().withMessage("Currency is required").bail()
.trim()
.isString().withMessage("Currency must be a string").bail()
.isIn(["INR","USD"]).withMessage("Currency must be INR or USD").bail(), 

body("image")
.exists().withMessage("Image is required").bail()
.trim()
.isString().withMessage("Image must be a string").bail()
.isLength({ min: 1, max: 5 }).withMessage("Image must be between 1 and 5 characters").bail(),

body("size")
.exists().withMessage("Size is required").bail()
.trim()
.isString().withMessage("Size must be a string").bail()
.isLength({ min: 3, max: 3 }).withMessage("Size must be between 3 and 3 characters").bail(),

body("stock")
.exists().withMessage("Stock is required").bail()
.trim()
.isNumeric().withMessage("Stock must be a number").bail()           

];