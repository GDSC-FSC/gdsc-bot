import {CacheType, UserContextMenuCommandInteraction} from 'discord.js';
import {InteractionManager} from '../managers/InteractionManager';

export type UserCommandHandler = (
    interaction: UserContextMenuCommandInteraction<CacheType>
) => Promise<void>;

export function UserCommand(
    commandName: string
): (
    target: new () => any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<UserCommandHandler>
) => void | TypedPropertyDescriptor<UserCommandHandler> {
    return (target, propertyKey, descriptor) => {
        InteractionManager.userCommandHandlers.set(commandName, descriptor.value!);
    };
}
