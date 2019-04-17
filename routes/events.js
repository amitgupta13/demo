const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
var deeplink = require('node-deeplink');

router.post('/', [auth, admin], events.createEvent);
router.post('/imageupload', events.uploadImage);
router.get('/', events.events);
router.get('/deeplink', deeplink({
    fallback: 'https://play.google.com/store?hl=en',
    android_package_name: 'test',
    // ios_store_link:
    //   'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4'
  }));

module.exports = router;

