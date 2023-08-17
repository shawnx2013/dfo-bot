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
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`);
    console.error(error);
  }
}

export { name, execute };