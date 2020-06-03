function getDropData() {
    return {
        schema,
        rows,
        rows50
    }
}
const schema = {
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
                    },
                    {
                        type: 'FeeType',
                        typeId: 10,
                        name: 'Advertising',
                        id: 40,
                        secondary: '',
                        value: 40,
                        label: 'Advertising',
                    },
                    {
                        type: 'FeeType',
                        typeId: 10,
                        name: 'Technology',
                        id: 41,
                        secondary: '',
                        value: 41,
                        label: 'Technology',
                    },
                    {
                        type: 'FeeType',
                        typeId: 10,
                        name: 'Business Protection',
                        id: 42,
                        secondary: '',
                        value: 42,
                        label: 'Business Protection',
                    },
                    {
                        type: 'FeeType',
                        typeId: 10,
                        name: 'Additional Billing',
                        id: 43,
                        secondary: '',
                        value: 43,
                        label: 'Additional Billing',
                    },
                    {
                        type: 'FeeType',
                        typeId: 10,
                        name: 'Client Supplies',
                        id: 44,
                        secondary: '',
                        value: 44,
                        label: 'Client Supplies',
                    },
                    {
                        type: 'FeeType',
                        typeId: 10,
                        name: 'Initial One-Time',
                        id: 45,
                        secondary: '',
                        value: 45,
                        label: 'Initial One-Time',
                    },
                    {
                        type: 'FeeType',
                        typeId: 10,
                        name: 'Administration',
                        id: 46,
                        secondary: '',
                        value: 46,
                        label: 'Administration',
                    },
                ],
            },
        },
        {
            key: 'appliedTypeId',
            label: 'Applied',
            component: {
                type: 'ui-dropdown',
                options: [
                    {
                        type: 'AppliedType',
                        typeId: 37,
                        name: 'Revenue',
                        id: 417,
                        secondary: '',
                        value: 417,
                        label: 'Revenue',
                    },
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
        },
        {
            key: 'amount',
            label: 'Amount',
            component: {
                type: 'ui-input',
                format: 'currency',
            },
        },
        {
            key: 'hasDRO',
            label: 'DRO',
            component: {
                type: 'ui-checkbox',
            },
        },
        {
            key: 'statusId',
            label: 'Status',
            component: {
                type: 'ui-dropdown',
                options: [
                    {
                        type: 'StatusTypes',
                        typeId: 11,
                        name: 'Deleted',
                        id: 47,
                        secondary: '0',
                        value: 47,
                        label: 'Deleted',
                    },
                    {
                        type: 'StatusTypes',
                        typeId: 11,
                        name: 'Active',
                        id: 48,
                        secondary: '1',
                        value: 48,
                        label: 'Active',
                    },
                    {
                        type: 'StatusTypes',
                        typeId: 11,
                        name: 'InActive',
                        id: 49,
                        secondary: '2',
                        value: 49,
                        label: 'InActive',
                    },
                    {
                        type: 'StatusTypes',
                        typeId: 11,
                        name: 'Locked',
                        id: 50,
                        secondary: '4',
                        value: 50,
                        label: 'Locked',
                    },
                    {
                        type: 'StatusTypes',
                        typeId: 11,
                        name: 'Cancelled',
                        id: 51,
                        secondary: '8',
                        value: 51,
                        label: 'Cancelled',
                    },
                    {
                        type: 'StatusTypes',
                        typeId: 11,
                        name: 'Suspended',
                        id: 52,
                        secondary: '16',
                        value: 52,
                        label: 'Suspended',
                    },
                    {
                        type: 'StatusTypes',
                        typeId: 11,
                        name: 'Transferred',
                        id: 53,
                        secondary: '32',
                        value: 53,
                        label: 'Transferred',
                    },
                    {
                        type: 'StatusTypes',
                        typeId: 11,
                        name: 'Pending',
                        id: 54,
                        secondary: '64',
                        value: 54,
                        label: 'Pending',
                    },
                ],
            },
        },
    ],
};

