const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Bot is online."));
app.listen(3000, () => console.log("Web server running."));

require("dotenv").config();

const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const bannedTriggers = ["free nitro", "discord.gg/", "badword1"];

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    if (!message.guild) return;
    if (message.author.bot) return;

    console.log(`Message seen: ${message.content}`);

    const content = message.content.toLowerCase();

    if (content === "!testban") {
      console.log("Test command detected.");

      const bannedRole = message.guild.roles.cache.get(process.env.BANNED_ROLE_ID);

      if (!bannedRole) {
        console.log("ERROR: BANNED_ROLE_ID is wrong or role not found.");
        return;
      }

      if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        console.log("ERROR: Bot does not have Manage Roles permission.");
        return;
      }

      await message.member.roles.add(bannedRole);
      console.log(`SUCCESS: Added BANNED role to ${message.author.tag}`);
      return;
    }

    const brokenRule = bannedTriggers.find(trigger => content.includes(trigger));

    if (!brokenRule) return;

    console.log(`Trigger detected: ${brokenRule}`);

    const bannedRole = message.guild.roles.cache.get(process.env.BANNED_ROLE_ID);

    if (!bannedRole) {
      console.log("ERROR: BANNED_ROLE_ID is wrong or role not found.");
      return;
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      console.log("ERROR: Bot does not have Manage Roles permission.");
      return;
    }

    await message.member.roles.add(bannedRole);
    await message.delete().catch(() => {});

    console.log(`SUCCESS: Added BANNED role to ${message.author.tag}`);
  } catch (err) {
    console.error("FULL ERROR:", err);
  }
});

client.login(process.env.BOT_TOKEN);
