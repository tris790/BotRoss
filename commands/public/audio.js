'use strict';
const fs = require('fs');
const { is_web_uri } = require('valid-url');
var youtubedl = require('youtube-dl');

var path = require('path');
//
// function joinAudioChannel(bot, msg) {
// 	return .catch(err => {
// 		bot.createMessage(
// 			msg.channel.id,
// 			'Error joining voice channel: ' + err.message
// 		);
// 		console.log(err);
// 	});
// }

function addSongPlaylist(bot, song, requestedby) {
	bot.playlist.push({
		songname: song.songname,
		size: song.size,
		artist: song.artist,
		requestedby
	});
	console.log('playlist state1:', bot.playlist);
}

//Get connection
function skipSong(bot) {
	if (bot.playlist.length > 0) {
		bot.playlist.shift();
		if (connection.playing) {
			connection.stopPlaying();
		}
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
				console.log(`Trying to play:./audio/${current.songname}`);
				if (connection.playing) {
					connection.stopPlaying();
				}
				connection.play(`./audio/${current.songname}`, {
					encoderArgs: ['-af', `volume=${bot.config.volume}`]
				});
				bot.createMessage(channelid, `Now playing **${current.songname}**`);
				connection.on('error', () => console.log());
				connection.once('end', () => {
					bot.createMessage(channelid, `Finished **${current.songname}**`);
					bot.playlist.shift();
					playSong(bot, channelid);
				});
			});
	} else {
		bot.createMessage(channelid, 'Playlist is empty');
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
					console.log('Url', song);
					downloadAudio(song).then(s => {
						addSongPlaylist(bot, s, msg.author);
						playSongs(bot, msg);
					});
				} else {
					console.log('Path', song);

					getSongInfo().then(s => {
						addSongPlaylist(bot, s, msg.author);
						playSongs(bot, msg);
					});
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
			bot.voiceConnections.get(msg.guild.id).stopPlaying();
			bot.createMessage(msg.channel.id, 'Audio stopped.');
		},
		{}
	);
	var resume = bot.registerCommand(
		'resume',
		(msg, args) => {
			bot.voiceConnections.get(msg.guild.id).resume();
			bot.createMessage(msg.channel.id, 'Audio resumed.');
		},
		{}
	);
	var pause = bot.registerCommand(
		'pause',
		(msg, args) => {
			bot.voiceConnections.get(msg.guild.id).pause();
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

				console.log('Got video info');
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

	// var audioDl = bot.registerCommand(
	// 	'dl',
	// 	(msg, args) => {
	// 		try {
	// 			let isBig = false;
	// 			if (!fs.existsSync('./audio')) {
	// 				fs.mkdirSync('./audio');
	// 			}
	// 			youtubedl.getInfo(args[0], ['-f', '(mp3/bestaudio)'], function(
	// 				err,
	// 				info
	// 			) {
	// 				if (err || !info) {
	// 					console.log(err);
	// 					return err;
	// 				}
	// 				if (info.filesize > 10000000 && info.filesize != null) {
	// 					bot.createMessage(
	// 						msg.channel.id,
	// 						`File too big (${Math.round(
	// 							info.filesize / 1000000
	// 						)}MB), 10MB max.`
	// 					);
	// 					isBig = true;
	// 				} else {
	// 					bot.createMessage(msg.channel.id, 'Download started!');
	// 					const download = youtubedl(
	// 						args[0],
	// 						['-f', 'mp3/bestaudio'],
	// 						{},
	// 						function(err, a) {
	// 							console.log(err);
	// 						}
	// 					);
	// 					download.on('info', info => {
	// 						var writter = download.pipe(
	// 							fs.createWriteStream(`audio/${info.title}.${info.ext}`)
	// 						);
	// 						writter.once('close', function() {
	// 							bot.createMessage(
	// 								msg.channel.id,
	// 								`Download finished!\n${info.title}.${info.ext}`
	// 							);
	// 						});
	// 					});
	// 				}
	// 			});
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	},
	// 	{}
	// );
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
