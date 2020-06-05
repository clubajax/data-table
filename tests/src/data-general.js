function getGeneralData() {
    return {
        schema: {
            sort: 'weight',
            desc: true,
            columns: [
                { key: 'name', label: 'Name' },
                { key: 'age', label: 'Age' },
                { key: 'height', label: 'Height' },
                { key: 'weight', label: 'Weight' },
                { key: 'bp', label: 'Blood Pressure', unsortable: true, format: 'percentage' },
            ],
        },
        schemaExpandable: {
            expandable: true,
            columns: [
                { key: 'name', label: 'Name' },
                { key: 'age', label: 'Age' },
                { key: 'height', label: 'Height' },
                { key: 'weight', label: 'Weight' },
                { key: 'bp', label: 'Blood Pressure', unsortable: true, format: 'percentage' },
            ],
        },
        schemaDualSort: {
            // sort: 'weight',
            // desc: true,
            columns: [
                {
                    key: 'name',
                    label: 'Name / Age',
                    sortKeys: ['name', 'age'],
                    callback({ item }) {
                        console.log(' --- ', item);
                        return `${item.name} / ${item.age}`;
                    },
                },
                { key: 'height', label: 'Height' },
                { key: 'weight', label: 'Weight' },
                { key: 'bp', label: 'Blood Pressure', unsortable: true },
            ],
        },
        items: [
            {
                id: 1,
                name: 'Moke',
                age: 20,
                height: 6.1,
                weight: 170,
                bp: 120,
            },
            {
                id: 2,
                name: 'Joke',
                age: 10,
                height: 4.5,
                weight: 90,
                bp: 100,
            },
            {
                id: 3,
                name: 'Doke',
                age: 40,
                height: 5.9,
                weight: 220,
                bp: 150,
            },
        ],
    };
}
