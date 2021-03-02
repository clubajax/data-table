function getTotals() {
    const data = {
        schema: {
            totals: [
                {},
                {},
                {
                    label: 'Total',
                    align: 'right',
                },
                {
                    callback(items, col) {
                        return items.reduce((a, m) => { 
                            return a + m.invoices;
                        }, 0);
                    },
                },
                {
                    callback(items, col) {
                        return items.reduce((a, m) => { 
                            return a + m.amount;
                        }, 0);
                    },
                },
                {
                    callback(items, col) {
                        return items.reduce((a, m) => { 
                            return a + m.tax;
                        }, 0);
                    },
                },
                {
                    class: 'total',
                    callback(items, col) {
                        return items.reduce((a, m) => { 
                            return a + m.total;
                        }, 0);
                    },
                },
            ],
            columns: [
                {
                    label: '',
                    key: 'checked',
                    component: {
                        type: 'ui-checkbox',
                        all: true
                    }
                },
                {
                    label: 'Region',
                    key: 'region',
                },
                {
                    label: 'CPI',
                    key: 'cpi',
                    width: '100%',
                    align: 'center',
                    format: 'checkbox',
                },
                {
                    label: 'Invoices',
                    key: 'invoices',
                    align: 'center',
                    bordered: true,
                },
                {
                    label: 'Amount',
                    key: 'amount',
                    format: 'accounting',
                    bordered: true,
                },
                {
                    label: 'Tax',
                    key: 'tax',
                    format: 'accounting',
                    bordered: true,
                },
                {
                    label: 'Total',
                    key: 'total',
                    format: 'accounting',
                    bordered: true,
                },
                {
                    label: 'Status',
                    key: 'status',
                    align: 'center',
                },
            ],
        },
        items: [
            {
                id: 1,
                region: 'Dallas',
                cpi: true,
                invoices: 20,
                amount: 100,
                tax: 10,
                total: 110,
                status: 'Ready',
            },
            {
                id: 2,
                region: 'Walo Walo',
                cpi: false,
                invoices: 40,
                amount: 220,
                tax: 15,
                total: 235,
                status: 'Broke',
                checked: true
            },
            {
                id: 3,
                region: 'Kukamunga',
                cpi: false,
                invoices: 2,
                amount: 20,
                tax: 5,
                total: 25,
                status: 'Done',
                checked: true,
                disabled: true
            },
            {
                id: 4,
                region: 'Chatanooga',
                cpi: true,
                invoices: 6,
                amount: 45,
                tax: 10,
                total: 55,
                status: 'Done',
                checked: true,
                disabled: true
            },
        ],
    };
    return data;
}
