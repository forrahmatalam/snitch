import jwt from 'jsonwebtoken';
import config from '../config/config.js';



export const createAccessToken = ({id,role}) => {
    return jwt.sign({userId: id,role},config.ACCESS_TOKEN_SECRET,{expiresIn: "1h"});
};

export const readAccessToken = (accessToken) => {
    return jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
}

export const createRefreshToken = ({id,role}) => {
    return jwt.sign({userId: id,role},config.REFRESH_TOKEN_SECRET,{expiresIn: "7d"});
};

export const readRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
}