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

const latitude = args.n || -args.s;
const longitude = args.e || -args.w;
const timezone = args.z || moment.tz.guess();
const day = args.d === 0 || args.d ? args.d : 1;

const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=precipitation_hours`);
const data = await response.json();

//Echo pretty JSON from open-meteo API and exit.
if (args.j) {
    console.log(data);
    process.exit(0);
}

const msg = day === 0 ? "today" : day === 1 ? "tomorrow" : `in ${day} days`;
const precipitation_hours = data.daily.precipitation_hours[day];
console.log(`You ${precipitation_hours === 0 ? "won't" : "might"} need your galoshes ${msg}.`);