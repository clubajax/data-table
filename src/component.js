require('@clubajax/form');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');

//
// helpers
//
const SPACE = '&nbsp;';

function split(str, chunkAmount) {
    // splits a string into segments, based on an amount, not a char
    // ex: split('123456789', 3) => ['123', '456', '789']
    const chunks = [];
    while (str.length) {
        chunks.unshift(str.substring(str.length - chunkAmount, str.length));
        str = str.substring(0, str.length - chunkAmount);
    }
    return chunks;
}

function formatMoney (amount) {
    const str = toDecimal(amount.toString());
    const cents = /\./.test(str) ? formatCents(str.split('.')[1]) : '00';
    const dollars = split(str.split('.')[0], 3).join(',');
    return `$${dollars}.${cents}`;
}

function formatCents (amount) {
    let amt = parseFloat(`0.${amount}`);
    // 0.009
    amt = Math.round(amt * 100);
    return amt > 9 ? `${amt}` : `0${amt}`;
}

function formatPhone(number) {
    const n = number.toString().match(/\d/g).join('');
    return `(${n.substring(0,3)}) ${n.substring(3,6)}-${n.substring(6)}`;
}

function toDecimal(value) {
    const result = value.toString().match(/\d|\./g);
    if (result) {
        return result.join('');
    }
    return '';
}
//
// formatters
//
function toHtml(value, formatter) {
    if (value === null || value === undefined || value === '') {
        return SPACE;
    }
    return formatter.toHtml(value);
}

function fromHtml(value, formatter) {
    // value = dom.normalize(value);
    value = value === SPACE ? '' : value;
    return formatter.fromHtml(value);
}

const formatters = {
    currency: {
        fromHtml(value) {
            return toDecimal(value);
        },
        toHtml(value) {
            if (value === 0) {
                return '$0.00';
            }
            if (!value) {
                return SPACE;
            }
            return formatMoney(value);
        }
    },
    percentage: {
        fromHtml(value) {
            return toDecimal(value);
        },
        toHtml(value) {
            if (value === 0) {
                return '0%';
            }
            if (!value) {
                return SPACE;
            }
            return toDecimal(value) + '%';
        }
    },
    integer: {
        fromHtml(value) {
            return value.toString().replace(/\D/g, '');
        },
        toHtml(value) {
            return value.toString().replace(/\D/g, '');
        }
    },
    default: {
        fromHtml(value) {
            return value;
        },
        toHtml(value) {
            return value;
        }
    }
}

//
// components
//
function createLink(col, item) {
    return dom('a', {
        href: item[col.component.url],
        html: item[col.key]
    });
}

function createInput(col, item) {
    const formatter = formatters[col.component.format] || formatters.default;
    function edit(node) {
        const parent = node.parentNode;
        let hadWidth = true;
        if (!parent.style.width) {
            hadWidth = false;
            dom.style(parent, 'width', dom.box(parent).w);
        }
        parent.removeChild(node);
        let exitTimer;
        const input = dom('ui-input', {
            type: col.component.subtype || 'text',
            value: fromHtml(node.textContent, formatter)
        }, parent);
        
        input.onDomReady(() => {
            input.input.focus();
        });

        const destroy = () => {
            parent.appendChild(node);
            input.destroy();
            if (!hadWidth) {
                dom.style(parent, 'width', '');
            }
        };

        input.on('blur', () => {
            destroy();
        });

        input.on('keyup', (e) => {
            exitTimer = setTimeout(() => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    destroy();
                }
            }, 1);
            
        });

        input.on('change', (e) => {
            e.stopPropagation();
            node.innerHTML = toHtml(e.value, formatter);
            destroy();
            item[col.key] = formatter.fromHtml(e.value, formatter);
            on.emit(node, 'change', {value: item});
            clearTimeout(exitTimer);
        });
    }
    return dom('div', {
        class: 'td-editable',
        html: formatter.toHtml(item[col.key]) || '&nbsp;',
        tabindex: '0',
        onClick() {
            edit(this);
        },
        onKeyup(e) {
            if (e.key === 'Enter') {
                edit(this);
            }
        }
    });
}

function createDropdown(col, item) {
    const input = dom('ui-dropdown', {
        data: col.component.options,
        value: item[col.key]
    });
    input.on('change', (e) => {
        e.stopPropagation();
        if (!e || e.value == undefined) {
            return;
        }
        item[col.key] = e.value;
        on.emit(input.parentNode, 'change', {value: item});
    });
    return input;
}

function createCheckbox(col, item) {
    const input = dom('ui-checkbox', {
        value: item[col.key]
    });
    input.on('change', (e) => {
        e.stopPropagation();
        if (!e || e.value == undefined) {
            return;
        }
        item[col.key] = e.value;
        on.emit(input.parentNode, 'change', {value: item});
    });
    return input;
}

function createComponent(col, item) {
    switch (col.component.type) {
        case 'link':
            return createLink(col, item);
        case 'ui-input':
            return createInput(col, item);
        case 'ui-dropdown':
            return createDropdown(col, item);
        case 'ui-checkbox':
            return createCheckbox(col, item);
        default:
            return item[col.key];
    }
}

module.exports = createComponent;
