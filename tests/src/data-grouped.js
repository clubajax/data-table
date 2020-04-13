const groupedItems = [
    {
        id: 1,
        accountId: '001',
        accountName: 'Oskon',
        subitems: [
            {
                id: 2,
                franchiseeId: '002',
                franchiseeName: 'Oskon',
                customerName: 'Ultramax',
                customerId: '1001',
                debit: 100,
                credit: 100,
                amount: 0
            },
            {
                id: 3,
                franchiseeId: '003',
                franchiseeName: 'Wuhan',
                customerName: 'Maxultra',
                customerId: '1002',
                debit: 100,
                credit: 0,
                amount: 100
            },
        ],
    },
    {
        id: 4,
        accountId: '004',
        accountName: 'Mikco',
        subitems: [
            {
                id: 5,
                franchiseeId: '005',
                franchiseeName: 'Wilco',
                customerName: 'Mikemax',
                customerId: '1003',
                debit: 0,
                credit: 100,
                amount: -100
            },
            {
                id: 6,
                franchiseeId: '006',
                franchiseeName: 'Rightway',
                customerName: 'MJW Asso',
                customerId: '1004',
                debit: 50,
                credit: 200,
                amount: -150
            },
        ],
    },
];

const groupedSchema = {
    columns: [
        {key: 'accountId', label: 'Acct#'},
        {key: 'accountName', label: 'Name'},
        {key: 'franchiseeId', label: 'FRAN#'},
        {key: 'franchiseeName', label: 'Franchisee Name'},
        {key: 'customerId', label: 'CUST#'},
        {key: 'debit', label: 'Debit'},
        {key: 'credit', label: 'Credit'},
        {key: 'amount', label: 'Amount'},
    ]
};

