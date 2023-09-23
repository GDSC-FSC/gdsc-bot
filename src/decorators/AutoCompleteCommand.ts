import {AutocompleteInteraction, CacheType} from 'discord.js';
import {InteractionManager} from '../managers/InteractionManager';

export type AutoCompleteHandler = (
    interaction: AutocompleteInteraction<CacheType>
) => Promise<void>;

export function AutoComplete(
    commandName: string,
    argName: string
): (
    target: new () => any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<AutoCompleteHandler>
) => void | TypedPropertyDescriptor<AutoCompleteHandler> {
    return (target, propertyKey, descriptor) => {
        InteractionManager.autoCompleteHandlers.set(
            `${commandName}-${argName}`,
            descriptor.value!
        );
    };
}
