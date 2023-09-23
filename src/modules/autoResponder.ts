import {EmbedBuilder, Message} from 'discord.js';
import {Event} from '../decorators';
import {getConfig} from '../utils/config';

class AutoResponderModule {
    private static cooldowns: Map<string, number> = new Map();

    @Event('messageCreate')
    public static async onMessage(message: Message) {
        if (message.author.bot || message.channel.isDMBased()) return;

        const config = await getConfig();
        const rules = config.autoResponder;
        const cooldownDuration = 30000; // 30 seconds

        const now = Date.now();
        const authorId = message.author.id;
        const lastTriggerTime = AutoResponderModule.cooldowns.get(authorId);

        if (lastTriggerTime && now - lastTriggerTime < cooldownDuration) {
            return;
        }

        for (const rule of rules) {
            if (
                rule.includes.some((v) => {
                    if (v.startsWith('REGEX_')) {
                        const exp = new RegExp(v.replace('REGEX_', ''));
                        const execArray = exp.exec(message.content);
                        return execArray !== null && execArray.length > 0;
                    } else {
                        return (
                            message.content.includes(v) &&
                            [' ', undefined].includes(
                                message.content[message.content.indexOf(v) + v.length]
                            )
                        );
                    }
                })
            ) {
                if (!rule.message && !rule.embed) return;

                await message.reply({
                    content: rule.message,
                    embeds: rule.embed ? [new EmbedBuilder(rule.embed)] : undefined,
                });

                AutoResponderModule.cooldowns.set(authorId, now);
                setTimeout(() => {
                    AutoResponderModule.cooldowns.delete(authorId);
                }, cooldownDuration);
            }
        }
    }
}
