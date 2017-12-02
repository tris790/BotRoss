"use strict";
const fs = require("fs");
const request = require("request");
var crypto = require("crypto");

const sharp = require("sharp");

function extractNameFromUrl(url) {
  console.log("extracting:", url);
  let imgName = url.match(/\/([0-z]+)(\.[a-z]{2,4})$/);
  console.log("reg:", imgName);
  if (imgName == null)
    imgName = `${crypto.randomBytes(20).toString("hex")}.jpg`;
  if (imgName.indexOf("/") == 0) imgName = imgName.substring(1);

  console.log("extracted:", imgName);
  return imgName;
}

function findUser(id, msg) {
  if (!id || !msg) return;
  const usrId = id.match(/[0-9]+/)[0];
  return msg.member.guild.members.find(member => {
    return member.id == usrId;
  });
}

function download(uri, filename) {
  const downloadPath = `images/downloaded/${filename}`;
  return new Promise((resolved, rejected) => {
    console.log("Stating download");
    request.head(uri, function(err, res, body) {
      request(uri)
        .pipe(fs.createWriteStream(downloadPath))
        .on("close", () => {
          resolved(filename);
        })
        .on("error", () => {
          rejected("error downloading");
        });
    });
  });
}

async function addHat(hat, name) {
  console.log("Adding Hat");
  const hatPath = `images/hats/${hat}.png`;
  const imagePath = `images/downloaded/${name}`;
  const outputPath = `images/photoshoped/${name}`;

  console.log("[HAT]", hatPath, "[IMAGE]", imagePath, "[OUTPUT]", outputPath);

  const image = sharp(imagePath);
  const meta = await image.metadata();

  return image
    .overlayWith(
      await sharp(hatPath)
        .resize(Math.floor(meta.width / 1.2), Math.floor(meta.height / 1.5))
        .toBuffer(),
      { gravity: sharp.gravity.north }
    )
    .toBuffer();
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
        console.log("Len 1");
        const usr = msg.author;

        download(usr.staticAvatarURL, `user${usr.id}.jpg`)
          .then(name => {
            addHat(hat, name)
              .then(file => sendImage(bot, msg, { file, name }))
              .catch(err => console.log("Error hat", err));
          })
          .catch(err => console.log("Error downloading", err));
      }

      if (args.length === 2) {
        console.log("Len 2");

        const url = args[1].match(
          /(?:(?:https?:\/\/))[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/=]*(\.jpg|\.png|\.jpeg|\.webp))/
        );

        if (url) {
          const imgUrl = url[0];

          download(imgUrl, extractNameFromUrl(imgUrl))
            .then(name => {
              addHat(hat, name)
                .then(file => sendImage(bot, msg, { file, name }))
                .catch(err => console.log("Error hat", err));
            })
            .catch(err => console.log("Error downloading", err));
        } else {
          const usr = findUser(args[1], msg);
          if (usr.id) {
            download(usr.staticAvatarURL, `user${usr.id}.jpg`)
              .then(name => {
                addHat(hat, name)
                  .then(file => sendImage(bot, msg, { file, name }))
                  .catch(err => console.log("Error hat", err));
              })
              .catch(err => console.log("Error downloading", err));
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

function sendImage(bot, msg, file) {
  bot.createMessage(msg.channel.id, "", file);
}

module.exports.Install = Install;
