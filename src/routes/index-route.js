'use strict'

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        title: global.PROJECT_NAME,
        version: global.PROJECT_VERSION
    });
});

module.exports = router;