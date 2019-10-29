const router = require('express').Router();

const db = require('../data/db');

router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
})


module.exports = router;