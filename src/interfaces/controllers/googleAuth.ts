// src/controllers/googleAuth.ts

import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { googleLogin } from '../../application/use-cases/authentication/registerUser';
import { DEFAULT_FRONTEND_LINK } from '../../utils/Constants';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  DEFAULT_FRONTEND_LINK
);

export const googleAuthCallback = async (req: Request, res: Response) => {


  const { code } = req.body; // Authorization code should be in query parameters

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google People API
    const people = google.people({ version: 'v1', auth: oauth2Client });
    const response = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
    });

    const userInfo = response.data;

    // Extract user details
    const email = userInfo.emailAddresses?.[0]?.value || '';
    const name = userInfo.names?.[0]?.displayName || 'No name';
    const googleId = userInfo.resourceName?.split('/')[1] ?? ''; // Extract googleId from resourceName
    console.log("google id", googleId);

    const profilePicture = userInfo.photos?.[0]?.url || 'No profile picture';

    const googleTokens = await googleLogin({ email, name, googleId, profilePicture });

    res.json({
      success: true,
      token: googleTokens,
      user: {
        name,
        email,
        profilePicture,
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