const rows50 = [
    {
        "id": 1,
        "label": "Advertising",
        "typeId": 40,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 2,
        "label": "Advertising",
        "typeId": 40,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 3,
        "label": "Client Supplies",
        "typeId": 44,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 4,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 5,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 6,
        "label": "Initial One-Time",
        "typeId": 45,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 7,
        "label": "Accounting",
        "typeId": 39,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 8,
        "label": "Royalty",
        "typeId": 38,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 9,
        "label": "Royalty",
        "typeId": 38,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 10,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 11,
        "label": "Advertising",
        "typeId": 40,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 12,
        "label": "Advertising",
        "typeId": 40,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 13,
        "label": "Client Supplies",
        "typeId": 44,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 14,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 15,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 16,
        "label": "Initial One-Time",
        "typeId": 45,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 17,
        "label": "Accounting",
        "typeId": 39,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 18,
        "label": "Royalty",
        "typeId": 38,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 19,
        "label": "Royalty",
        "typeId": 38,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 20,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 21,
        "label": "Advertising",
        "typeId": 40,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 22,
        "label": "Advertising",
        "typeId": 40,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 23,
        "label": "Client Supplies",
        "typeId": 44,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 24,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 25,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 26,
        "label": "Initial One-Time",
        "typeId": 45,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 27,
        "label": "Accounting",
        "typeId": 39,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 28,
        "label": "Royalty",
        "typeId": 38,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 29,
        "label": "Royalty",
        "typeId": 38,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 30,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 31,
        "label": "Advertising",
        "typeId": 40,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 32,
        "label": "Advertising",
        "typeId": 40,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 33,
        "label": "Client Supplies",
        "typeId": 44,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 34,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 35,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 36,
        "label": "Initial One-Time",
        "typeId": 45,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 37,
        "label": "Accounting",
        "typeId": 39,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 38,
        "label": "Royalty",
        "typeId": 38,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 39,
        "label": "Royalty",
        "typeId": 38,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 40,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 41,
        "label": "Advertising",
        "typeId": 40,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 42,
        "label": "Advertising",
        "typeId": 40,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 43,
        "label": "Client Supplies",
        "typeId": 44,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 44,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 45,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 273,
        "statusId": 48
    },
    {
        "id": 46,
        "label": "Initial One-Time",
        "typeId": 45,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 47,
        "label": "Accounting",
        "typeId": 39,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 48,
        "label": "Royalty",
        "typeId": 38,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 49,
        "label": "Royalty",
        "typeId": 38,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    },
    {
        "id": 50,
        "label": "Business Protection",
        "typeId": 42,
        "appliedTypeId": 417,
        "rateTypeId": 274,
        "statusId": 48
    }
]

