import { Routes, REST } from 'discord.js';
import 'dotenv/config';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';


// path.direname(fileURLToPath(import.meta.url)) is the equivalent of __dirname in ES6
const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

const collectCommands = async () => {
  const commands = [];
  await Promise.all(commandFiles.map(async (file) => {
    const filePath = path.join(commandsPath, file);
    // convert to file URL so that windows can import ES6 modules correctly
    const fileURL = pathToFileURL(filePath);
    const command = await import(fileURL);
    // console.log(command);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }));
  return commands;
};

// and deploy your commands!
(async () => {
  const commands = await collectCommands();
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    console.log(commands);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();