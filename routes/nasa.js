//some problems with SSL certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const needle = require('needle');
const Joi = require('joi');

const schema = require('../middleware/validationSchemes');

const router = express.Router();

//Env vars
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const START_DATE = process.env.START_DATE;
const END_DATE = process.env.END_DATE;
const WERE_DANGEROUS_METEORS = process.env.WERE_DANGEROUS_METEORS;


//request to all NASA meteors and simplify filter
router.get("/meteors", async (req, res) => {
    const queryParams = req.query;
    try {
        const params = new URLSearchParams({});

        queryParams.hasOwnProperty(START_DATE) && params.append([START_DATE], queryParams[START_DATE]);
        queryParams.hasOwnProperty(END_DATE) && params.append([END_DATE], queryParams[END_DATE]);
        queryParams.hasOwnProperty(API_KEY_NAME) && params.append([API_KEY_NAME], queryParams[API_KEY_NAME]);

        const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
        const data = apiRes.body.near_earth_objects;

        const simplifyStructureMeteor = (object) => {
            return {
                id: object.id,
                estimated_diameter_meters: object.estimated_diameter.meters,
                is_potentially_hazardous_asteroid: object.is_potentially_hazardous_asteroid,
                close_approach_date_full: object.close_approach_data
                    .map(el => el.close_approach_date_full),
                relative_velocity_kilometers_per_second: object.close_approach_data
                    .map(el => el.relative_velocity.kilometers_per_second)
            }
        };

        const filteredData = Object.keys(data).reduce((acc, key) => {
            const meteorQueryParams = data[key].filter(object => {
                if (queryParams.hasOwnProperty(WERE_DANGEROUS_METEORS) && queryParams[WERE_DANGEROUS_METEORS] === 'true') {
                    return object.is_potentially_hazardous_asteroid === true && simplifyStructureMeteor(object);
                }

                if (queryParams.hasOwnProperty(WERE_DANGEROUS_METEORS) && queryParams[WERE_DANGEROUS_METEORS] === 'false') {
                    return object.is_potentially_hazardous_asteroid === false && simplifyStructureMeteor(object)
                }

                if (!queryParams.hasOwnProperty(WERE_DANGEROUS_METEORS)) {
                    return simplifyStructureMeteor(object)
                }
            });

            if (meteorQueryParams.length) acc[key] = meteorQueryParams;


            return acc
        }, {});

        res.status(200).send({filteredData});
    } catch (e) {
        res.status(500).json(e)
    }

});

router.post('/rover', async (req, res) => {
    const data = req.body;
    const {error} = schema.validate(data);
    if (error) {
        res.status(404).send(error.details[0].message);
    } else res.status(200).send('http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG');
    console.log(res.statusCode)
});


module.exports = router;
