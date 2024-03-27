var mqtt = require("mqtt");
require("dotenv").config();

// Broker config
const options = {
  clientId: "mqttjs01",
  clean: true,
};

// Connect to broker
var client = mqtt.connect(process.env.BROKER_URL, options);
client.on("connect", function () {
  console.log("connected  " + client.connected);
});
client.on("error", function (error) {
  console.log("Can't connect" + error);
  process.exit(1);
});

function getRandomFloat(min, max) {
  const randomNumber = Math.random() * (max - min) + min;
  return parseFloat(randomNumber.toFixed(2));
}

// Publish
var message = {
  device: "energy_meter",
  location: "motor_1",
  data: {
    timestamp: "2024-03-22T08:00:00",
    phase_1_voltage: 220,
    phase_1_current: 10,
    phase_1_power: 2200,
    phase_2_voltage: 225,
    phase_2_current: 11,
    phase_2_power: 2475,
    phase_3_voltage: 230,
    phase_3_current: 9,
    phase_3_power: 2070,
    total_power: 6645,
    energy_consumption: 100,
    unit: {
      voltage: "V",
      current: "A",
      power: "W",
      energy_consumption: "kWh",
    },
  },
};

function convertUnixTimestampToIST(unixTimestamp) {
  // Create a Date object using the Unix timestamp (in milliseconds)
  const date = new Date(unixTimestamp);
  // Get the options for date formatting
  const options = {
    timeZone: "Asia/Kolkata", // Set the timezone to IST
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3, // Include milliseconds
  };

  // Format the date string according to the options
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
    ,
    { value: hour },
    ,
    { value: minute },
    ,
    { value: second },
    ,
    { value: millisecond },
  ] = formatter.formatToParts(date);

  // Construct the formatted date string
  const formattedDate = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`;

  return formattedDate;
}

var topic = "vibration_sensor1";
//publish every 5 secs
var timer_id = setInterval(function () {
  message.data[0].timestamp = convertUnixTimestampToIST(Date.now());
  message.data[0].vibration_intensity = getRandomFloat(0.23, 0.35);
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
var topic_list = ["vibration_sensor1"];
client.subscribe(topic_list, { qos: 1 });

// Listener
client.on("message", function (topic, message, packet) {
  let rec_topic = topic;
  let rec_message = JSON.parse(message);
  console.log("message received " + rec_message.name + " at topic " + topic);
});
