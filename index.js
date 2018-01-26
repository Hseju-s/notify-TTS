// V.1.5
const path = require('path'),
	  fs = require('fs'),
	  say = require('./say');
	  Command = require('command');

module.exports = function Notify(dispatch){
const command = Command(dispatch);

let guild = true,			// TTS from guild
	party = true,			// TTS from party
	whisper = false,		// TTS from Whisper
	voice = 'female';		// TTS male or female voice

/****************************************************
**** Don't change under this if you got no idea *****
****************************************************/
const partyChannels = [1,21,25,32]
let blocked = [],
	triggerNames = [],
	cID,
	guildName,
	checkName = triggerNames.map(x => x.toLowerCase());

voice = (voice === 'male') ? 'Microsoft David Desktop' : 'Microsoft Zira Desktop';

 try {
		blocked = require('./blockedNames.json');
		triggerNames = require('./triggerNames.json');
		checkName = triggerNames.map(x => x.toLowerCase());

	}
	catch(e) {}

const help = () => {
	command.message('[Notify] notify party (to toggle TTS from party chat)');
	command.message('[Notify] notify guild (to toggle TTS from guild chat)');
	command.message('[Notify] notify whisper (to toggle TTS from whisper char)');
	command.message('[Notify] notify names (to list your current trigger Names');
	command.message('[Notify] notify add name (to add name to your list of triggers');
	command.message('[Notify] notify remove name (to remove name from your list of triggers');
	command.message('[Notify] notify block name (to block name from TTS');
	command.message('[Notify] notify unblock name (to unblock name from TTS');
};

command.add('notify', (arg1,arg2) => {
	if(arg1 && !arg2){
		if(arg1.toLowerCase() === 'help'){
			help();
		}
		else if(arg1.toLowerCase() === 'names'){
			command.message('Your trigger names are: '+ triggerNames.toString());
		}
	    else if(arg1.toLowerCase() === 'guild'){
	    	guild = !guild
	    	guild ? command.message('[Notify] Tag Notification from Guild on') : command.message('[Notify] Tag Notification from Guild off')
	    }
	    else if(arg1.toLowerCase() === 'party'){
	    	party = !party
	    	party ? command.message('[Notify] Tag Notification from Party on') : command.message('[Notify] Tag Notification from Party off')
	    }
	    else if(arg1.toLowerCase() === 'whisper'){
	    	whisper = !whisper
	    	whisper ? command.message('[Notify] Tag Notification from Whisper on') : command.message('[Notify] Tag Notification from Whisper off')
	    }
	    else command.message('[Notify] Type notify help for list of options.');
	}
	else if(arg1 && arg2){
		let index = blocked.indexOf(arg2.toLowerCase());
		if(arg1.toLowerCase() === 'block'){
			if(index == -1){
				blocked.push(arg2.toLowerCase())
				command.message('[Notify] Blocked ' + arg2 + '.')
				fs.writeFileSync(path.join(__dirname, 'blockedNames.json'), JSON.stringify(blocked))
			}
			else command.message('[Notify] '+ arg2 + ' is already blocked.');
		}
		else if(arg1.toLowerCase() === 'unblock'){
			if(index != -1){
				blocked.splice(index,1)
				command.message('[Notify] Unblocked ' + arg2 + '.')
				fs.writeFileSync(path.join(__dirname, 'blockedNames.json'), JSON.stringify(blocked));
			}
			else command.message('[Notify] '+ arg2 + ' is not blocked.');
		}
		else if(arg1.toLowerCase() === 'add'){
			index = triggerNames.indexOf(arg2.toLowerCase());
			if(index == -1){
				triggerNames.push(arg2.toLowerCase())
				command.message('[Notify] Added ' + arg2 + ' to triggers.')
				command.message('Your trigger names are: '+ triggerNames.toString());
				fs.writeFileSync(path.join(__dirname, 'triggerNames.json'), JSON.stringify(triggerNames))
				checkName = triggerNames.map(x => x.toLowerCase());
			}
			else {
				command.message('[Notify] ' +arg2 + ' is already in trigger Names.');
				command.message('Your trigger names are: '+ triggerNames.toString());
			}
		}
		else if(arg1.toLowerCase() === 'remove'){
			index = triggerNames.indexOf(arg2.toLowerCase());
			if(index != -1){
				triggerNames.splice(index,1)
				command.message('[Notify] Removed ' + arg2 + ' from triggers.')
				command.message('Your trigger names are: '+ triggerNames.toString());
				fs.writeFileSync(path.join(__dirname, 'triggerNames.json'), JSON.stringify(triggerNames));
				checkName = triggerNames.map(x => x.toLowerCase());
			}
			else {
				command.message('[Notify] '+ arg2 + ' is not in list of triggers.');
				command.message('Your trigger names are: '+ triggerNames.toString());
			}
		}
		else command.message('[Notify] Type notify help for list of options.');
	}
    else command.message('[Notify] Type notify help for list of options.');
});

 	const stripTags = (str) => str.replace(/(<([^>]+)>)/ig,"");
 	const toVoice = (msg) => say.speak(msg, voice);

 	const processChat = (msg, author) => {
 		if(/@/.test(msg) && !blocked.includes(author.toLowerCase())){
 			let message = stripTags(msg).split(' ');
 			if(/^@/.test(message[0]) && checkName.includes(message[0].replace('@','').toLowerCase())){
 				message.shift();
 				toVoice(message.join(' '));
 			}
 		}
 	}
 	
 	dispatch.hook('S_GUILD_NAME', 1, (event) => {
 		if(JSON.stringify(cID) == JSON.stringify(event.cid)){
 			guildName = event.guild.toLowerCase();
 			if(guildName && !checkName.includes(guildName)) checkName.push(guildName);
 		}
 	});


 	dispatch.hook('S_RETURN_TO_LOBBY', 1, (event) => {
 		let index = checkName.indexOf(guildName);
 		if(index != -1){
 			checkName.splice(index,1);
 			guildName = null;
 		}
 	});

 	dispatch.hook('S_LOGIN', 9, (event) => {
 		cID = event.gameId;
 		if(!checkName.includes(event.name.toLowerCase())) checkName.push(event.name.toLowerCase())
 		console.log('[Notify] Current Trigger Names are: ', checkName.toString());
 		if(blocked.length > 0) console.log('[Notify] Currently blocked: ',blocked.toString());
 	});

	dispatch.hook('S_CHAT', 2, (event) => {
		if(partyChannels.includes(event.channel) && party) processChat(event.message,event.authorName);
		else if(event.channel === 2 && guild) processChat(event.message,event.authorName);
	});

	dispatch.hook('S_WHISPER', 2, (event) => {processChat(event.message,event.authorName)});
}