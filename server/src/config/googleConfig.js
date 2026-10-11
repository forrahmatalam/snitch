import { google } from "googleapis";
import 'dotenv/config'


const config = process.env
const redirectUri = new URL(config.CLIENT_URL || 'http://localhost:5173').origin


export const oauth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
   config.GOOGLE_CLIENT_SECRET,
    redirectUri
);
