// Reference: http://www.steves-internet-guide.com/using-node-mqtt-client/

var mqtt = require('mqtt');

// Broker config
const url = "mqtt://192.168.1.118:1883";
const options = {
    clientId: "mqttjs01",
    username: "",
    password: "",
    clean: true
};

// Connect to broker
var client = mqtt.connect(url, options)
client.on("connect", function () {
    console.log("connected  " + client.connected);
})
client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1)
});

// Publish
var message = "test message";
var topic = "testtopic";
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
var topic_list=["testtopic","topic3","topic4"];
client.subscribe(topic_list,{qos:1});

// Listener
client.on('message',function(topic, message, packet){
	console.log("message received "+ message + " at topic " + topic);
	// console.log("topic  "+ topic);
});