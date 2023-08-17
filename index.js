// Require the necessary discord.js classes
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// path.direname(fileURLToPath(import.meta.url)) is the equivalent of __dirname in ES6
const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

commandFiles.map(async (file) => {
  const filePath = path.join(commandsPath, file);
  // convert to file URL so that windows can import ES6 modules correctly
  const fileURL = pathToFileURL(filePath);
  const command = await import(fileURL);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
});

const eventsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'events');

const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

eventFiles.map(async (file) => {
  const filePath = path.join(eventsPath, file);
  const fileURL = pathToFileURL(filePath);
  const event = await import(fileURL);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
