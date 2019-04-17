const schedule = require('node-schedule');
const db = require('../models/all-models');
// const helper = require('./helper');
const fcm = require('../middleware/fcm');
/*

Export all functionalities for being used in the routes

*/
module.exports = {
	createBet:createBet,
	result:result,
	getBets:getBets,
	getBet:getBet,
	// notification:notification,
	discoverBets:discoverBets,
	adminBets:adminBets
}

/*

Get bets created by a particular user
Author-Amit Gupta

*/
async function getBets(req, res){

	const date = new Date();
	
	const bets = await db.Bet.find({userId:req.body.userId, endDate:{"$gte":date}});
		if(bets.length == 0) return res.status(503).json({
										status:'failed',
										message:'No bets found'
									});

		res.status(200).json({
			status:'success',
			data:{
				bets:bets
			}
		});
}

/*

Bet creation function by user
Author-Amit Gupta

*/
async function createBet(req, res){

	const user = await db.User.findOne({userId:req.body.userId});

	if(!user) return res.status(422).json({message:'Invalid User'});

	let bet = new db.Bet({
		userId:user.userId,
		creator:user.name,
		betDetails:req.body.betDetails,
		answers:req.body.answers,
		endDate:req.body.endDate,
		stake:req.body.stake,
		currencyIcon:req.body.currencyIcon,
		adminBet:user.isAdmin
	});

		bet = await bet.save();

			res.status(200).json({
			status:'success',
			message:'bet created',
			data:bet
		});

		schedule.scheduleJob(bet.endDate, function(){
			fcm(user.deviceId, `${bet.betDetails} has ended. Please click here to declare results.`);
		  });
}

/*

Result updation of bet by user who created the bet
Author-Amit Gupta

*/
async function result(req, res, next){
	const user = await db.User.findOne({userId:req.body.userId});
		if(!user) return res.status(422).json({
			status:'failed',
			message:'user not found'
		});

	var bet = await db.Bet.findOne({betId:req.body.betId});
		if(!bet) return res.status(422).json({
			status:'failed',
			message:'bet not found'
		});

		if(bet.userId == user.userId){
			bet.result = req.body.result;
			bet = await bet.save();

	const lobbies = await db.Lobby.find({betId:bet.betId});
		
		for(lobby of lobbies){
			lobby.result = bet.result;
			await lobby.save();
		}

		return res.status(200).json({
			status:'success',
			message:'result declared',
			data:bet
		});
		}
		
		return res.status(422).json({
			status:'failed',
			message:'mismatch'
		});
}

/*

get a particular bet created by User
Author-Amit Gupta

*/
async function getBet(req, res){
	const user = await db.User.findOne({userId:req.body.userId});
			if(!user) return res.status(422).json({
				message:'user not found'
			});

	const bet = await db.Bet.findOne({betId:req.body.betId});
		if(!bet) return res.status(422).json({
			message:'bet not found'
		});

		if(user.userId == bet.userId) return res.status(200).json({
			status:'success',
			data:bet
		});
		
		return res.status(422).json({
			message:'mismatch'
		});
}

/*

Function used for sending notification to user
Author-Amit Gupta

*/
// async function notification(req,res){
// 	const bet = await db.Bet.findOne({betId:req.body.betId});
// 		if(!bet) return res.status(422).json({
// 			status:'failed',
// 			message:'bet not found'
// 		});

// 	const user = await db.User.findOne({userId:bet.userId});
// 		if(!user) return res.status(422).json({
// 			status:'failed',
// 			message:'user not found'
// 		});

// 			let endDate = bet.endDate;
// 			let currentDate = Date.now();

// 			var diff = endDate.getTime() - currentDate

// 	setTimeout(() => {
// 		console.log(endDate.getTime(), currentDate, diff);
// 		console.log(moment(endDate).diff(moment()));
// 		console.log(moment(endDate).format());
// 	}, moment());
// }

/*

Function used for getting admin created bets
Author-Amit Gupta

*/
async function discoverBets(req,res){
	const bets = await db.Bet.find({adminBet:true});
		if(bets.length == 0) return res.status(422).json({
			status:'failed',
			message:'no bets yet discover again later'
		});

			res.status(200).json({
				status:'success',
				data:{
					profileImage:'test',
					bets:bets
				}
			});
}

/*

Function used for getting admin created single bet
Author-Amit Gupta

*/
async function adminBets(req, res){
	const bet = await db.Bet.findOne({
		betId:req.body.betId
	});

		if(!bet) return res.status(422).json({
			status:'false',
			message:'Bet not Found'
		});

			if(bet.adminBet == true) return res.status(200).json({
				status:'success',
				data:bet
			});

				return res.status(401).json({
					status:'failed',
					message:'Given bet is not admin bet'
				});
}

// async function notification(req, res){
// 	const bet = await db.Bet.findOne({betId:req.body.betId});
// 		if(!bet) return res.status(422).json({
// 			status:'failed',
// 			message:'bet not found'		
// 		});

// 			const user = await db.User.findOne({userId:bet.userId});

// 				if(!user) return res.status(422).json({
// 					status:'failed',
// 					message:'User not found'
// 				});

// 					const date = new Date();
// 					const endDate = bet.endDate;

// 					diff = endDate.getTime() - date.getTime();

// 					if(diff <= 0) {
// 						helper.sendPush('please declare result of bet', 'bet end date arrived', user.deviceId);

// 							res.status(200).json({
// 								status:'success',
// 								message:'notification sent'
// 							});
// 					}else{
// 							res.status(422).json({
// 								status:'failed',
// 								message:'bet date has not arrived yet'
// 							});
// 					}	
// }