// init project
const http = require('http');
const express = require('express');
const Discord = require("discord.js");
const rp = require("request-promise");
const fs = require("fs");
const { prefix, token } = require("./config.json");
const nameList = require('./nameList.json');

const app = express();
const client = new Discord.Client({ fetchAllMembers: true });

app.use(express.static('public'));

app.get('/', function (request, response) {
	console.log(Date.now() + " Ping Received");
	response.send(nameList);
});

var listener = app.listen(process.env.PORT, function () {
	console.log('Your app is listening on port ' + listener.address().port);
});

setInterval(() => {
	http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
	console.log("Pinged");
}, 250000);

client.on("ready", () => {
	console.log("Ready!");
	client.user.setActivity("THPS6");
	console.log(process.env.TOKEN);
	client.user.setPresence({
		game: {
			name: "with Tampa Skip",
			type: "PLAYING"
		}
	});
});

let streamChannel = "254766904869257217";


//Parse a user's message and return the parameters
function getParams(msg) {
	let splitMsg = msg.content.split(" ");
	if (splitMsg.length === 1) {
		return "";
	} else {
		return splitMsg[1].toLowerCase();
	}
}


function escapeString(input) {
	let stringArr = input.split("");
	for(let stringChar in stringArr){
		if(stringArr[stringChar] == "_"){
			stringArr[stringChar] = "\\_";
		}
	}
	return stringArr.join("");
}


let msgFlags = [];

function getStream(name) {
	let userOptions = {
		uri: 'https://api.twitch.tv/helix/streams?user_login=' + name,
		headers: {
			'Client-ID': '38t6rewgzo0f55htonkb79uoynt7lp'
		},
		json: true
	};

	rp(userOptions)
		.then(function (result) {
			if (result.data[0]) {
				let gameName = "Unknown";
				let gameID = result.data[0].game_id;
				switch (gameID) {
					case "6626": gameName = "Tony Hawk's Pro Skater"; break;
					case "914": gameName = "Tony Hawk's Pro Skater 2"; break;
					case "11659": gameName = "Tony Hawk's Pro Skater 2x"; break;
					case "5217": gameName = "Tony Hawk's Pro Skater 3"; break;
					case "1925": gameName = "Tony Hawk's Pro Skater 4"; break;
					case "13666": gameName = "Tony Hawk's Underground"; break;
					case "1365": gameName = "Tony Hawk's Underground 2"; break;
					case "6607": gameName = "Tony Hawk's American Wasteland"; break;
					case "11102": gameName = "Tony Hawk's Project 8"; break;
					case "18917": gameName = "Tony Hawk's Proving Ground"; break;
					case "33217": gameName = "Tony Hawk's Pro Skater HD"; break;
					case "489731": gameName = "Tony Hawk's Pro Skater 5"; break;
				}



				if (gameName != "Unknown") {
					if (!msgFlags.includes(result.data[0].user_name)) {
						console.log(name + " is online playing " + gameName + ", message sent.");
						client.channels.get(streamChannel).send(escapeString(name) + " is live, playing " + gameName + ". Watch them at: http://www.twitch.tv/" + name);
						msgFlags.push(result.data[0].user_name);
					} else {
						console.log(name + " is online playing " + gameName + ", but message has already been sent this session.");
					}
				} else {
					console.log(name + " is online, but isn't playing thps.");
				}


			} else {
				console.log(name + " is offline.");
				let index = msgFlags.indexOf(name);
				if (index > -1) {
					msgFlags.splice(index, 1);
				}
			}


		})
		.catch(function (err) {
			console.log(err);
		});

}

function queryStreams() {
	console.log("!!!!!!!!QUERYING STREAMS!!!!!!!!");
	for (name in nameList) {
		getStream(nameList[name]);
	}
}


setInterval(queryStreams, 60000);



