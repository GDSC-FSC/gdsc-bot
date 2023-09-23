import {ActionRowBuilder, ButtonBuilder, TextInputBuilder} from 'discord.js';
import {Component} from '../Component';

export class ActionRow extends Component<ActionRowBuilder> {
    public constructor(props: {}) {
        super();

        // @ts-expect-error
        this.data = new ActionRowBuilder();
    }

    public processChild(child: any): void {
        const supportedBuilders = [ButtonBuilder, TextInputBuilder];

        let valid = false;
        for (const builder of supportedBuilders) {
            if (child instanceof builder) {
                valid = true;
                break;
            }
        }

        if (valid) this.data.addComponents(child);
    }
}
