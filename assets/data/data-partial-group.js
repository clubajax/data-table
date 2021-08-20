window.partialGroupedItems = [
    {
        id: 1,
        parentId: null,
        accountId: '001',
        accountName: 'Oskon',
        franchiseeId: '003',
        franchiseeName: 'Wuhan',
        debit: 200,
        credit: 100,
        amount: 100,
    },
    {
        id: 2,
        parentId: 1,
        franchiseeId: '003',
        franchiseeName: 'Wuhan',
        customerName: 'Ultramax',
        customerId: '1001',
        debit: 100,
        credit: 100,
        amount: 0,
    },
    {
        id: 3,
        parentId: 1,
        franchiseeId: '003',
        franchiseeName: 'Wuhan',
        customerName: 'Maxultra',
        customerId: '1002',
        debit: 100,
        credit: 0,
        amount: 100,
    },
    {
        id: 7,
        parentId: 1,
        franchiseeId: '003',
        franchiseeName: 'Wuhan',
        customerName: 'Maxultra',
        customerId: '1003',
        debit: 100,
        credit: 0,
        amount: 100,
    },
    {
        id: 8,
        parentId: 1,
        franchiseeId: '003',
        franchiseeName: 'Wuhan',
        customerName: 'Maxultra',
        customerId: '1002',
        debit: 100,
        credit: 0,
        amount: 100,
    },
    {
        id: 9,
        parentId: 1,
        franchiseeId: '003',
        franchiseeName: 'Wuhan',
        customerName: 'Maxultra',
        customerId: '1005',
        debit: 100,
        credit: 0,
        amount: 100,
    },
    {
        // orphan
        id: 10,
        parentId: null,
        franchiseeId: '003',
        franchiseeName: 'Wuhan',
        customerName: 'Maxultra',
        customerId: '1006',
        debit: 100,
        credit: 0,
        amount: 100,
    },
    {
        // orphan
        id: 14,
        parentId: null,
        franchiseeId: '003',
        franchiseeName: 'Wuhan',
        customerName: 'Maxultra',
        customerId: '1006',
        debit: 100,
        credit: 0,
        amount: 100,
    },

    
    {
        id: 4,
        parentId: null,
        accountId: '004',
        accountName: 'Mikco',
    },
    {
        id: 5,
        parentId: 4,
        franchiseeId: '005',
        franchiseeName: 'Wilco',
        customerName: 'Mikemax',
        customerId: '1003',
        debit: 0,
        credit: 100,
        amount: -100,
    },
    {
        id: 6,
        parentId: 4,
        franchiseeId: '006',
        franchiseeName: 'Rightway',
        customerName: 'MJW Asso',
        customerId: '1004',
        debit: 50,
        credit: 200,
        amount: -150,
    },


    {
        id: 11,
        parentId: null,
        accountId: '005',
        accountName: 'JoCo',
    },
    {
        id: 12,
        parentId: 11,
        franchiseeId: '005',
        franchiseeName: 'Wilco',
        customerName: 'Mikemax',
        customerId: '1003',
        debit: 0,
        credit: 100,
        amount: -100,
    },
    {
        id: 13,
        parentId: 11,
        franchiseeId: '006',
        franchiseeName: 'Rightway',
        customerName: 'MJW Asso',
        customerId: '1004',
        debit: 50,
        credit: 200,
        amount: -150,
    },
    {
        // orphan
        id: 15,
        parentId: null,
        franchiseeId: '003',
        franchiseeName: 'Wuhan',
        customerName: 'Maxultra',
        customerId: '1006',
        debit: 100,
        credit: 0,
        amount: 100,
    },
];

window.partialGroupedSchema = {
    columns: [
        { key: 'accountId', label: 'Acct#' },
        { key: 'accountName', label: 'Name' },
        { key: 'franchiseeId', label: 'FRAN#' },
        { key: 'franchiseeName', label: 'Franchisee' },
        { key: 'customerId', label: 'CUST#' },
        { key: 'debit', label: 'Debit', format: 'accounting' },
        { key: 'credit', label: 'Credit', format: 'accounting' },
        {
            key: 'amount',
            label: 'Amount',
            format: 'accounting',
            callback: ({ value, item }) => {
                if (!value) {
                    return '';
                }
                if (item.isSubitem) {
                    return value;
                }
                return `<strong>${value}</strong>`;
            },
        },
    ],
};
