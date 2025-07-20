import { SpotifyApi, type AccessToken } from "@spotify/web-api-ts-sdk";

export const clientId = "67cc68452190431085053b9055d11d8a";
// TODO read base url from environment file
const redirectUri = "http://localhost:5173/spotify-auth-callback";
const scope = "user-library-read playlist-modify-private";

function generateRandomString(length: number) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));

  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);

  return window.crypto.subtle.digest("SHA-256", data);
}

function base64encode(input: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function redirectToSpotify() {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    localStorage.setItem("spotify_code_verifier", codeVerifier);

    const params = {
        response_type: "code",
        client_id: clientId,
        scope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

async function fetchAccessToken() {
  const code = localStorage.getItem("spotify_code");
  const codeVerifier = localStorage.getItem("spotify_code_verifier");

  if (!code || !codeVerifier) {
    console.log("No Spotify code or code verifier found");
    return null;
  }

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }

  const response = await fetch(url, payload);
  const body = await response.json();

  if (response.ok) {
    localStorage.setItem("spotify_token_data", JSON.stringify(body));
  }

  return body as AccessToken;
}

export async function getAuthenticatedApi(): Promise<SpotifyApi | null> {
  const tokenData = localStorage.getItem("spotify_token_data");
  const accessToken = tokenData ?
    JSON.parse(tokenData) as AccessToken :
    await fetchAccessToken();

  if (!accessToken) return null;

  let sdk = SpotifyApi.withAccessToken(clientId, accessToken);

  try {
    console.log("fetching user profile");
    await sdk.currentUser.profile();
  } catch {
    console.log("refreshing access token");
    const newTokenData = await refreshAccessToken();

    sdk = SpotifyApi.withAccessToken(clientId, newTokenData as AccessToken);
  }

  return sdk;
}

export async function refreshAccessToken() {
  const accessTokenData = localStorage.getItem("spotify_token_data");
  if (!accessTokenData) {
    console.error("No Spotify token data found");
    return;
  }

  const refreshToken = (JSON.parse(accessTokenData) as AccessToken).refresh_token;
  if (!refreshToken) {
    console.error("No Spotify refresh token found");
    return;
  }

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId
    }),
  }
  const response = await fetch(url, payload);
  const body = await response.json();

  if (response.ok) { 
    localStorage.setItem("spotify_token_data", JSON.stringify(body));

    return body;
  } else {
    return null;
  }
}
