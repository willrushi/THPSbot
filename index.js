// init project
const http = require('http');
const express = require('express');
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const app = express();
const client = new Discord.Client({ fetchAllMembers: true });

app.use(express.static('public'));

app.get('/', function (request, response) {
	console.log(Date.now() + " Ping Received");
	response.sendStatus("200");
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

client.on("message", (message) => {

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

		if (message.content.startsWith(`${prefix}ping`)) {
			message.channel.send("Pong.");
		}

		if (message.content.startsWith(`${prefix}role`)) {

			let splitMsg = message.content.split(" ");
      let roleName = "";
      if(splitMsg.length === 1){ 
        roleName = "";
      }else{
        roleName = splitMsg[1].toLowerCase(); 
      }
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
        if(message.member.roles == undefined){
          message.member.addRole(assignedRole);
					message.channel.send("Assigned you the " + assignedRole.name + " role.");
          console.log("Assigned role " + assignedRole.name + " to " + message.member.user.tag);
        }else{
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
