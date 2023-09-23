import {ButtonBuilder, ButtonStyle} from 'discord.js';
import {Component} from '../Component';

export interface ButtonProps {
    customId: string;
    style: 'primary' | 'secondary' | 'success' | 'danger' | 'link';
    emoji?: string;
    url?: string;
    disabled?: boolean;
}

const styles: Record<ButtonProps['style'], ButtonStyle> = {
    primary: 1,
    secondary: 2,
    success: 3,
    danger: 4,
    link: 5,
};

export class Button extends Component<ButtonBuilder> {
    public constructor(props: ButtonProps) {
        super();

        // @ts-expect-error
        this.data = new ButtonBuilder();

        this.data.setCustomId(props.customId);
        this.data.setStyle(styles[props.style]);
        if (typeof props.emoji === 'string') this.data.setEmoji(props.emoji);
        if (typeof props.url === 'string') this.data.setURL(props.url);
        if (typeof props.disabled === 'boolean')
            this.data.setDisabled(props.disabled);
    }

    public onInnerTextChange(): void {
        this.data.setLabel(this.innerText);
    }
}
