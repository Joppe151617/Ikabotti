const loginID = process.env.loginID;
const Discord = require('discord.js');
const client = new Discord.Client();
const Parser = require('rss-parser');
const moment = require('moment');
let parser = new Parser();

//Käynnistys, activity asetus
client.on ("ready", () => {
	console.log ("Connected as " +client.user.tag);
	
	client.user.setActivity("Everything you say...", {type: "LISTENING"});
		//Kanavien listaus consoliin
	client.guilds.forEach((guild) => {
		console.log(guild.name);
		guild.channels.forEach((channel) => {
			console.log("-" + channel.name + channel.type + channel.id);
		});
		// Testi kanava id: 539438226960547848
		// Ikarkoodarit kanava id: 451458886470336523
	});
//Muistutusten käynnistys
	dailyMissionsReminder();
	pirateReminder();
//Rss lukija käynnistys
	rssLukija();
//Käynnistys valmis tervehdys
	let testiChannel = client.channels.get("539438226960547848");
	let mi = 10;
	testiChannel.send("```ini\n [Hyvää päivää!] \n```");
});

//Viestin vastaanottaminen ja listaus consoliin
client.on ("message", (receivedMessage) => {
	var d = new Date();
//	console.log(d + " "+ receivedMessage.channel + receivedMessage.author + ": " +receivedMessage.content);
//Varmistetaan ettei lähettäjä ollut botti
	if (receivedMessage.author.bot) {
		return;
	}
//Lajitellaan viestit
	if (receivedMessage.content.includes("tissit")) {
	receivedMessage.react("👍");
	}
	if (receivedMessage.content.startsWith("!")) {
		processCommand(receivedMessage);
	}
});

//Lajitellaan komennot --------------------------------------------------------------------------------------
function processCommand(receivedMessage) {
	let fullCommand = receivedMessage.content.substr(1);
	let splitCommand = fullCommand.split(" ");
	let primaryCommand = splitCommand[0];
	let arguments = splitCommand.slice(1);
	
	if (primaryCommand == "help") {
		helpCommand(arguments, receivedMessage);
		
	} else if (primaryCommand == "sää") {
		saaCommand(arguments, receivedMessage);
			
	}else {
		receivedMessage.channel.send("Komentoa ei tunnistettu. Yritä: !help");
	}

//Helpkomento
	function helpCommand(arguments, receivedMessage) {
	receivedMessage.channel.send("Käytettävät komennot: !help, !sää [paikkakunta]");
	}

//Sääkomento 
	function saaCommand(arguments, receivedMessage) {
	receivedMessage.channel.send("https://www.foreca.fi/Finland/"+ arguments);
	}
}

//Nukkumiskomento
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms*1000));
}

//Päivittäiset tehtävät muistutus ---------------------------------------------------------------------------
async function dailyMissionsReminder() {
	var ekaViesti = true;
	while (true) {
		var time = new Date().getTime() / 1000;
		var week = 604800;
		var day = 86400;
		var hour15 = 54000;
		var hour9 = 32000;
		var min10 = 600;
		var min = 60;
		var deadline = 1525647599; // 7.5.18 00:59:59 gmt+2
		var timeLeft = deadline + (Math.ceil((time - deadline)/week)*week) - time;
		console.log("päivätehtävä " + timeLeft);
		
		if(timeLeft < hour9) {
			if (ekaViesti) {
				let ikarkoodaritChannel = client.channels.get("451458886470336523");
				ikarkoodaritChannel.send("Se on sunnuntai muistakaa lunastaa päivittäiset tehtävät palkintonne!");
				ekaViesti = false;
			}
		}
		if(timeLeft < min10) {
			let ikarkoodaritChannel = client.channels.get("451458886470336523");
			ikarkoodaritChannel.send("Viimeinen hetki lunastaa päivittäiset tehtävät palkintonne!");
			ekaViesti = true;
			await sleep(min10);
			
		}
		await sleep(min);
	}	
}

//Piraatit muistutus ----------------------------------------------------------------------------------------
async function pirateReminder() {
	var ekaViesti = true;
	while (true) {
		var time = new Date().getTime() / 1000;
		var week3 = 1814400;
		var day = 86400;
		var hour9 = 32400;
		var min5 = 300;
		var min = 60;
		var deadline = 1547341200; // 13.1.19 3:00:00 gmt+2
		var timeLeft = deadline + (Math.ceil((time - deadline)/week3)*week3) - time;
		console.log("piraatti " + timeLeft);
		
		if(timeLeft < hour9) {
			if (ekaViesti) {
				let ikarkoodaritChannel = client.channels.get("451458886470336523");
				ikarkoodaritChannel.send("Muista merirosvot tänä yönä!");
				ekaViesti = false;
			}
		}
		if(timeLeft < min5) {
			let ikarkoodaritChannel = client.channels.get("451458886470336523");
			ikarkoodaritChannel.send("Merirosvot!!");
			ekaViesti = true;
			await sleep(min5);
		}
		await sleep(min);
	}	
}

//Rss lukija ------------------------------------------------------------------------------------------------
async function rssLukija() {
	//Uusimman viestin aika, alussa otetaan käynnistys aika
	var isoaika = moment().format('YYYYMMDDHHmmss');
	//Aika muistiin 
	var valiaika = moment().format('YYYYMMDDHHmmss');
	
	while(true) {
		let feed = await parser.parseURL('https://forum.ikariam.gameforge.com/forum/board-feed/25/?at=27-69279b41dda982f1b02e07b9d9ca5e2ff2ab585e');
		console.log(feed.title);
		feed.items.forEach(item => {
			var aika = item.pubDate;
			var maika = moment(aika).format('YYYYMMDDHHmmss');
			//console.log("julkaisu aika " + maika);
			//console.log("vertaus aika " + isoaika);
			if (isoaika < maika) {
				if (item.creator == "Jambo" || item.creator == "Tero") {
					console.log('Kello on: ' + maika);
					console.log("Uusi viesti käyttäjältä: " + item.creator + ", ketjuun: " + item.title + " Viestin sisältö: " + item.content + " Linkki ketjuun: " + item.link);
					//Viestin lähetys kanavalle
					//let testiChannel = client.channels.get("539438226960547848");
					//testiChannel.send("```ini\n [Uusi viesti käyttäjältä:] " + item.creator + "\n [Ketjuun:] " + item.title + " \n [Viestin sisältö:] " + item.content + "\n```" + item.link);
					let ikarkoodaritChannel = client.channels.get("451458886470336523");
					ikarkoodaritChannel.send("```ini\n [Uusi viesti käyttäjältä:] " + item.creator + "\n [Ketjuun:] " + item.title + " \n [Viestin sisältö:] " + item.content + "\n```" + item.link+"?action=lastPost");
					//Suurimman ajan muistiin otto
					if (valiaika < maika) {
						valiaika = maika;
					}
				}
			}
		});
		//Suurin aika uusimmaksi ajaksi
		isoaika = valiaika;
		//Nukutaan 5min
		await sleep(300);
	}
}
client.login(loginID);