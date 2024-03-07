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

    try {
        const params = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE
        });
        const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
        const data = apiRes.body.near_earth_objects;

        const filteredData = Object.keys(data).reduce((acc, key) => {
            acc[key] = data[key].map(object => {
                return {
                    id: object.id,
                    estimated_diameter_meters: object.estimated_diameter.meters,
                    is_potentially_hazardous_asteroid: object.is_potentially_hazardous_asteroid,
                    close_approach_date_full: object.close_approach_data
                        .map(el => el.close_approach_date_full)
                        .join(''),
                    relative_velocity_kilometers_per_second: object.close_approach_data
                        .map(el => el.relative_velocity.kilometers_per_second)
                        .join('')
                }
            });
            return acc
        }, {});
        console.log(filteredData);

        res.status(200).send(data);
    } catch (e) {
        res.status(500).json(e)
    }

});

module.exports = router;
