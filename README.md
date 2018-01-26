# notify-TTS
Reads in game message though TTS

## Uses modified say.js, Credit to : https://github.com/marak/say.js/

## Commands and Stuff
Your character name is added as default on trigger, and so is your guild.

Type /proxy notify help for list of all commands.
But basically to add your own custum trigger name 

/proxy notify add name (to add name to list of your triggers).
/proxy notify remove name (to remove name).

@Apple message, will read message to everyone in Apple that has this,
@charname message, will read message to you only, or I suppose more than one people if you both use same triggernames xD

Party(Raid) and Guild are enabled by default, whisper is not. If you want to change this, just change the guild/party/whisper in index.js to true or false. To toggle it ingame, the command is
/proxy notify party (to toggle party)
/proxy notify guild (to toggle guild)
/proxy notify whisper (to toggle whisper)

If you want to block someone, the command is
/proxy notify block characterName (blocks characterName, sync across your computer)
Ex. /proxy notify Apple

To unblock,
/proxy notify unblock characterName
Ex. /proxy notify unblock Apple

It is on by default in guild and party chat, however whisper is turned off, you can turn it on permanently on index.js, just change false to true.

If the character is blocked though this method, the message from them will not be read in TTS, you can still see it in chat though.

Oh and, if you have someone blocked, it should tell you in console who you have blocked currently when you log in. Anyway., have fun, if something doesn't work, let me know.
