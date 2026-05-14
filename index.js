const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is online.");
});

app.listen(3000, () => {
  console.log("Web server running.");
});

require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const bannedTriggers = [
  "free nitro",
  "discord.gg/",
  "badword1",
];

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    if (!message.guild) return;
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    const brokenRule = bannedTriggers.find(trigger =>
      content.includes(trigger.toLowerCase())
    );

    if (!brokenRule) return;

    const member = message.member;
    const bannedRole = message.guild.roles.cache.get(process.env.BANNED_ROLE_ID);

    if (!bannedRole) {
      console.log("BANNED role not found.");
      return;
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      console.log("Bot missing Manage Roles permission.");
      return;
    }

    await member.roles.add(bannedRole);
    await message.delete().catch(() => {});

    console.log(`Assigned banned role to ${member.user.tag}`);

    const logChannel = message.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);

    if (logChannel) {
      logChannel.send(`🚫 ${member.user.tag} was given the BANNED role.\nReason: ${brokenRule}`);
    }
  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.BOT_TOKEN);
