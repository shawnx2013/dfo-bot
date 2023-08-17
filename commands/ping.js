import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

async function execute(interaction) {
  await interaction.reply(`Ping from ${interaction.user.username}.`);
}

export { data, execute };