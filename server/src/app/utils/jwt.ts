// jwt.ts

import {sign} from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import {User} from '@db';

dotenv.config();

/**
 * 
Access Token:

- Short-Lived: Access tokens have a relatively short lifespan, often lasting just a few minutes to a few hours.
- Authorization: They are used to grant access to specific resources or perform actions on behalf of a user.
- Reduced Security Risk: Because they have a short lifespan, even if they are compromised, the exposure is limited in time.
- Stateless Authentication: Access tokens allow stateless authentication, meaning the server doesn't need to store session information for each user. The token contains all the necessary information for authorization.

Use Cases:
- Accessing APIs or protected routes.
- Authorizing a user to perform actions, like creating, updating, or deleting data.
*/
export const ACCESS_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
if (!ACCESS_TOKEN_SECRET) {
  throw 'ACCESS TOKEN SECRET required';
}
export const generateAccessToken = ({email}: User) => {
  return sign({email}, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

/**
 * 
Refresh Token:

- Long-Lived: Refresh tokens have a longer lifespan, potentially weeks or months.
- Securely Obtaining New Access Tokens: They are used to obtain new access tokens when the previous access token expires.
- Stored Securely: Refresh tokens are usually stored on the client-side in a secure HTTP-only cookie or a local storage mechanism.
- Reduced Password Exposure: Refresh tokens can help reduce the exposure of the user's credentials (username and password) since they are used less frequently.
- Enhanced Security: If a refresh token is compromised, the attacker can only obtain new access tokens but not the user's credentials.

Use Cases:
- Keeping a user authenticated over a longer period without requiring frequent login.
- Managing access tokens for long-running sessions, such as in mobile or single-page applications.
- Reducing the need for users to repeatedly log in.
 */
export const REFRESH_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
if (!REFRESH_TOKEN_SECRET) {
  throw 'REFRESH TOKEN SECRET required';
}

export const generateRefreshToken = ({email}: User) => {
  return sign({email}, REFRESH_TOKEN_SECRET);
};
