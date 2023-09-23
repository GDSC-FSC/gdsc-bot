import {CacheType, ChatInputCommandInteraction} from 'discord.js';
import {InteractionManager} from '../managers/InteractionManager';

export type ChatInputHandler = (
    interaction: ChatInputCommandInteraction<CacheType>
) => Promise<void>;

export function ChatInput(
    commandName: string
): (
    target: new () => any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<ChatInputHandler>
) => void | TypedPropertyDescriptor<ChatInputHandler> {
    return (target, propertyKey, descriptor) => {
        InteractionManager.chatInputHandlers.set(commandName, descriptor.value!);
    };
}
