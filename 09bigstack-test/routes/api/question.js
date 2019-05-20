const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({question:'question is success'});
});

module.exports = router;