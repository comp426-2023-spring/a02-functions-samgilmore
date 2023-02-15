#!/usr/bin/env node
import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));

if (args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.`);
    process.exit(0);
}

//Parse latitude
var latitude;

if (args.n) {
    latitude = Math.round((args.n + Number.EPSILON) * 100) / 100;
} else {
    latitude = -Math.round((args.s + Number.EPSILON) * 100) / 100;
}

//Parse longitude
var longitude;

if (args.e) {
    longitude = Math.round((args.e + Number.EPSILON) * 100) / 100;
} else {
    longitude = -Math.round((args.w + Number.EPSILON) * 100) / 100;
}

//Parse time zone
var timezone;

if (args.z) {
    timezone = args.z;
} else {
    timezone = moment.tz.guess();
}

//Parse day
var day;

if (args.d) {
    day = args.d;
} else {
    day = 1;
}

const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=precipitation_hours`);
const data = await response.json();

//Echo pretty JSON from open-meteo API and exit.
if (args.j) {
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
}

// const msg = day === 0 ? "today" : day === 1 ? "tomorrow" : `in ${day} days`;
// const precipitation_hours = data.daily.precipitation_hours[day];
// console.log(`You ${precipitation_hours === 0 ? "won't" : "might"} need your galoshes ${msg}.`);

var msg;
if (day == 0) {
    msg ="today.";
} else if (day > 1) {
    msg = "in " + day + " days.";
} else {
    msg = "tomorrow.";
}

if (data.daily.precipitation_hours[day] == 0) {
    console.log("You won't need your galoshes " + msg);
} else {
    console.log("You might need your galoshes " + msg);
}