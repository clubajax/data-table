(() => {
    const btn = dom('button', {class: 'ui-button', html: 'Ok'});
    const input = dom('ui-input', {label: 'Enter Code', value: '321'});
    on(btn, 'click', () => {
        component.emit({value: input.value})
        component.close();
    });
    const component = dom('div', {
        class: 'component',
        html: [
            input,
            dom('div', {
                class: 'tip-button-row',
                html: btn,
            }),
        ],
    });

    window.getFilterComponents = (col) => { 
        return {
            input: component
        }
    }
})();
