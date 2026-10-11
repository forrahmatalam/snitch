import axios from 'axios'
import jwt from 'jsonwebtoken'
import { oauth2Client } from '../utils/googleConfig.js'
import User from '../models/userModel.js'
import { createRefreshToken } from '../utils/auth.utils.js'


// REFRESH TOKEN COOKIE OPTIONS
const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
}


export const googleLogin = async (req, res) => {

    const code = req.query.code ?? req.body?.code

    if (!code) {
        return res.status(400).json({
            message: 'Google authorization code is required'
        })
    }

    try {

        // GOOGLE SE TOKENS LENA
        const googleRes = await oauth2Client.getToken(code)

        if (!googleRes.tokens.id_token) {
            return res.status(401).json({
                message: 'Google identity token is missing'
            })
        }


        // GOOGLE ID TOKEN VERIFY KARNA
        const ticket = await oauth2Client.verifyIdToken({
            idToken: googleRes.tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const profile = ticket.getPayload()


        // GOOGLE USER KI INFORMATION LENA
        if (!profile?.sub || !profile.email || !profile.email_verified) {
            return res.status(401).json({
                message: 'Google account email could not be verified'
            })
        }

        const { email, name, picture, sub } = profile

        const normalizedEmail = email.toLowerCase()


        // DATABASE MEIN EMAIL KE BASIS PAR USER SEARCH KARNA
        let user = await User.findOne({
            email: normalizedEmail
        })


        if (!user) {

            // AGAR USER NAHI HAI TO NAYA USER CREATE KARNA
            user = await User.create({
                name: name || normalizedEmail.split('@')[0],
                email: normalizedEmail,
                image: picture,
                googleId: sub
            })

        } else if (!user.googleId) {

            // VERIFIED EMAIL KE BAAD EXISTING ACCOUNT LINK KARNA
            user.googleId = sub

            if (picture) {
                user.image = picture
            }

            await user.save()

        } else if (user.googleId !== sub) {

            // AGAR GOOGLE ACCOUNT MATCH NAHI KARTA
            return res.status(409).json({
                message: 'This email is linked to a different Google account'
            })

        } else if (picture && user.image !== picture) {

            // GOOGLE PROFILE IMAGE UPDATE KARNA
            user.image = picture
            await user.save()
        }


        // ACCESS TOKEN SIGN KARNA
        const accessToken = jwt.sign(

            // TOKEN KE ANDAR USER KI INFORMATION
            {
                id: user._id,
                role: user.role
            },

            // SECRET KEY
            process.env.JWT_SECRET,

            // TOKEN KI EXPIRY
            {
                expiresIn: process.env.JWT_TIMEOUT || '1h'
            }
        )


        // REFRESH TOKEN GENERATE KARNA
        const refreshToken = createRefreshToken({
            id: user._id,
            role: user.role
        })


        // DATABASE MEIN REFRESH TOKEN SAVE KARNA
        user.refreshToken = refreshToken
        await user.save()


        // REFRESH TOKEN HTTP-ONLY COOKIE MEIN SAVE KARNA
        res.cookie('refreshToken', refreshToken, refreshCookieOptions)


        // FRONTEND KO RESPONSE BHEJNA
        return res.status(200).json({
            message: 'Google login successful',

            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                accessToken
            }
        })


    } catch (error) {

        console.error('Google login failed:', error.message)

        return res.status(401).json({
            message: 'Google login could not be verified'
        })
    }
}
