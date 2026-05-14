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
  ],
});

const bannedTriggers = [
  "discord.gg/",
  "free nitro",
  "nigger",
"expected",
];

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  const brokenRule = bannedTriggers.find((trigger) =>
    content.includes(trigger.toLowerCase())
  );

  if (!brokenRule) return;

  const member = message.member;
  const bannedRole = message.guild.roles.cache.get(process.env.BANNED_ROLE_ID);

  if (!bannedRole) return;

  await member.roles.add(bannedRole);

  await message.delete().catch(() => {});

  const logChannel = message.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);

  if (logChannel) {
    logChannel.send(
      `🚫 ${member.user.tag} was given the BANNED role.\nReason: ${brokenRule}`
    );
  }
});

client.login(process.env.BOT_TOKEN);