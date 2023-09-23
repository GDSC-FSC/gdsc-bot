import {Component} from './Component';

declare global {
    namespace JSX {
        function build(
            component: typeof Component,
            props: any,
            ...children: any[]
        ): any;
    }
}
