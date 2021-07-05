function getFormatData() {
    return {
        schema: {
            columns: [{
                key: 'money',
                label: 'USD',
                component: {
                    type: 'ui-input',
                    format: 'currency'
                }
            }, {
                key: 'percentage',
                label: '%',
                component: {
                    type: 'ui-input',
                    format: 'percentage'
                }
            }, {
                key: 'months',
                label: 'Months',
                component: {
                    type: 'ui-input',
                    format: 'integer'
                }
            }]
        },
        items: [
            {
                id: 1,
                money: 6,
                percentage: 50,
                months: 6
            }, {
                id: 2,
                money: 1.20,
                percentage: 5,
                months: 1
            }, {
                id: 3,
                money: 0,
                percentage: 99,
                months: 0
            }
        ]
    };
}