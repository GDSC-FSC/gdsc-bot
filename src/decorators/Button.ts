import {ButtonInteraction, CacheType} from 'discord.js';
import {InteractionManager} from '../managers/InteractionManager';

export type ButtonHandler = (
    interaction: ButtonInteraction<CacheType>
) => Promise<void>;

export function Button(
    customId: string
): (
    target: new () => any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<ButtonHandler>
) => void | TypedPropertyDescriptor<ButtonHandler> {
    return (target, propertyKey, descriptor) => {
        InteractionManager.buttonHandlers.set(customId, descriptor.value!);
    };
}
