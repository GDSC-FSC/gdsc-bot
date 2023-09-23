import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedData, ModalSubmitInteraction,} from 'discord.js';
import {AutoComplete, ChatInput, Modal} from '../decorators';
import {Modal as ModalC, TextInput} from '../jsx';
import {addAutoResponder, getConfig, reloadConfig, removeAutoResponder,} from '../utils/config';
import db from '../utils/database';

const autoResponderModalId = 'autoresponder';
const triggerPhraseInputId = 'trigger-phrase';
const responseInputId = 'response-message';
const embedImageInputId = 'embed-image';
const useEmbedInputId = 'use-embed';

const autoResponderModal = (
    <ModalC customId={autoResponderModalId}>
        Create an auto-response rule
        <TextInput
            customId={triggerPhraseInputId}
            required={true}
            placeholder="Trigger Phrase"
            style="short"
        >
            What phrase should trigger the autoresponse?
        </TextInput>
        <TextInput
            customId={responseInputId}
            required={true}
            placeholder="Auto-Response Message"
            style="short"
        >
            What should the bot respond with?
        </TextInput>
        <TextInput
            customId={useEmbedInputId}
            required={true}
            placeholder="Use Embed YES / NO"
            style="short"
        >
            Embed the response? YES or NO.
        </TextInput>
        <TextInput
            customId={embedImageInputId}
            required={false}
            placeholder="Embed Image URL (optional)"
            style="short"
        >
            Direct link for embed image.
        </TextInput>
    </ModalC>
);

interface AutoResponderRow {
    trigger_phrase: string;
}

class AutoResponderModule {
    @ChatInput('autoresponder')
    public static async command(interaction: ChatInputCommandInteraction) {
        const subCommand = interaction.options.getSubcommand();
        const triggerPhrase = interaction.options.getString('triggerphrase');

        if (subCommand === 'reload') {
            await reloadConfig();
            await interaction.reply({
                content: 'Config reloaded!',
                ephemeral: true,
            });
        }

        if (subCommand === 'add') {
            await interaction.showModal(autoResponderModal);
        }

        if (subCommand === 'remove') {
            const triggerPhrase = interaction.options.getString('triggerphrase');
            if (triggerPhrase) {
                await removeAutoResponder(triggerPhrase);
                await reloadConfig();
                await interaction.reply({
                    content: 'Auto-response rule removed!',
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: 'Rule not found!',
                    ephemeral: true,
                });
            }
        }

        if (subCommand === 'view') {
            const config = await getConfig();
            const autoResponderRules = config.autoResponder;

            if (autoResponderRules.length === 0) {
                await interaction.reply({
                    content: 'No auto-responder rules found!',
                    ephemeral: true,
                });
                return;
            }

            const embedDescription = autoResponderRules
                .map(
                    (rule, index) =>
                        `${index + 1}. Trigger: ${rule.includes.join(', ')} | Response: ${
                            rule.message || '(Embed)'
                        }`
                )
                .join('\n');

            const embed = {
                title: 'Auto-Responder Rules',
                description: embedDescription,
                color: parseInt('ff8201', 16),
            };

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    }

    @Modal(autoResponderModalId)
    public static async autoResponderModalSubmit(
        interaction: ModalSubmitInteraction
    ) {
        const triggerPhrase =
            interaction.fields.getTextInputValue(triggerPhraseInputId);
        const responseMessage =
            interaction.fields.getTextInputValue(responseInputId);
        const embedImageUrl =
            interaction.fields.getTextInputValue(embedImageInputId);
        1;
        const useEmbed =
            interaction.fields.getTextInputValue(useEmbedInputId).toLowerCase() ===
            'yes';

        const embedData: EmbedData | undefined = useEmbed
            ? {
                title: 'Auto Response',
                description: responseMessage,
                image: embedImageUrl ? {url: embedImageUrl} : undefined,
                color: parseInt('ff8201', 16),
            }
            : undefined;

        addAutoResponder(
            triggerPhrase,
            useEmbed ? undefined : responseMessage,
            embedData
        );

        await interaction.reply({
            content: 'Auto-response rule added!',
            ephemeral: true,
        });
    }

    @AutoComplete('autoresponder', 'trigger_phrase')
    public static async autoResponderAutoComplete(
        interaction: AutocompleteInteraction
    ) {
        const safeSearchString = interaction.options.getFocused().replace(/'/g, '\'\'');
        const sqlQuery = db.prepare(`
            SELECT trigger_phrase
            FROM autoresponders
            WHERE LOWER(trigger_phrase) LIKE LOWER(?)
            ORDER BY trigger_phrase ASC`);
        const rows = sqlQuery.all('%' + safeSearchString + '%') as AutoResponderRow[];

        await interaction.respond(
            rows.map((v: AutoResponderRow) => ({
                name: v.trigger_phrase,
                value: v.trigger_phrase,
            }))
        );
    }
}