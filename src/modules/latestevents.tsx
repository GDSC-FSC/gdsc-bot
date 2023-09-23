import {ChatInputCommandInteraction, Client, InteractionReplyOptions, MessagePayload, TextChannel} from 'discord.js';
import {ChatInput} from '../decorators';
import {Embed} from '../jsx';
import db from '../utils/database';

interface Event {
    title: string | null;
    detailsLink: string | null;
    date: string | null;
    activityType: string | null;
    description: string | null;
}

export class EventsModule {
    public static async notifyLatestEvent(client: Client): Promise<void> {
        try {
            const channelId = process.env.notification_channel;

            if (!channelId) {
                throw new Error('Notification channel ID is not defined');
            }

            const channel = client.channels.cache.get(channelId) as TextChannel;
            if (!channel) throw new Error('Channel not found');

            const query = `SELECT *
                           FROM events
                           ORDER BY id DESC
                           LIMIT 1`;
            const stmt = db.prepare(query);
            const event: Event | undefined = stmt.get() as Event | undefined;
            if (!event) throw new Error('No events found');

            const baseURL = 'https://gdsc.community.dev';
            const embed: MessagePayload | InteractionReplyOptions = {
                embeds: [
                    <Embed color="Green" title={event.title || 'Untitled Event'}>
                        {event.date && `${event.date}\n`}
                        {event.activityType && `${event.activityType}\n`}
                        {event.description && `${event.description}\n`}
                        {event.detailsLink && `[Details](${baseURL}${event.detailsLink})\n`}
                    </Embed>,
                ],
            };

            await channel.send({
                content: 'A New Event Has Been Posted! ||@everyone||',
                embeds: embed.embeds
            });

        } catch (e) {
            console.error(e);
        }
    }

    @ChatInput('events')
    public static async handleEventsCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommandName = interaction.options.getSubcommand();

        switch (subcommandName) {
            case 'latest':
                return EventsModule.latestEvent(interaction);
            case 'list':
                return EventsModule.listEvents(interaction);
            default:
                await interaction.reply({content: `Unknown subcommand: ${subcommandName}`, ephemeral: true});
        }
    }


    public static async latestEvent(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            await interaction.reply({content: 'Fetching the latest event...', ephemeral: true});

            const query = `SELECT *
                           FROM events
                           ORDER BY id DESC
                           LIMIT 1`;
            const stmt = db.prepare(query);
            const event: Event | undefined = stmt.get() as Event | undefined;

            if (!event) {
                await interaction.editReply({content: 'No events found!'});
                return;
            }

            const baseURL = 'https://gdsc.community.dev';
            const embed: MessagePayload | InteractionReplyOptions = {
                embeds: [
                    <Embed color="Green" title={event.title || 'Untitled Event'}>
                        {event.date && `${event.date}\n`}
                        {event.activityType && `${event.activityType}\n`}
                        {event.description && `${event.description}\n`}
                        {event.detailsLink && `[Details](${baseURL}${event.detailsLink})\n`}
                    </Embed>,
                ],
            };

            await interaction.editReply({content: '', ...embed});
        } catch (e) {
            console.error(e);
            await interaction.editReply({content: 'An error occurred while fetching the latest event.'});
        }
    }


    private static async listEvents(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ephemeral: true});

        try {
            const limit = interaction.options.getInteger('limit') || 5;
            const query = `SELECT *
                           FROM events
                           ORDER BY id DESC
                           LIMIT ?`;
            const stmt = db.prepare(query);
            const events: Event[] = stmt.all(limit).map((event) => event as Event);

            if (events.length === 0) {
                await interaction.editReply({content: 'No events found!'});
                return;
            }

            const baseURL = 'https://gdsc.community.dev';
            const embeds = events.map((event) => (
                <Embed color="Green" title={event.title || 'Untitled Event'}>
                    {event.date && `${event.date}\n`}
                    {event.activityType && `${event.activityType}\n`}
                    {event.description && `${event.description}\n`}
                    {event.detailsLink && `[Details](${baseURL}${event.detailsLink})\n`}
                </Embed>
            ));

            await interaction.editReply({embeds});
        } catch (e) {
            console.error(e);
            await interaction.editReply({content: 'An error occurred while fetching the events.'});
        }
    }
}
