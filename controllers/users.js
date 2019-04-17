const db = require('../models/all-models');
const jwt = require('jsonwebtoken');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('7a747c6c509b4565a3d8127616523271');
const authy = require('authy')('KhEtEQaqrfCMk83IRKgSbY2ipTW7gKh5');

module.exports = {
    signUp:signUp,
    googleApi:googleApi,
    login:login,
    sendOtp:sendOtp,
    verifyOtp:verifyOtp,
    profile:profile
    }

/*

Sports news API
Author-Amit Gupta

*/
// async function googleApi(req, res){
//     // console.log(newsapi.v2.topHeadlines[0]);
//     newsapi.v2.topHeadlines({
//   category: 'sports',
//   language: 'en',
//   country: 'gb'
// }).then(response => {
//   // console.log(response);
//   res.status(200).json({
//     status:'success',
//     news:response
//   });
 
// });
// }

/*

Sports news API
Author-Amit Gupta

*/
async function googleApi(req, res){
    newsapi.v2.everything({
        q: 'sports',
        sources: 'bbc-news,the-verge',
        domains: 'bbc.co.uk,techcrunch.com',
        language: 'en',
        sortBy: 'relevancy',
        page: 2
      }).then(response => {
        res.status(200).json({
            status:'success',
            news:response
        });
      });
}

/*

sendOtp API
Author-Amit Gupta

*/
async function sendOtp(req, res){
    authy.phones().verification_start(req.body.phone, req.body.countryCode, { via: 'sms', locale: 'en', code_length: '6' }, function(error, response) {
        if(error) return res.status(422).json({
            status:'failed',
            data:error
        });

            return res.status(200).json({
                status:'success',
                data:{
                    phone:req.body.phone
                },
                message:response
            });
    });
}

/*

verifyOTP API
Author-Amit Gupta

*/
async function verifyOtp(req, res){
        const user = await db.User.findOne({phone:req.body.phone});

            if(!user){
                authy.phones().verification_check(req.body.phone, req.body.countryCode, req.body.otp, async function (error, response) {
                    if(error) return res.status(422).json({
                        status:'failed',
                        data:error
                    });
        
                    res.status(200).json({
                        status:'success',
                        data:{
                            isVerified:true,
                            phone:req.body.phone
                        },
                        message:response
                    });
            });
            }else{
                const token = await jwt.sign({userId:user.userId, isAdmin:user.isAdmin},'jwtPrivateKey');
                authy.phones().verification_check(req.body.phone, req.body.countryCode, req.body.otp, async function (error, response) {
                    if(error) return res.status(422).json({
                        status:'failed',
                        data:error
                    });
        
                    res.header('x-auth-token', token).status(200).json({
                        status:'success',
                        token:token,
                        data:user
                    });
            });
            }
       
}

/*

signup API
Author-Amit Gupta

*/
async function signUp(req, res){
    let user = await db.User.findOne({phone:req.body.phone});

        if(!user){
            authy.phones().verification_status(req.body.phone , req.body.countryCode, async function (error, response) {
                if(error) return res.status(422).json({
                    status:'failed',
                    message:'You are not verified'
                });
                        
                    user = new db.User({
                    name:req.body.name,
                    phone:req.body.phone,
                    countryCode:req.body.countryCode,
                    deviceId:req.body.deviceId,
                    deviceType:req.body.deviceType,
                    profileImage:req.body.profileImage,
                    verified:true,
                    isAdmin:req.body.isAdmin
                    });

                    await user.save();

                    const token = await jwt.sign({userId:user.userId, isAdmin:user.isAdmin},'jwtPrivateKey');

                    res.header('x-auth-token', token).status(200).json({
                        status:'success',
                        message:'User Registered Successfully',
                        token:token,
                        data:user
                    });

            });
        }else{
            res.status(422).json({
                status:'failed',
                message:'User is Already registered'
                });
            }
}


/*

login API
Author-Amit Gupta

*/
async function login(req, res){
    const user = await db.User.findOne({phone:req.body.phone});
        if(!user) return res.status(422).json({
            status:'failed',
            message:'U are not registered please signup'
        });

        const token = await jwt.sign({userId:user.userId, isAdmin:user.isAdmin},'jwtPrivateKey');

        authy.phones().verification_status(req.body.phone, user.countryCode, function (error, response) {
            if(error) return res.status(422).json({
                status:'failed',
                data:error
            });
                   
                    return res.header('x-auth-token', token).status(200).json({
                    status:'success',
                    token:token,
                    data:user
                    });
        });
}

/*

user profile API
Author-Amit Gupta

*/
async function profile(req,res){
    let user = await db.User.findOne({phone:req.body.phone});
        if(!user) return res.status(422).json({
            status:'failed',
            message:'User not found'
        });

        res.status(200).json({
            status:'success',
            data:{
                betPlaced:user.betPlaced,
                betsPlayed:user.betsPlayed,
                winnings:user.winnings
            }
        });
}