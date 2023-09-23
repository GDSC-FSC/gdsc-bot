import {CacheType, ModalSubmitInteraction} from 'discord.js';
import {InteractionManager} from '../managers/InteractionManager';

export type ModalHandler = (
    interaction: ModalSubmitInteraction<CacheType>
) => Promise<void>;

export function Modal(
    customId: string
): (
    target: new () => any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<ModalHandler>
) => void | TypedPropertyDescriptor<ModalHandler> {
    return (target, propertyKey, descriptor) => {
        InteractionManager.modalHandlers.set(customId, descriptor.value!);
    };
}
