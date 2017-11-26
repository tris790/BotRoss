"use strict";
const fs = require("fs");
const request = require("request");

const { createCanvas, loadImage } = require("canvas");

function extractNameFromUrl(url) {
  let imgName = url.match(/\/([0-z]+)(\.[a-z]{2,4})$/);
  if (imgName.indexOf("/") == 0) imgName = imgName.substring(1);
  return imgName;
}

function findUser(id, msg) {
  if (!id || !msg) return;
  const usrId = id.match(/[0-9]+/)[0];
  return msg.member.guild.members.find(member => {
    return member.id == usrId;
  });
}

function download(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on("close", callback);
  });
}

function toImage(hat, url, name) {
  return new Promise((resolved, rejected) => {
    let finalFile = { name };
    const filePath = `images/downloaded/${name}`;

    // Download image
    download(url, filePath, () => {
      let canvas;
      let ctx;
      let size;

      let data = [];

      loadImage(filePath).then(image => {
        size = {
          height: image.height,
          width: image.width
        };

        // Create canvas and add image
        canvas = createCanvas(image.width, image.height);
        ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, size.width, size.height);
      });

      loadImage(`images/hats/${hat}.png`).then(hatImage => {
        // Create and add hat to canvas
        const hatWidth = size.width / 1.5;
        const hatHeight = size.height / 1.5;
        const hatXPos = (size.width - hatWidth) / 2 + hatWidth / 3;
        const hatYPos = (size.height - hatHeight) / 200;

        ctx.drawImage(hatImage, hatXPos, hatYPos, hatWidth, hatHeight);

        // Save photoshop to disk
        const out = fs.createWriteStream(`images/photoshoped/${name}`);
        const stream = canvas.pngStream();
        stream.on("data", chunk => {
          out.write(chunk);
          data.push(chunk);
        });

        stream.on("end", () => {
          finalFile.file = Buffer.concat(data);
          if (finalFile.file) {
            return resolved(finalFile);
          }
          return rejected("Error while photoshopping");
        });
      });
    });
  });
}

function Install(bot) {
  const hatCommand = bot.registerCommand(
    "hat",
    (msg, args) => {
      if (args.length === 0) {
        return "you need a hat type";
      }
      const hat = args[0];
      let photoshopedFile;

      if (args.length === 1) {
        const usr = msg.author;
        toImage(hat, usr.staticAvatarURL, `user${usr.id}.png`).then(d =>
          sendImage(bot, msg, d)
        );
      }

      if (args.length === 2) {
        const url = args[1].match(
          /(?:(?:https?:\/\/))[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/=]*(\.jpg|\.png|\.jpeg|\.webp))/
        );

        if (url) {
          const imgUrl = url[0];

          toImage(hat, imgUrl, extractNameFromUrl(imgUrl)).then(d => {
            sendImage(bot, msg, d);
          });
        } else {
          const usr = findUser(args[1], msg);
          if (usr.id) {
            const avatarUrl = usr.staticAvatarURL;
            toImage(hat, avatarUrl, `user${usr.id}.png`).then(d =>
              sendImage(bot, msg, d)
            );
          }
        }
      }
    },
    {
      description: "Puts a hat on your head.",
      fullDescription:
        "The bot will put the hat you want on your profile picture or your friend's.",
      usage: "<hat, [userid]>"
    }
  );
}

function sendImage(bot, msg, photoshopedFile) {
  bot.createMessage(msg.channel.id, "", {
    file: photoshopedFile.file,
    name: photoshopedFile.name
  });
}

module.exports.Install = Install;
