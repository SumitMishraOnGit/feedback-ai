const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
      res.send().statusCode(200);
});

router.post('/', (req, res) => {
      res.send().statusCode(200);
});

module.exports = router;