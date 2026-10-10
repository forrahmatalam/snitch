import {body,validationResult} from 'express-validator';

export const addToCartValidator = [
    body('productId')
    .exists().withMessage('Please enter a valid productId').bail()
    .isString().withMessage('Please enter a valid productId').bail()
    .isMongoId().withMessage('Please enter a valid productId'),
  body('quantity')
    .exists().withMessage('Please enter a valid quantity').bail()
    .isInt({min: 1}).withMessage('Quantity must be an integer and greater than 0'),
    body('size')
    .exists().withMessage('Please enter a valid size').bail()
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
    .withMessage('Size must be one of XS, S, M, L, XL, XXL'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        next();
    }
];   
