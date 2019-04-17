const db = require('../models/all-models');
const helper = require('./helper');

module.exports = {
    createEvent:createEvent,
    uploadImage:uploadImage,
    events:events
}

/*

Event creation by admin
Author-Amit Gupta

*/
async function createEvent(req, res){
    let events = new db.Events({
        eventImage:req.body.eventImage,
        description:req.body.description,
        startDate:req.body.startDate
    });

    await events.save();

    res.status(200).json({
        status:'success',
        message:'event created',
        data:events
    });
}

/*

Upload Image to s3 server
Author-Amit Gupta

*/
async function uploadImage(req,res){

    const base64Data = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ""), 'base64')
     const type = 'jpg';
     
     var d = new Date();
     var n = d.getTime();
    let data = {
        key:n+'.'+type,
        body:base64Data
    }
    const imgUpload = await helper.s3upload(data);

    res.status(200).json({
        status:'success',
        message:'image upload saved',
        data:imgUpload
    });

}

/*

Event creation by admin
Author-Amit Gupta

*/
async function events(req,res){
    const events = await db.Events.find({});
        if(events.length == 0) return res.status(422).json({
            status:'failed',
            message:'No recent events yet'
        });

        res.status(200).json({
            status:'success',
            data:{
                events:events
            }
        });
}