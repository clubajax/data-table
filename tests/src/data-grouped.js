const groupedItems = [
    {
        id: 1,
        parentId: null,
        accountId: '001',
        accountName: 'Oskon',
        debit: 200,
        credit: 100,
        amount: 100,
    },
    {
        id: 2,
        parentId: 1,
        franchiseeId: '002',
        franchiseeName: 'Oskon',
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
        customerId: '1002',
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
        customerId: '1002',
        debit: 100,
        credit: 0,
        amount: 100,
    },
    {
        id: 10,
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
];

const groupedSchema = {
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
