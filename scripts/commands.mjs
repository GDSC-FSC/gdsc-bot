import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const commands = JSON.parse(
  await readFile(join(process.cwd(), 'commands.json'), 'utf-8')
);

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: commands }
);

console.log('Successfully reloaded application (/) commands.');
