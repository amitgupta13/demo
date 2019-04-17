var FCM = require('fcm-node');
var serverKey = 'AAAAp0JYA7c:APA91bH4_qAIDpM1y8FZEonHsTZnb2oy1UqHyEfIIPlVIE8CFBfyjM5MmVhRn17kYo4QqIVDrvrb3ESkx82j26dhIjLKjElQvbpBfDG0JG9ZxbNHXt9CYpel1OkNxEUlMLwbOC98-V81'; //put your server key here
var fcm = new FCM(serverKey);

 
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: 'eSrjzuhuCeY:APA91bGiAIoS8gqQtl8eiP2mlPCwoweXXUwH05CgSi6TdAV6Q1uBnznzJ0dfPhy9IBxhej7BOPRqY1hVMQt0hFUy4tCBlvlEcuJv07D3SncJ0Ysr50LTng_srU0KEG8oosAIUQmPS3e6',
        
        notification: {
            title: 'bet has ended. Please click here to declare results.' 
        }
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });