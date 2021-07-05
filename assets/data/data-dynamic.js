function getDataDyn() {
    return {
        schema: {
            sort: 'amount',
            columns: [
                {
                    key: 'type',
                    label: 'Number Type',
                    component: {
                        type: 'ui-dropdown',
                        renders: true,
                        // onChange(e) {
                        //     console.log('component.onChange', e.value, e.column);
                        //     input.format = e.value.type;
                        // },
                        options: [
                            {value: 'currency', label: 'Currency'},
                            {value: 'accounting', label: 'Accounting'},
                            {value: 'percentage', label: 'Percentage'},
                            {value: 'integer', label: 'Integer'},
                            {value: 'number', label: 'Number'},
                        ]
                    }
                }, 
                {
                    key: 'amount',
                    label: 'Amount',
                    format: 'property:type',
                    component: {
                        type: 'ui-input',
                    }
                }
            ]
        },
        items: [
            {
                id: 1,
                type: 'currency',
                amount: -10.50
            }, {
                id: 2,
                type: 'percentage',
                amount: -10.50
            }, {
                id: 3,
                type: 'integer',
                amount: -10.50
            }
        ]
    }
}