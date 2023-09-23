import {Component} from '../Component';

export interface FooterProps {
    iconURL?: string;
}

export class Footer extends Component<FooterProps> {
    public constructor(props: FooterProps) {
        super();
        this.data = {...props, instance: this};
    }
}
