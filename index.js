require("dotenv").config();

const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("clientReady", () => {
  console.log("Logged in as " + client.user.tag);
});

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.guild) return;

    console.log("MESSAGE: " + message.content);

    if (message.content === "!testban") {
      const role = message.guild.roles.cache.get(process.env.BANNED_ROLE_ID);

      if (!role) {
        console.log("ROLE NOT FOUND");
        return;
      }

      if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        console.log("NO MANAGE ROLES PERMISSION");
        return;
      }

      await message.member.roles.add(role);
      console.log("ROLE ADDED");
    }
  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.BOT_TOKEN);
