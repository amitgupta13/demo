var FCM = require('fcm-node');
var serverKey = 'AAAAp0JYA7c:APA91bH4_qAIDpM1y8FZEonHsTZnb2oy1UqHyEfIIPlVIE8CFBfyjM5MmVhRn17kYo4QqIVDrvrb3ESkx82j26dhIjLKjElQvbpBfDG0JG9ZxbNHXt9CYpel1OkNxEUlMLwbOC98-V81'; //put your server key here
var fcm = new FCM(serverKey);

module.exports = function(token, title){
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,

         notification: {
            title: title,
            sound:'default'
        }

    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}