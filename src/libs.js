if (IS_JK) {
    module.exports = {
        BaseComponent: require('@janiking-org/base-component'),
        dom: require('@janiking-org/dom'),
        on: require('@janiking-org/on'),
        form: require('@janiking-org/form'),
        formatters: require('@janiking-org/format'),
    };
} else {
    module.exports = {
        BaseComponent: require('@clubajax/base-component'),
        dom: require('@clubajax/dom'),
        on: require('@clubajax/on'),
        form: require('@clubajax/form'),
        formatters: require('@clubajax/format'),
    };
}
