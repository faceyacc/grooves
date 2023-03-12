require('dotenv').config();
const express = require('express');
const { stat } = require('node:fs');
const axios = require('axios');

// Environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const querystring = require('node:querystring');
const { query } = require('express');
const app = express();

/**
 * Generates a random string containing numbers and letters
 * @param {number} length The length of the string
 * @returns {string} The generated string
 */
const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';


// Handlers
app.get('/', (req, res) => {
    const data = {
        name: "Ty",
        isAwesome: true
    };
    res.json(data);
}); 

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state)

    const scope = [
                    'user-read-private',
                    'user-read-email',
                    'user-top-read'].join(' ');

    const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope,
    });
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback', (req, res) => {
    // Get Spotify's Authorization Code
    const code = req.query.code || null; 

    axios_request_config = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            code: code,
        }),
        headers: {
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
            'content-type': 'application/x-www-form-urlencoded',
        },
    };

    // send a POST request after callback endpoint it called on
    axios(axios_request_config)
        .then(response => {
            if (response.status === 200) {
                // Get Access token from response
                const { access_token, refresh_token, expires_in } = response.data;

                const queryParams = querystring.stringify({
                    access_token,
                    refresh_token,
                    expires_in,
                });

                // Pass in Access and Refresh token from Spotify to React app
                res.redirect(`http://localhost:3001/?${queryParams}`);

            } else {
                // Fail if an invalid or no token is given
                res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`);
            }
        })
        .catch(error => {
            res.send(error);
        });
});

app.get('/refresh_token', (req, res) => {
    var refresh_token = req.query.refresh_token;

    axios_request_config = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
        }),
        headers: {
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
            'content-type': 'application/x-www-form-urlencoded',
        }
    };

    axios(axios_request_config)
        .then()
        .catch(error => {
            res.send(error);
        });
});

const port = 8889;

// Add Router to listen on port 
app.listen(port, () => {
    console.log(`Express app listening on http://localhost:${port}`)
 }); 