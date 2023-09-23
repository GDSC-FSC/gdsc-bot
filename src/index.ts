import 'dotenv/config';
import './jsx';

import {Client, Partials} from 'discord.js';

import {EventManager} from './managers/EventManager';
import {InteractionManager} from './managers/InteractionManager';
import './modules';
import {getConfig} from './utils/config';

export let client: Client;

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

(async () => {
    try {
        await getConfig();

        client = new Client({
            intents: [
                'Guilds',
                'GuildMembers',
                'GuildBans',
                'MessageContent',
                'GuildMessages',
                'DirectMessages',
                'GuildPresences',
                'GuildInvites',
                'GuildVoiceStates',
                'AutoModerationExecution',
            ],
            partials: [Partials.GuildMember, Partials.Message, Partials.Channel],
        });

        client.on('ready', () => {
            console.log(`Logged in as ${client.user?.username}!`);
        });

        client.on('error', (error) => {
            console.error('Discord.js Client Error:', error);
        });

        new InteractionManager(client);
        new EventManager(client);

        client.login(process.env.TOKEN);
    } catch (error) {
        console.error('Error occurred:', error);
    }
})();
