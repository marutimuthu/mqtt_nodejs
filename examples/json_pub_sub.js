var mqtt = require('mqtt');
require('dotenv').config()

// Broker config
const options = {
    clientId: "mqttjs01",
    clean: true
};

// Connect to broker
var client = mqtt.connect(process.env.BROKER_URL, options)
client.on("connect", function () {
    console.log("connected  " + client.connected);
})
client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1)
});

// Publish
var message = '{"name":"John", "age":30, "city":"New York"}';
var topic = "p2l_testing";
//publish every 5 secs
var timer_id = setInterval(function () {
    publish(topic, message, options);
}, 5000);

//publish function
function publish(topic, msg, options) {
    console.log("publishing", msg);
    if (client.connected == true) {
        client.publish(topic, msg, options);
    }
}

// Subscribe
var topic_list=["p2l_testing"];
client.subscribe(topic_list,{qos:1});

// Listener
client.on('message',function(topic, message, packet){
    let rec_topic = topic;
    let rec_message = JSON.parse(message);
	console.log("message received "+ rec_message.name + " at topic " + topic);
})