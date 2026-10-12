import { google } from "googleapis";
import "dotenv/config";

const config = process.env;

// Support the lowercase names from the downloaded Google OAuth client JSON too.
export const googleClientId = config.GOOGLE_CLIENT_ID || config.client_id;
const googleClientSecret = config.GOOGLE_CLIENT_SECRET || config.client_secret;
const redirectUri = new URL(config.CLIENT_URL || "http://localhost:5173").origin;

export const oauth2Client = new google.auth.OAuth2(
    googleClientId,
    googleClientSecret,
    redirectUri
);
