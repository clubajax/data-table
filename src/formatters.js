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

function stripLeadingZeros(value) {
    while (value.length && value[0] === '0') {
        value = value.substring(1);
    }
    return value;
}

function formatMoney(amount) {
    let str = toDecimal(amount.toString());
    const neg = /^-/.test(str) ? '-' : '';
    str = str.replace('-', '');
    const cents = /\./.test(str) ? formatCents(str.split('.')[1]) : '00';
    const dollars = split(str.split('.')[0], 3).join(',') || '0';
    return `${neg}$${dollars}.${cents}`;
}

function formatCents(amount) {
    let amt = parseFloat(`0.${amount}`);
    // 0.009
    amt = Math.round(amt * 100);
    return amt > 9 ? `${amt}` : `0${amt}`;
}

function formatPhone(number) {
    const n = number.toString().match(/\d/g).join('');
    return `(${n.substring(0, 3)}) ${n.substring(3, 6)}-${n.substring(6)}`;
}

function toDecimal(value) {
    value = toString(value).replace('$', '');
    const result = value.match(/-*\d|\./g);
    if (result) {
        return stripLeadingZeros(result.join(''));
    }
    return '';
}

function toString(value) {
    if (value === null || value === undefined) {
        return '';
    }
    return value.toString();
}


const formatters = {
    accounting: {
        fromHtml(value) {
            const isNeg = /^\(|^-/.test(value);
            return (isNeg ? '-' : '') + (toDecimal(value).replace('-', ''));
        },
        toHtml(value) {
            if (value === 0) {
                return '$0.00';
            }
            if (!value) {
                return SPACE;
            }
            value = formatters.currency.toHtml(value);
            if (/^-/.test(value)) {
                value = `(${value.replace('-', '')})`;
            }
            return value;
        },
    },
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
            return formatMoney(value).replace('$-', '-$');
        },
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
        },
    },
    integer: {
        fromHtml(value) {
            return formatters.integer.toHtml(value);
        },
        toHtml(value) {
            const isNeg = /^-/.test(value);
            return (isNeg ? '-' : '') + toString(value).split('.')[0].replace(/\D/g, '');
        },
    },
    default: {
        fromHtml(value) {
            return value;
        },
        toHtml(value) {
            return value;
        },
    },
};

module.exports = formatters;