client.on("message", (message) => {

	if (message.channel.id === streamChannel || message.channel.id === "507307429080596480") {
		if (message.content.startsWith(`${prefix}addstream`)) {
			console.log("Adding stream: " + getParams(message));
			let addNameList = nameList;
			let index = addNameList.indexOf(getParams(message));
			if (index == -1) {
				addNameList.push(getParams(message));
			}
			fs.writeFileSync('nameList.json', JSON.stringify(addNameList), 'utf8');

		}

		if (message.content.startsWith(`${prefix}delstream`)) {
			console.log("Deleting stream: " + getParams(message));
			let delNameList = nameList;
			let index = delNameList.indexOf(getParams(message));
			if (index > -1) {
				delNameList.splice(index, 1);
			}
			let flagIndex = msgFlags.toString().toLowerCase().indexOf(getParams(message).toLowerCase());
			if (flagIndex > -1) {
				msgFlags.splice(flagIndex, 1);
			}
			fs.writeFileSync('nameList.json', JSON.stringify(delNameList), 'utf8');
		}

		if (message.content.startsWith(`${prefix}stream`)) {
			for (name in nameList) {
				getStream(nameList[name]);
			}
		}

		if (message.content.startsWith(`${prefix}who`)) {
			console.log(msgFlags);
		}

		if (message.content.startsWith(`${prefix}forcecheck`)) {
      console.log("Forcing a query.");
			queryStreams();
		}
	}



	let msgName = message.member.user.tag.split("#");
	let thps1 = message.guild.roles.find(role => role.name === "THPS1");
	let thps2 = message.guild.roles.find(role => role.name === "THPS2");
	let thps2x = message.guild.roles.find(role => role.name === "THPS2X");
	let thps3 = message.guild.roles.find(role => role.name === "THPS3");
	let thps4 = message.guild.roles.find(role => role.name === "THPS4");
	let thug1 = message.guild.roles.find(role => role.name === "THUG1");
	let thug2 = message.guild.roles.find(role => role.name === "THUG2");
	let thaw = message.guild.roles.find(role => role.name === "THAW");
	let thp8 = message.guild.roles.find(role => role.name === "THP8");
	let thps5 = message.guild.roles.find(role => role.name === "THPS5");
	let thpshd = message.guild.roles.find(role => role.name === "THPSHD");

	if (message.channel.id === "507307429080596480" || message.guild.id !== "83090266910621696") {

		if (message.content.startsWith(`${prefix}role`)) {

			let roleName = getParams(message);
			let assignedRole;

			switch (roleName) {
				case "thps1":
					assignedRole = thps1;
					break;
				case "thps2":
					assignedRole = thps2;
					break;
				case "thps2x":
					assignedRole = thps2x;
					break;
				case "thps3":
					assignedRole = thps3;
					break;
				case "thps4":
					assignedRole = thps4;
					break;
				case "thug1":
					assignedRole = thug1;
					break;
				case "thug2":
					assignedRole = thug2;
					break;
				case "thaw":
					assignedRole = thaw;
					break;
				case "thp8":
					assignedRole = thp8;
					break;
				case "thps5":
					assignedRole = thps5;
					break;
				case "thpshd":
					assignedRole = thpshd;
					break;
			}

			if (assignedRole != undefined) {
				if (message.member.roles == undefined) {
					message.member.addRole(assignedRole);
					message.channel.send("Assigned you the " + assignedRole.name + " role.");
					console.log("Assigned role " + assignedRole.name + " to " + message.member.user.tag);
				} else {
					if (message.member.roles.has(assignedRole.id)) {
						message.member.removeRole(assignedRole);
						message.channel.send("Took away " + msgName[0] + "'s " + assignedRole.name + " role.");
						console.log("Unassigned role " + assignedRole.name + " from " + message.member.tag);
					} else {
						message.member.addRole(assignedRole);
						message.channel.send("Assigned " + msgName[0] + " the " + assignedRole.name + " role.");
						console.log("Assigned role " + assignedRole.name + " to " + message.member.user.tag);
					}
				}
			} else {
				message.channel.send("Role does not exist.");
			}
		}
	}
});


client.login(process.env.TOKEN);