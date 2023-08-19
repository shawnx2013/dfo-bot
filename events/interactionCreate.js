import { Events } from 'discord.js';

const name = Events.InteractionCreate;

async function execute(interaction) {
  if (!interaction.isChatInputCommand()) return;

  console.log(interaction.commandName + ' is called');
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await interaction.deferReply({ epemeral: true });
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`);
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({ content: 'There was an error executing this command' });
    } else {
      await interaction.reply({ content: 'There was an error executing this command' });
    }
  }
}

export { name, execute };