export class Component<T = any> {
    public data!: T & { instance: Component };
    public innerText = '';

    public constructor(data?: any) {
    }

    public processChild(child: any) {
        throw new Error(
            Object.getPrototypeOf(this).constructor.name +
            ' does not support children'
        );
    }

    public onInnerTextChange() {
    }
}
