import {ClientEvents} from 'discord.js';
import {EventManager} from '../managers/EventManager';

export type EventHandler<T extends keyof ClientEvents> = (
    ...args: ClientEvents[T]
) => Promise<void>;

export function Event<T extends keyof ClientEvents>(
    event: T
): (
    target: new () => any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<EventHandler<T>>
) => void | TypedPropertyDescriptor<EventHandler<T>> {
    return (target, propertyKey, descriptor) => {
        if (EventManager.eventHandlers.has(event)) {
            EventManager.eventHandlers.get(event)!.push(descriptor.value!);
        } else {
            EventManager.eventHandlers.set(event, [descriptor.value!]);
        }
    };
}
