import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for a character')
  .addStringOption(option =>
    option.setName('character_name')
      .setDescription('Characeter to look up')
      .setRequired(true),
  )
  .addStringOption(option =>
    option.setName('character_server')
      .setDescription('Character server')
      .setRequired(true)
      .addChoices(
        { name: 'Cain', value: 'cain' },
        { name: 'Sirocco', value: 'sirocco' },
      ),
  );

async function execute(interaction) {
  await interaction.reply(`Ping from ${interaction.user.username}.`);
}

export { data, execute };