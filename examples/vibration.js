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
  sensor: "vibration_sensor_1",
  location: "motor_shaft",
  sampling_rate: "1 Hz",
  kpis: {
    mean_vibration_intensity: 0.29,
    max_vibration_intensity: 0.35,
    min_vibration_intensity: 0.25,
    temperature_range: {
      min: 30,
      max: 33,
    },
    humidity_range: {
      min: 47,
      max: 50,
    },
    mean_rpm: 1537.5,
  },
  data: {
    timestamp: "2024-03-22T08:00:00",
    vibration_intensity: 10,
    x_axis: 0.2,
    y_axis: 0.1,
    z_axis: 0.2,
    unit: "g",
    temperature: 30,
    humidity: 50,
    rpm: 1500,
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
  message.data.timestamp = convertUnixTimestampToIST(Date.now());
  message.data.vibration_intensity = getRandomFloat(0.23, 0.35);
  publish(topic, JSON.stringify(message), options);
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
