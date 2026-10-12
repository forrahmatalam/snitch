import { googleClientId, oauth2Client } from '../config/googleConfig.js'
import User from '../models/user.model.js'
import { createAccessToken, createRefreshToken } from '../utils/auth.utils.js'


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

    if (!googleClientId || !(process.env.GOOGLE_CLIENT_SECRET || process.env.client_secret)) {
        return res.status(503).json({
            message: 'Google Auth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env.'
        })
    }

    try {
        const googleRes = await oauth2Client.getToken(code)

        if (!googleRes.tokens.id_token) {
            return res.status(401).json({
                message: 'Google identity token is missing'
            })
        }


        const ticket = await oauth2Client.verifyIdToken({
            idToken: googleRes.tokens.id_token,
            audience: googleClientId
        })

        const profile = ticket.getPayload()


        if (!profile?.sub || !profile.email || !profile.email_verified) {
            return res.status(401).json({
                message: 'Google account email could not be verified'
            })
        }

        const { email, name, picture, sub } = profile

        const normalizedEmail = email.toLowerCase()


        let user = await User.findOne({
            email: normalizedEmail
        })


        if (!user) {

            user = await User.create({
                name: name || normalizedEmail.split('@')[0],
                email: normalizedEmail,
                image: picture,
                googleId: sub
            })

        } else if (!user.googleId) {

            user.googleId = sub

            if (picture) {
                user.image = picture
            }

            await user.save()

        } else if (user.googleId !== sub) {

            return res.status(409).json({
                message: 'This email is linked to a different Google account'
            })

        } else if (picture && user.image !== picture) {

            user.image = picture
            await user.save()
        }


        const accessToken = createAccessToken({ id: user._id, role: user.role })
        const refreshToken = createRefreshToken({
            id: user._id,
            role: user.role
        })


        user.refreshToken = refreshToken
        await user.save()

        res.cookie('refreshToken', refreshToken, refreshCookieOptions)

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
        const details = error.response?.data?.error_description || error.message
        console.error('Google login failed:', details)

        return res.status(401).json({
            message: `Google login failed: ${details || 'authorization code could not be verified'}`
        })
    }
}