const rows = [
    {
        id: 189,
        label: 'Advertising',
        typeId: 40,
        type: 'Advertising',
        appliedTypeId: 417,
        appliedType: 'Revenue',
        rateTypeId: 274,
        rateType: 'Percentage',
        amount: 5,
        statusId: 48,
        status: 'Active',
        hasDRO: false,
        isDeleted: false,
        createdById: 1,
        dateCreated: '03/10/2018',
        modifiedById: 1,
        dateModified: '09/17/2017',
    },
    {
        id: 190,
        label: 'Advertising',
        typeId: 40,
        type: 'Advertising',
        appliedTypeId: 417,
        appliedType: 'Revenue',
        rateTypeId: 273,
        rateType: 'Dollar',
        amount: 5,
        statusId: 48,
        status: 'Active',
        hasDRO: true,
        isDeleted: false,
        createdById: 1,
        dateCreated: '12/07/2017',
        modifiedById: 1,
        dateModified: '03/14/2019',
    },
    {
        id: 191,
        label: 'Client Supplies',
        typeId: 44,
        type: 'Client Supplies',
        appliedTypeId: 417,
        appliedType: 'Revenue',
        rateTypeId: 273,
        rateType: 'Dollar',
        amount: 7,
        statusId: 48,
        status: 'Active',
        hasDRO: true,
        isDeleted: false,
        createdById: 1,
        dateCreated: '05/04/2020',
        modifiedById: 1,
        dateModified: '05/08/2018',
    },
    {
        id: 192,
        label: 'Business Protection',
        typeId: 42,
        type: 'Business Protection',
        appliedTypeId: 417,
        appliedType: 'Revenue',
        rateTypeId: 273,
        rateType: 'Dollar',
        amount: 2.5,
        statusId: 48,
        status: 'Active',
        hasDRO: true,
        isDeleted: false,
        createdById: 1,
        dateCreated: '08/02/2018',
        modifiedById: 1,
        dateModified: '05/03/2019',
    },
    {
        id: 193,
        label: 'Business Protection',
        typeId: 42,
        type: 'Business Protection',
        appliedTypeId: 417,
        appliedType: 'Revenue',
        rateTypeId: 273,
        rateType: 'Dollar',
        amount: 2.5,
        statusId: 48,
        status: 'Active',
        hasDRO: true,
        isDeleted: false,
        createdById: 1,
        dateCreated: '10/07/2019',
        modifiedById: 1,
        dateModified: '02/25/2019',
    },
    {
        id: 194,
        label: 'Initial One-Time',
        typeId: 45,
        type: 'Initial One-Time',
        appliedTypeId: 417,
        appliedType: 'Revenue',
        rateTypeId: 274,
        rateType: 'Percentage',
        amount: 7,
        statusId: 48,
        status: 'Active',
        hasDRO: true,
        isDeleted: false,
        createdById: 1,
        dateCreated: '11/21/2017',
        modifiedById: 1,
        dateModified: '03/13/2020',
    },
    {
        id: 195,
        label: 'Accounting',
        typeId: 39,
        type: 'Accounting',
        appliedTypeId: 417,
        appliedType: 'Revenue',
        rateTypeId: 274,
        rateType: 'Percentage',
        amount: 3,
        statusId: 48,
        status: 'Active',
        hasDRO: true,
        isDeleted: false,
        createdById: 1,
        dateCreated: '02/29/2018',
        modifiedById: 1,
        dateModified: '04/09/2020',
    },
    {
        id: 196,
        label: 'Royalty',
        typeId: 38,
        type: 'Royalty',
        appliedTypeId: 417,
        appliedType: 'Revenue',
        rateTypeId: 274,
        rateType: 'Percentage',
        amount: 10,
        statusId: 47,
        status: 'Deleted',
        hasDRO: true,
        isDeleted: false,
        createdById: 1,
        dateCreated: '03/14/2019',
        modifiedById: 1,
        dateModified: '12/10/2019',
    },
    {
        id: 197,
        label: 'Royalty',
        typeId: 38,
        type: 'Royalty',
        appliedTypeId: 417,
        appliedType: 'Revenue',
        rateTypeId: 274,
        rateType: 'Percentage',
        amount: 10,
        statusId: 48,
        status: 'Active',
        hasDRO: true,
        isDeleted: false,
        createdById: 1,
        dateCreated: '03/05/2019',
        modifiedById: 1,
        dateModified: '08/32/2018',
    },
    {
        id: 198,
        label: 'Business Protection',
        typeId: 42,
        type: 'Business Protection',
        appliedTypeId: 417,
        appliedType: 'Revenue',
        rateTypeId: 274,
        rateType: 'Percentage',
        amount: 2.5,
        statusId: 47,
        status: 'Deleted',
        hasDRO: true,
        isDeleted: false,
        createdById: 1,
        dateCreated: '05/17/2019',
        modifiedById: 1,
        dateModified: '11/08/2019',
    },
];
