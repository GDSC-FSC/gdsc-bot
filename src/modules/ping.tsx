import {ChatInputCommandInteraction} from 'discord.js';
import {ChatInput} from '../decorators';
import {Embed} from '../jsx';
import {client} from '..';

class PingModule {
    @ChatInput('ping')
    public static async ping(interaction: ChatInputCommandInteraction) {
        const ephemeralOption = interaction.options.getBoolean('ephemeral');
        const isEphemeral =
            typeof ephemeralOption === 'boolean' ? ephemeralOption : true;

        await interaction.deferReply({ephemeral: isEphemeral});

        const latency = client.ws.ping;

        try {
            await interaction.editReply({
                embeds: [
                    <Embed color="Green" title="Pong!">
                        {`Discord API: ${latency}ms`}
                    </Embed>,
                ],
            });
        } catch (e) {
            console.error(e);
        }
    }
}
