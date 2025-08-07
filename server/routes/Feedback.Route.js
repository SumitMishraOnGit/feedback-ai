const express = require('express');
const port = 3000;
const router = express.Router();

router.get('/api/feedback', (req, res) => {
      res.send().statusCode(200);
});

router.post('/api/feedback', (req, res) => {
      res.send().statusCode(200);
});

router.listen(port, () => {
      console.log(`listening on port ${port}`);
});

module.exports = Routes;