// Reference: http://www.steves-internet-guide.com/using-node-mqtt-client/
var mqtt = require('mqtt');
require('dotenv').config()

const device_id = "test_node_2"
const post_interval = 5000
var topic = `realtime`;

// Broker config
const options = {
    clientId: device_id,
    clean: true,
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD
};
 
// Connect to broker
var client = mqtt.connect(process.env.BROKER_URL, options)
client.on("connect", function () {
    console.log("🚀 Broker connection status:  " + client.connected);
})
client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1)
});

// Subscribe
var topic_list = ["data"];
client.subscribe(topic_list, { qos: 1 });

// Listener
client.on('message', function (topic, message, packet) {
    console.log("-[ message received: " + message + " at topic " + topic);
});