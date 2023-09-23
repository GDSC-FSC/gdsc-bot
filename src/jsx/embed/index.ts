import {APIEmbed, ColorResolvable, Embed as DiscordEmbedClass, EmbedBuilder,} from 'discord.js';
import {Component} from '../Component';
import {Author} from './Author';
import {Field} from './Field';
import {Footer} from './Footer';

export * from './Author';
export * from './Field';
export * from './Footer';

export interface EmbedProps {
    title?: string;
    url?: string;
    color?: ColorResolvable;
    image?: string;
    thumbnail?: string;
    timestamp?: Date | number | true;

    baseData?: APIEmbed | DiscordEmbedClass;
}

export class Embed extends Component<EmbedBuilder> {
    public constructor(props: EmbedProps) {
        super();

        // @ts-expect-error
        this.data = new EmbedBuilder(
            props.baseData instanceof DiscordEmbedClass
                ? props.baseData.toJSON()
                : props.baseData
        );

        if (props.title) this.data.setTitle(props.title);
        if (props.url) this.data.setURL(props.url);
        if (props.color) this.data.setColor(props.color);
        if (props.image) this.data.setImage(props.image);
        if (props.thumbnail) this.data.setThumbnail(props.thumbnail);
        if (props.timestamp === true) this.data.setTimestamp();
        else if (props.timestamp) this.data.setTimestamp(props.timestamp);
    }

    public processChild(child: any): void {
        if (child.instance instanceof Footer) {
            this.data.setFooter({
                text: child.instance.innerText,
                iconURL: child.iconURL,
            });
        }

        if (child.instance instanceof Author) {
            this.data.setAuthor({
                name: child.instance.innerText,
                url: child.url,
                iconURL: child.iconURL,
            });
        }

        if (child.instance instanceof Field) {
            this.data.addFields({
                name: child.name,
                value: child.instance.innerText,
                inline: child.inline,
            });
        }
    }

    public onInnerTextChange(): void {
        this.data.setDescription(this.innerText);
    }
}
