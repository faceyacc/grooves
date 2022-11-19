require('dotenv').config();

console.log(process.env.CLIENT_ID);

// Environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const express = require('express');
const querystring = require('node:querystring');
const app = express();

// Handlers
app.get('/', (req, res) => {
    const data = {
        name: "Ty",
        isAwesome: true
    };
    res.json(data);
}); 

app.get('/login', (req, res) => {
    res.redirect(
        'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id : CLIENT_ID,
            redirect_uri: REDIRECT_URI,
        }));
  });

const port = 8888;

// Add Router to listen on port 
app.listen(port, () => {
    console.log(`Express app listening on http://localhost:${port}`)
}); 