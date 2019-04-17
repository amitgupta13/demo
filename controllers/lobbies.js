const db = require('../models/all-models');
const rand = require('random-number');
const fcm = require('../middleware/fcm');

module.exports = {
 	createLobby:createLobby,
 	joinLobby:joinLobby,
	winner:winner,
	getLobbies:getLobbies,
	getLobby:getLobby,
	getPlayers:getPlayers,
	getWinners:getWinners,
	lobby:lobby
}

/*

lobby creation by a particular user
Author-Amit Gupta

*/
async function createLobby(req, res){

	let user = await db.User.findOne({userId:req.body.userId});
		if(!user) return res.status(422).json({message:'user not found'});
	
	let bet = await db.Bet.findOne({betId:req.body.betId});
		if(!bet) return res.status(422).json({message:'bet not found'});

	let options = {
	             	min: 100000,
	             	max: 999999,
	             	integer: true
	         		} 

 	let lobbyId = await rand(options);

	let lobby = new db.Lobby({
		userId:user.userId,
		betId:bet.betId,
		lobbyId:lobbyId,
		profileImage:user.profileImage,
		name:user.name,
		betDetails:bet.betDetails,
		endDate:bet.endDate,
		stake:bet.stake,
		currencyIcon:bet.currencyIcon,
		answers:bet.answers
	});

	lobby.participants++

	await lobby.save();

	let player = new db.Players({
		lid:lobby.lid,
		userId:lobby.userId,
		betId:lobby.betId,
		answer:req.body.answer,
		lobbyId:lobby.lobbyId,
		profileImage:user.profileImage,
		name:user.name,
		deviceId:user.deviceId
	});

	await player.save();

		user.lobbyId = lobbyId;
		user.betPlaced++;
		user.betsPlayed++;

	await user.save();

	res.status(200).json({
		status:'success',
		message:'lobby created',
		data:lobby
	});
}

/*

functionality for user to join a particular lobby
Author-Amit Gupta

*/
async function joinLobby(req, res){
	let user = await db.User.findOne({userId:req.body.userId});

		if(!user) return res.status(422).json({
			message:'User not Found'
		});

		user.lobbyId = req.body.lobbyId;

		const lobby = await db.Lobby.findOne({lobbyId:user.lobbyId});

			if(!lobby) return res.status(422).json({
				message:'Invalid lobbyId'
			});

			const players = await db.Players.findOne({userId:user.userId, lobbyId:lobby.lobbyId});
				if(players) return res.status(409).json({
					message:'You are already in lobby'
				});

					let player = new db.Players({
						lid:lobby.lid,
						userId:user.userId,
						betId:lobby.betId,
						answer:req.body.answer,
						lobbyId:lobby.lobbyId,
						profileImage:user.profileImage,
						name:user.name,
						deviceId:user.deviceId
					});

					await player.save();

					user.betsPlayed++;

					await user.save();

					lobby.participants++;
					await lobby.save();

					res.status(200).json({
						status:'success',
						message:'user joined',
						data:player
					});
}

/*

Winner declaration by admin
Author-Amit Gupta

*/
async function winner(req, res){
	const players = await db.Players.find({lid:req.body.lid});

		if(players.length == 0) return res.status(422).json({
			message:'lobby with given id is empty or does not exist'
		});

			const bet = await db.Bet.findOne({betId:players[0].betId});

				if(!bet) return res.status(422).json({
					message:'Bet does not exist'
				});

			let winners = await db.Winners.find({lid:players[0].lid});
			
				if(winners.length > 0) return res.status(409).json({
					message:'result already declared',
					data:{
						winners:winners
					}
				});

			for(player of players){
				let user = await db.User.findOne({userId:player.userId});
				if(player.answer == bet.result){
					let winner = new db.Winners({
						userId:player.userId,
						lid:player.lid,
						betId:player.betId,
						answer:player.answer,
						profileImage:player.profileImage,
						name:player.name
					});

						await winner.save();

						user.winnings++;
						await user.save();
				}
				fcm(player.deviceId, 'Winners declared for a bet you participated in. Click here to view the results.');
			}

			winners = await db.Winners.find({lid:players[0].lid});

			if(winners.length == 0) return res.status(422).json({
				message:'no winners'
			});

					playerCount = players.length;
					winnerCount = winners.length;
					stake = bet.stake;
					winnings = (stake*playerCount)/winnerCount

					for(winner of winners){
						winner.winnings = winnings;
						await winner.save();
					}

					res.status(200).json({
						status:'success',
						message:'result declared',
						data:winners
					});
}

/*

get lobbies created by a particular user
Author-Amit Gupta

*/
async function getLobbies(req, res){
	const lobbies = await db.Lobby.find({userId:req.body.userId})
									.sort('-createdAt');
		if(lobbies.length == 0) return res.status(422).json({
			status:'failed',
			message:'no lobbies found'
		});

		return res.status(200).json({
			status:'success',
			data:{
				lobbies:lobbies
			}
		});
}

/*

get a particular lobby
Author-Amit Gupta

*/
async function getLobby(req, res){
	const user = await db.User.findOne({userId:req.body.userId});
			if(!user) return res.status(422).json({
				message:'user not found'
			});

	const lobby = await db.Lobby.findOne({lid:req.body.lid});
		if(!lobby) return res.status(422).json({
			status:'failed',
			message:'lobby not found'
		});

		if(user.userId == lobby.userId) return res.status(200).json({
			status:'success',
			data:lobby
		});
		
		return res.status(422).json({
			message:'mismatch'
		});
}

/*

get player list associated to a particular lobby
Author-Amit Gupta

*/
async function getPlayers(req,res){
	const players = await db.Players.find({lid:req.body.lid});
		if(players.length == 0) return res.status(422).json({
			status:'failed',
			message:'no players found'
		});

		res.status(200).json({
			status:'success',
			data:{
				players:players
			}
		})
}

/*

get winner list associated to a particular lobby
Author-Amit Gupta

*/
async function getWinners(req,res){
	const winners = await db.Winners.find({lid:req.body.lid});
		if(winners.length == 0) return res.status(422).json({
			status:'failed',
			message:'no winners found'
		});

		res.status(200).json({
			status:'success',
			data:{
				winners:winners
			}
		})
}

async function lobby(req, res){
	const lobby = await db.Lobby.findOne({lobbyId:req.body.lobbyId});
		if(!lobby) return res.status(422).json({
			status:'failed',
			message:'No Lobby Found'
		});

			res.status(200).json({
				status:'success',
				data:lobby
			});
}