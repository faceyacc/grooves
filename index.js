require('dotenv').config();
const express = require('express');
const { stat } = require('node:fs');
const axios = require('axios');

// Environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const querystring = require('node:querystring');
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
    const scope = 'user-read-private user-read-email';

    res.redirect(
        'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id : CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            state: state, 
            scope: scope,
        }));
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

    // send a POST request after callback endpoint it called on.
    axios(axios_request_config)
        .then(response => {
            if (response.status === 200) {
                // Get Access token from response
                const { access_token, token_type } = response.data;

                // Get Info about user 
                axios.get('https://api.spotify.com/v1/me', {
                    headers: {
                        Authorization: `${token_type} ${access_token}`
                    }
                })
                    .then(response => {
                        res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`)
                    })
                    .catch(error => {
                        res.send(error);
                    })
            } else {
                res.send(response);
            }
        })
        .catch(error => {
            res.send(error);
        });
    
});

const port = 8888;

// Add Router to listen on port 
app.listen(port, () => {
    console.log(`Express app listening on http://localhost:${port}`)
}); 