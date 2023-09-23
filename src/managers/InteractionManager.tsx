import {Client, Interaction} from 'discord.js';
import {AutoCompleteHandler, ButtonHandler, ChatInputHandler, ModalHandler, UserCommandHandler,} from '../decorators';
import {Embed} from '../jsx';
import db from '../utils/database';

export class InteractionManager {
    public static chatInputHandlers = new Map<string, ChatInputHandler>();
    public static buttonHandlers = new Map<string, ButtonHandler>();
    public static modalHandlers = new Map<string, ModalHandler>();
    public static userCommandHandlers = new Map<string, UserCommandHandler>();
    public static autoCompleteHandlers = new Map<string, AutoCompleteHandler>();

    private static getHandler(interaction: Interaction) {
        if (interaction.isChatInputCommand())
            return InteractionManager.chatInputHandlers;
        else if (interaction.isButton()) return InteractionManager.buttonHandlers;
        else if (interaction.isModalSubmit())
            return InteractionManager.modalHandlers;
        else if (interaction.isUserContextMenuCommand())
            return InteractionManager.userCommandHandlers;
        else if (interaction.isAutocomplete())
            return InteractionManager.autoCompleteHandlers;

        throw new Error('Couldn\'t find a handler for this interaction!');
    }

    public static getIdentifier(interaction: Interaction) {
        if (
            interaction.isChatInputCommand() ||
            interaction.isUserContextMenuCommand()
        )
            return interaction.commandName;
        else if (interaction.isButton() || interaction.isModalSubmit())
            return interaction.customId;
        else if (interaction.isAutocomplete())
            return `${interaction.commandName}-${
                interaction.options.getFocused(true).name
            }`;

        throw new Error('Couldn\'t find an identifier for this interaction!');
    }

    public constructor(client: Client) {
        client.on('interactionCreate', async (interaction): Promise<any> => {
            try {
                interface CustomCommandRow {
                    name: string;
                    description: string;
                    value: string;
                    color: string;
                }

                const handlers = InteractionManager.getHandler(interaction);
                const identifier = InteractionManager.getIdentifier(interaction);

                const handler = handlers.get(identifier);

                if (!handler) {
                    if (interaction.isChatInputCommand()) {
                        const stmt = db.prepare('SELECT * FROM custom_commands WHERE name = ?');
                        const res = stmt.get(interaction.commandName) as CustomCommandRow | undefined;

                        if (res) {
                            return await interaction.reply({
                                embeds: [
                                    <Embed color={parseInt(res.color, 16)}>{res.value}</Embed>,
                                ],
                            });
                        }
                    }

                    if (interaction.isRepliable()) {
                        console.warn(
                            `Interaction (type=${interaction.type}) "${identifier}" has no handler!`
                        );

                        await interaction.reply({
                            embeds: [
                                <Embed color="Red" title="🥖 A french error occurred!">
                                    {
                                        'Unfortunately for you the interaction you triggered can\'t be executed due to an internal problem!\n\nError code: `ERR_NO_HANDLER`'
                                    }
                                </Embed>,
                            ],
                            ephemeral: true,
                        });
                    }

                    return;
                }

                // @ts-ignore
                handler(interaction);
            } catch (error) {
                console.error(error);
            }
        });
    }
}