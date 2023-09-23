import {Component} from '../Component';

export interface FieldProps {
    name: string;
    inline?: boolean;
}

export class Field extends Component<FieldProps> {
    public constructor(props: FieldProps) {
        super();
        this.data = {...props, instance: this};
    }
}
