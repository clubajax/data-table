function getSearchData() {
    loadNames();
    return {
        schema: searchSchema,
        rows: [
            {
                id: 1,
                label: 'Search',
                nameId: 'Mike',
                rateTypeId: 273,
            },
        ],
    };
}

let nameData;
function loadNames() {
    fetch('./src/names.json')
        .then((data) => data.json())
        .then((data) => {
            nameData = data;
            window.on.fire(document, 'data-ready');
        });
}
function search(value) {
    return new Promise((resolve) => {
        if (!value) {
            resolve([]);
        }
        function label(item) {
            return `${item.firstName} ${item.lastName}`;
        }
        function val(item) {
            return item.id;
            //return `${item.firstName.toLowerCase()}-${item.lastName.toLowerCase()}`;
        }
        value = value.toLowerCase();
        const data = nameData
            .filter((item) => {
                return (
                    item.firstName.toLowerCase().indexOf(value) === 0 || item.lastName.toLowerCase().indexOf(value) === 0
                );
            })
            .map((item) => {
                return {
                    value: val(item),
                    label: label(item),
                    // alias: item.firstName,
                    display: item.firstName,
                };
            });
        
        resolve(data);
    });
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
            key: 'nameId',
            label: 'Name',
            component: {
                type: 'ui-search',
                search
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
    ],
};
