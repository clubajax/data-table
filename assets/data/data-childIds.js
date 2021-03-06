function getChildIdData() {
    const items = [
        {
            childIds: [],
            code: 'ACCTFEE',
            creditAccount: '2267',
            creditAccountId: 14,
            debitAccount: '8822',
            debitAccountId: 3,
            description: 'ACCTFEE - Accounting Fee',
            id: 1,
            mask: 0,
            name: 'Accounting Fee',
            taxedDisplay: 'N',
            transactionTaxRateType: 'ContractRate',
            transactionTaxRateTypeId: 321,
        },
        {
            childIds: [],
            code: 'ROYFEE',
            creditAccount: '3537',
            creditAccountId: 20,
            debitAccount: '2510',
            debitAccountId: 6,
            description: 'ROYFEE - Royalty Fee',
            id: 2,
            mask: 2,
            name: 'Royalty Fee',
            taxedDisplay: 'N',
            transactionTaxRateType: 'ContractRate',
            transactionTaxRateTypeId: 321,
        },
        {
            childIds: [],
            code: 'CANCFEE',
            creditAccount: '8060',
            creditAccountId: 17,
            debitAccount: '2855',
            debitAccountId: 6,
            description: 'CANCFEE - Cancellation Fee',
            id: 3,
            mask: 6,
            name: 'Cancellation Fee',
            taxedDisplay: 'N',
            transactionTaxRateType: null,
            transactionTaxRateTypeId: null,
        },
        {
            childIds: [],
            code: 'LSEQ',
            creditAccount: '0705',
            creditAccountId: 9,
            debitAccount: '7018',
            debitAccountId: 6,
            description: 'LSEQ - Leasing Equipment',
            id: 4,
            mask: 14,
            name: 'Leasing Equipment',
            taxedDisplay: 'N',
            transactionTaxRateType: 'LeaseRate',
            transactionTaxRateTypeId: 323,
        },
        {
            childIds: [],
            code: 'FRSPL',
            creditAccount: '1685',
            creditAccountId: 27,
            debitAccount: '3630',
            debitAccountId: 6,
            description: 'FRSPL - Franchisee Supplies (S)',
            id: 5,
            mask: 30,
            name: 'Franchisee Supplies (S)',
            taxedDisplay: 'Y',
            transactionTaxRateType: 'SupplyRate',
            transactionTaxRateTypeId: 322,
        },
        {
            childIds: [1, 2, 3, 4, 5],
            code: 'LSPAY',
            creditAccount: '5256',
            creditAccountId: 9,
            debitAccount: '5536',
            debitAccountId: 6,
            description: 'LSPAY - Lease Payment (L)',
            id: 6,
            mask: 18,
            name: 'Lease Payment (L)',
            taxedDisplay: 'N',
            transactionTaxRateType: 'LeaseRate',
            transactionTaxRateTypeId: 323,
        },
        {
            childIds: [1, 2, 3, 4],
            code: 'POFOFFICE',
            creditAccount: '0272',
            creditAccountId: 27,
            debitAccount: '8482',
            debitAccountId: 6,
            description: 'POFOFFICE - Purchase From Office',
            id: 7,
            mask: 12,
            name: 'Purchase From Office',
            taxedDisplay: 'N',
            transactionTaxRateType: 'POFromOffice',
        },
        {
            childIds: [1, 2, 3],
            code: 'ACCTFEE',
            creditAccount: '2267',
            creditAccountId: 14,
            debitAccount: '8822',
            debitAccountId: 3,
            description: 'ACCTFEE - Accounting Fee',
            id: 8,
            mask: 20,
            name: 'Accounting Fee',
            taxedDisplay: 'N',
            transactionTaxRateType: 'ContractRate',
            transactionTaxRateTypeId: 321,
        },
        {
            childIds: [1, 2],
            code: 'ROYFEE',
            creditAccount: '3537',
            creditAccountId: 20,
            debitAccount: '2510',
            debitAccountId: 6,
            description: 'ROYFEE - Royalty Fee',
            id: 9,
            mask: 24,
            name: 'Royalty Fee',
            taxedDisplay: 'N',
            transactionTaxRateType: 'ContractRate',
            transactionTaxRateTypeId: 321,
        },
        {
            childIds: [1],
            code: 'CANCFEE',
            creditAccount: '8060',
            creditAccountId: 17,
            debitAccount: '2855',
            debitAccountId: 6,
            description: 'CANCFEE - Cancellation Fee',
            id: 10,
            mask: 0,
            name: 'Cancellation Fee',
            taxedDisplay: 'N',
            transactionTaxRateType: null,
            transactionTaxRateTypeId: null,
        },
    ];

    const schema = {
        // expandable: 'multiple',
        columns: [
            {
                key: 'id',
                label: 'ID',
            },
            {
                key: 'code',
                label: 'Code',
            },
            {
                key: 'name',
                label: 'Name',
            },
            {
                key: 'description',
                label: 'Description',
            },
            {
                key: 'creditAccount',
                label: 'Account Id Credit',
                align: 'center',
            },
            {
                key: 'debitAccount',
                label: 'Account Id Debit',
                align: 'center',
            },
            {
                key: 'taxedDisplay',
                label: 'Taxed',
                align: 'center',
            },
            {
                key: 'transactionTaxRateType',
                label: 'Applied Tax',
                align: 'center',
            },
            {
                key: 'tags',
                label: 'Tags',
                align: 'center',
                component: {
                    type: 'ui-minitags',
                    readonly: true,
                    options: [],
                },
            },
        ],
    };

    return {
        schema,
        items,
    };
}
