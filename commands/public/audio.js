'use strict';
const fs = require('fs');
const { is_web_uri } = require('valid-url');
var youtubedl = require('youtube-dl');
var path = require('path');

function addSongPlaylist(bot, msg, song, requestedby) {
	bot.createMessage(
		msg.channel.id,
		`${requestedby.username} added: ${song.songname}(${song.size}) to the playlist`
	);
	bot.playlist.push({
		songname: song.songname,
		size: song.size,
		artist: song.artist,
		requestedby
	});
}

function skipSong(bot, msg) {
	if (bot.playlist.length > 0) {
		bot.voiceConnections.get(msg.channel.guild.id).stopPlaying();
		bot.createMessage(
			msg.channel.id,
			`Skipping song: ${bot.playlist[0].songname}`
		);
		bot.playlist.shift();
		playSongs(bot, channelid);
	}
}

function playSongs(bot, msg) {
	const { id } = msg.channel;
	if (bot.playlist.length > 0) {
		const current = bot.playlist[0];

		bot
			.joinVoiceChannel(msg.member.voiceState.channelID, {})
			.then(connection => {
				if (!connection.playing) {
					console.log(`Trying to play:./audio/${current.songname}`);
					connection.play(`./audio/${current.songname}`, {
						encoderArgs: ['-af', `volume=${bot.config.Volume}`]
					});
					bot.createMessage(id, `Now playing **${current.songname}**`);
					connection.on('error', err => console.log(err));
					connection.once('end', () => {
						bot.createMessage(id, `Finished **${current.songname}**`);
						bot.playlist.shift();
						playSongs(bot, msg);
					});
				}
			});
	} else {
		bot.createMessage(id, 'Playlist is empty');
	}
}

function getSongInfo(path) {
	return new Promise((resolve, reject) => {
		resolve({ songname: path, size: 111 });
	});
}

function Install(bot) {
	var playCommand = bot.registerCommand(
		'play',
		(msg, args) => {
			if (args.length > 0) {
				var song = args.join(' ');
				if (is_web_uri(song)) {
					bot.createMessage(msg.channel.id, `Downloading: ${song}`);
					downloadAudio(song)
						.then(s => {
							addSongPlaylist(bot, msg, s, msg.author);
							playSongs(bot, msg);
						})
						.catch(err => bot.createMessage(msg.channel.id, `Error: ${err}`));
				} else {
					console.log('Path', song);
					getSongInfo(song)
						.then(s => {
							addSongPlaylist(bot, msg, s, msg.author);
							playSongs(bot, msg);
						})
						.catch(err => bot.createMessage(msg.channel.id, `Error: ${err}`));
				}
			}
		},
		{
			description: 'Play a audio file.',
			fullDescription: 'Play a audio file.',
			usage: '<AudioFileName.Extension>'
		}
	);

	var stop = bot.registerCommand(
		'stop',
		(msg, args) => {
			bot.playlist = [];
			bot.voiceConnections.get(msg.channel.guild.id).stopPlaying();
			bot.createMessage(msg.channel.id, 'Audio stopped.');
		},
		{}
	);
	var skip = bot.registerCommand(
		'skip',
		(msg, args) => {
			console.log(msg);
			skipSong(bot, msg);
		},
		{}
	);
	var resume = bot.registerCommand(
		'resume',
		(msg, args) => {
			bot.voiceConnections.get(msg.channel.guild.id).resume();
			bot.createMessage(msg.channel.id, 'Audio resumed.');
		},
		{}
	);
	var pause = bot.registerCommand(
		'pause',
		(msg, args) => {
			bot.voiceConnections.get(msg.channel.guild.id).pause();
			bot.createMessage(msg.channel.id, 'Audio paused.');
		},
		{}
	);
	var volume = bot.registerCommand(
		'volume',
		(msg, args) => {
			const vol = parseFloat(args[0]);
			if (vol <= 2 && vol >= 0) {
				bot.config.Volume = vol;
				bot.createMessage(msg.channel.id, `Volume set to ${vol}.`);
			}
		},
		{}
	);
	function downloadAudio(url) {
		return new Promise((resolve, reject) => {
			var video = youtubedl(url, ['-f', '(mp3/bestaudio)']);
			var name = '';
			var size = 0;
			video.on('info', info => {
				size = info.size;
				name = info._filename;

				var file = path.join('./audio', info._filename);
				video.pipe(fs.createWriteStream(file));
			});
			video.on('end', () => {
				console.log('Done downloading');
				return resolve({
					songname: name,
					size: size,
					length: 222,
					artist: 'WIP',
					url
				});
			});
			video.on('error', err => reject(err));
		});
	}

	var extractors = bot.registerCommand(
		'extractors',
		(msg, args) => {
			var youtubedl = require('youtube-dl');
			youtubedl.getExtractors(true, function(err, list) {
				console.log('Found ' + list.length + ' extractors');
				for (var i = 0; i < list.length; i++) {
					console.log(list[i]);
				}
			});
		},
		{}
	);
}
module.exports.Install = Install;
