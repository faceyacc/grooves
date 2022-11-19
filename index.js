const express = require('express');

const app = express();


app.get('/', (req, res) => {
    const data = {
        name: "Ty",
        isAwesome: true
    };
    res.json(data);
}); 

const port = 8888;
app.listen(port, () => {
    console.log(`Express app listening on http://localhost:${port}`)
}); 