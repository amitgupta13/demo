const express = require('express');
const router = express.Router();
const bets = require('../controllers/bets');
const validation = require('../validation/validation');
const auth = require('../middleware/auth');

router.post('/createbet',auth, validation.betValidation, bets.createBet);
router.post('/result',auth, validation.resultValidation, bets.result);
router.post('/',auth, validation.getBetsValidation, bets.getBets);
router.post('/betdetails',auth, validation.getBetValidation, bets.getBet);
// router.post('/send',auth, bets.notification);
router.get('/', bets.discoverBets);
router.post('/adminbets', bets.adminBets);

module.exports = router;
