//some problems with SSL certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const router = express.Router();
const needle = require('needle');

//Env vars
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const START_DATE = process.env.START_DATE;
const START_DATE_VALUE = process.env.START_DATE_VALUE;
const END_DATE = process.env.END_DATE;
const END_DATE_VALUE = process.env.END_DATE_VALUE;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

//request to all NASA meteors and simplify filter
router.get("/", async (req, res) => {
    console.log(req.query.keyword)
    try {
        const params = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE,
            [START_DATE]:START_DATE_VALUE,
            [END_DATE]:END_DATE_VALUE
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
                        .map(el => el.close_approach_date_full),
                    relative_velocity_kilometers_per_second: object.close_approach_data
                        .map(el => el.relative_velocity.kilometers_per_second)
                }
            });
            return acc
        }, {});
        console.log(filteredData);

        res.status(200).send(filteredData);
    } catch (e) {
        res.status(500).json(e)
    }

});

module.exports = router;
