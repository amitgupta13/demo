var express = require('express');
var router = express.Router();
var lobbies = require('../controllers/lobbies');
var validation = require('../validation/validation');
const auth = require('../middleware/auth');

router.post('/createlobby', auth, validation.playerValidation, lobbies.createLobby);
router.post('/join', auth, validation.joinValidation, lobbies.joinLobby);
router.post('/winner', auth, validation.winnerValidation, lobbies.winner);
router.post('/', auth, lobbies.getLobbies);
router.post('/lobbydetails', auth, lobbies.getLobby);
router.post('/players', auth, lobbies.getPlayers);
router.post('/winners', auth, lobbies.getWinners);
router.post('/lobby', lobbies.lobby);

module.exports = router;