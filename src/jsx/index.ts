globalThis.JSX = {
    build(Component, props, ...children) {
        const component = new Component(props);
        for (const child of children) {
            if (typeof child === 'string') {
                component.innerText += child;
                component.onInnerTextChange();
                continue;
            }

            component.processChild(child);
        }

        return component.data;
    },
};

export * from './Modal';
export * from './components';
export * from './embed';
