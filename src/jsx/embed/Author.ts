import {Component} from '../Component';

export interface AuthorProps {
    url?: string;
    iconURL?: string;
}

export class Author extends Component<AuthorProps> {
    public constructor(props: AuthorProps) {
        super();
        this.data = {...props, instance: this};
    }
}
