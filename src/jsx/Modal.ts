import {ActionRowBuilder, ModalBuilder, TextInputBuilder} from 'discord.js';
import {Component} from './Component';

export * from './components/TextInput';

export interface ModalProps {
    customId: string;
}

export class Modal extends Component<ModalBuilder> {
    public constructor(props: ModalProps) {
        super();

        // @ts-expect-error
        this.data = new ModalBuilder();

        this.data.setCustomId(props.customId);
    }

    public processChild(child: any): void {
        if (child instanceof TextInputBuilder) {
            this.data.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(child)
            );
        }
    }

    public onInnerTextChange(): void {
        this.data.setTitle(this.innerText);
    }
}
