function getSearchData() {
    return {
        schema: searchSchema,
        rows: [
            {
                id: 1,
                label: 'Search',
                typeId: 38,
                rateTypeId: 273
            }
        ]
    }
}
const searchSchema = {
    columns: [
        {
            key: 'label',
            label: 'Name',
            component: {
                type: 'ui-input',
            },
        },
        {
            key: 'typeId',
            label: 'Type',
            component: {
                type: 'ui-dropdown',
                options: [
                    {
                        type: 'FeeType',
                        typeId: 10,
                        name: 'Royalty',
                        id: 38,
                        secondary: '',
                        value: 38,
                        label: 'Royalty',
                    },
                    {
                        type: 'FeeType',
                        typeId: 10,
                        name: 'Accounting',
                        id: 39,
                        secondary: '',
                        value: 39,
                        label: 'Accounting',
                    }
                ],
            },
        },
        {
            key: 'rateTypeId',
            label: 'Rate',
            component: {
                type: 'ui-dropdown',
                options: [
                    {
                        type: 'FeeRateType',
                        typeId: 22,
                        name: 'Dollar',
                        id: 273,
                        secondary: '',
                        value: 273,
                        label: 'Dollar',
                    },
                    {
                        type: 'FeeRateType',
                        typeId: 22,
                        name: 'Percentage',
                        id: 274,
                        secondary: '',
                        value: 274,
                        label: 'Percentage',
                    },
                ],
            },
        }
    ]
};