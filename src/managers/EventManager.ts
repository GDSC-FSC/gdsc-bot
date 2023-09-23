import {Client} from 'discord.js';
import {EventHandler} from '../decorators';

export class EventManager {
    public static eventHandlers = new Map<string, EventHandler<any>[]>();

    public constructor(client: Client) {
        for (const eventHandler of EventManager.eventHandlers) {
            client.on(eventHandler[0], (...args: any[]) => {
                for (const handlers of eventHandler[1]) {
                    handlers(...args);
                }
            });
        }
    }
}
