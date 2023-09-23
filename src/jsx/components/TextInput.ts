import {TextInputBuilder, TextInputStyle} from 'discord.js';
import {Component} from '../Component';

export interface TextInputProps {
    customId: string;
    maxLength?: number;
    minLength?: number;
    placeholder?: string;
    required?: boolean;
    value?: string;
    style: 'short' | 'paragraph';
}

export class TextInput extends Component<TextInputBuilder> {
    public constructor(props: TextInputProps) {
        super();

        // @ts-expect-error
        this.data = new TextInputBuilder();

        this.data.setCustomId(props.customId);
        if (typeof props.maxLength === 'number')
            this.data.setMaxLength(props.maxLength);
        if (typeof props.minLength === 'number')
            this.data.setMinLength(props.minLength);
        if (typeof props.placeholder === 'string')
            this.data.setPlaceholder(props.placeholder);
        if (typeof props.required === 'boolean')
            this.data.setRequired(props.required);
        if (typeof props.value === 'string') this.data.setValue(props.value);
        this.data.setStyle(
            props.style === 'short' ? TextInputStyle.Short : TextInputStyle.Paragraph
        );
    }

    public onInnerTextChange(): void {
        this.data.setLabel(this.innerText);
    }
}
