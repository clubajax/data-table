function getInputData({noRemove, noEdit}) {
    const inputSchema = {
        sort: true,
        columns: [
            {
                key: 'name',
                label: 'Name'
            },
            {
                key: 'fromAmount',
                label: 'Monthly Billing From',
                component: {
                    type: 'ui-input',
                    format: 'currency',
                },
            },
            {
                key: 'toAccount',
                label: 'Monthly Billing To',
                component: {
                    type: 'ui-input',
                    format: 'currency',
                },
            },
            {
                key: 'downpaymentPercentage',
                label: 'Down Payment',
                component: {
                    type: 'ui-input',
                    format: 'percentage',
                },
            },
            {
                key: 'monthlyPercentage',
                label: 'Monthly Payment',
                component: {
                    type: 'ui-checkbox',
                },
            },
            {
                key: 'months',
                label: 'Months',
                component: {
                    type: 'ui-dropdown',
                    options: [
                        {
                            label: 'one',
                            value: 1
                        }, {
                            label: 'dos',
                            value: 2
                        }, {
                            label: 'tre',
                            value: 3
                        }
                    ]
                },
            },
            {
                icon: 'edit',
                component: {
                    type: 'edit-rows',
                    noRemove,
                    noEdit
                },
            },
        ],
    };

    const inputData = {
        schema: inputSchema,
        items: [
            {
                id: 1,
                typeId: 2000,
                fromAmount: 5,
                toAccount: 1500,
                downpaymentPercentage: 60,
                monthlyPercentage: 20,
                months: 13,
                name: 'Monthly Billing To',
            },
            {
                id: 2,
                typeId: 2000,
                fromAmount: -1500,
                toAccount: 3000,
                downpaymentPercentage: 40,
                monthlyPercentage: 15,
                months: 20,
                name: 'Monthly Billing To',
            },
            {
                id: 3,
                typeId: 2000,
                fromAmount: -3000,
                toAccount: 6000,
                downpaymentPercentage: 30,
                monthlyPercentage: 10,
                months: 30,
                name: 'Monthly Billing To',
            },
            {
                id: 4,
                typeId: 2000,
                fromAmount: 6000,
                toAccount: -10000,
                downpaymentPercentage: 15,
                monthlyPercentage: 10,
                months: 32,
                name: 'Monthly Billing To',
            },
            {
                id: 5,
                typeId: 2000,
                fromAmount: 10000,
                toAccount: null,
                downpaymentPercentage: 5,
                monthlyPercentage: 5,
                months: 65,
                name: 'Monthly Billing To',
            },
            {
                id: 6,
                typeId: 2001,
                fromAmount: 50,
                toAccount: 3000,
                downpaymentPercentage: 30,
                monthlyPercentage: 5,
                months: 72,
                name: 'Monthly Billing From',
            },
            {
                id: 7,
                typeId: 2001,
                fromAmount: 3000,
                toAccount: 6000,
                downpaymentPercentage: 15,
                monthlyPercentage: 5,
                months: 72,
                name: 'Monthly Billing From',
            },
            {
                id: 8,
                typeId: 2001,
                fromAmount: 6000,
                toAccount: null,
                downpaymentPercentage: 5,
                monthlyPercentage: 5,
                months: 72,
                name: 'Monthly Billing From',
            },
            {
                id: 9,
                typeId: 2002,
                fromAmount: null,
                toAccount: null,
                downpaymentPercentage: 20,
                monthlyPercentage: 10,
                months: null,
                name: 'Down Payment',
            },
            {
                id: 10,
                typeId: 2003,
                fromAmount: null,
                toAccount: null,
                downpaymentPercentage: 30,
                monthlyPercentage: 20,
                months: null,
                name: 'Monthly Payment',
            },
            {
                id: 11,
                typeId: 2004,
                fromAmount: 1000,
                toAccount: 2000,
                downpaymentPercentage: 10,
                monthlyPercentage: 10,
                months: 12,
                name: 'Months',
            },
            {
                id: 12,
                typeId: 2004,
                fromAmount: 2000,
                toAccount: null,
                downpaymentPercentage: 15,
                monthlyPercentage: 15,
                months: 24,
                name: 'Months',
            },
        ],
    };

    return inputData;
}