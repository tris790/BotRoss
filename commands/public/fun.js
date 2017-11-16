"use strict";

function Install(bot) {
  var ask = bot.registerCommand(
    "ask",
    (msg, args) => {
      var response = ["Yes", "No"];
      var rand = Math.floor(Math.random() * (response.length - 0)) + 0;
      return response[rand];
    },
    {
      description: "Asks Bot Ross a question.",
      fullDescription: "The bot will answer your question.",
      usage: "<question>",
      aliases: ["OuiOuNon"]
    }
  );
  var choose = bot.registerCommand(
    "choose",
    (msg, args) => {
      if (args.length === 0) return "Invalid input";
      var rand = Math.floor(Math.random() * args.length);
      return args[rand];
    },
    {
      description: "Let Bot Ross decide.",
      fullDescription: "The bot will choose between multiple options.",
      usage: "<choice choice choice ...>"
    }
  );
}

module.exports.Install = Install;
