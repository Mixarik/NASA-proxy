//some problems with SSL certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const router = express.Router();
const needle = require('needle');

//Env vars
const API_BASE_URL = "https://api.nasa.gov/neo/rest/v1/feed";
const API_KEY_NAME = "api_key";
const API_KEY_VALUE = "cSZhruTYTjIDDmpTmvbfozr6eVmc7rz7wncZwUQ0";


router.get("/", async (req, res) => {

    try{
        const params = new URLSearchParams({
            [API_KEY_NAME]:API_KEY_VALUE
        });
        console.log(`${API_BASE_URL}?${params}`);
        const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
        const data = apiRes.body;

        res.status(200).json(data)
    } catch (e) {
        res.status(500).json(e)
    }

});

module.exports = router;
