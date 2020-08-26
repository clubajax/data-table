function getData3() {
    return {
        schema: {
            columns: [
                {
                    key: 'last',
                    label: 'Last',
                    callback(event) {
                        // console.log('callback', event.item);
                        return `${event.item.last}, ${event.item.first}`;
                    },
                },
                {
                    key: 'last',
                    label: 'Last Name',
                    component: {
                        type: 'ui-input',
                    },
                },
                {
                    key: 'middle',
                    label: 'Middle Name',
                    component: {
                        type: 'ui-input',
                        addOnly: true,
                    },
                },
                {
                    key: 'job',
                    label: 'Occupation',
                    component: {
                        type: 'link',
                        url: 'site',
                    },
                },
                {
                    key: 'edu',
                    label: 'Education',
                    component: {
                        type: 'ui-dropdown',
                        options: [
                            { value: 'bootcamp', label: 'Boot Camp' },
                            { value: 'highschool', label: 'High School' },
                            { value: 'associates', label: 'Associates' },
                            { value: 'bachelors', label: 'Bachelors' },
                            { value: 'masters', label: 'Masters' },
                        ],
                    },
                },
                {
                    key: 'school',
                    label: 'School',
                    component: {
                        key: 'schoolId',
                        type: 'ui-dropdown',
                        options: [
                            { value: 1, label: 'Yale' },
                            { value: 2, label: 'Harvard' },
                            { value: 3, label: 'Cornell' },
                            { value: 4, label: 'Princeton' },
                            { value: 5, label: 'Dartmouth' },
                        ],
                    },
                },
                {
                    key: 'optin',
                    label: 'Opt In',
                    width: '80px',
                    component: {
                        type: 'ui-checkbox',
                    },
                },
                {
                    key: 'tags',
                    label: 'Tags',
                    width: '50px',
                    component: {
                        type: 'ui-minitags',
                        options: [
                            { label: 'Orange', value: 'orange' },
                            { label: 'Red', value: 'red' },
                            { label: 'Blue', value: 'blue' },
                            { label: 'Green', value: 'green' },
                            { label: 'Purple', value: 'purple' },
                            { label: 'Yellow', value: 'yellow' },
                            { label: 'Cyan', value: 'cyan' },
                            { label: 'Indigo', value: 'indigo' },
                            { label: 'Orange1', value: 'orange1' },
                            { label: 'Red1', value: 'red1' },
                            { label: 'Blue1', value: 'blue1' },
                            { label: 'Green1', value: 'green1' },
                            { label: 'Purple1', value: 'purple1' },
                            { label: 'Yellow1', value: 'yellow1' },
                            { label: 'Cyan1', value: 'cyan1' },
                            { label: 'Indigo1', value: 'indigo1' },
                        ],
                    },
                },
                {
                    icon: 'edit',
                    component: {
                        type: 'edit-rows',
                    },
                },
            ],
        },
        items: [
            {
                id: 1,
                first: 'Mike',
                last: 'Wilcox',
                middle: 'JavaScript',
                job: 'UI Guy',
                company: 'Intelligencia',
                site: 'http://intelligencia.com',
                edu: 'associates',
                optin: true,
                school: 'Yale',
                schoolId: 1,
                tags: ['red'],
            },
            {
                id: 2,
                first: 'Jeziel',
                last: 'Jones',
                middle: 'Hello Kitty',
                job: 'UI Guy',
                company: 'Dorkville',
                site: 'http://dorkville.us',
                edu: 'bootcamp',
                optin: false,
                school: 'Harvard',
                schoolId: 2,
                tags: ['blue'],
            },
            {
                id: 3,
                first: 'Motti',
                last: 'Marom',
                middle: '',
                job: 'Criticizing',
                company: 'QA R US',
                site: 'http://qarus.com',
                edu: 'bachelors',
                optin: true,
                school: 'Cornell',
                schoolId: 3,
                tags: [],
            },
            {
                id: 4,
                first: 'Madhu',
                last: 'Chebrolu',
                middle: true,
                job: 'Rubier',
                company: 'Backends',
                site: 'http://bends.com',
                edu: 'masters',
                optin: false,
                school: 'Princeton',
                schoolId: 4,
                tags: ['red', 'blue'],
            },
        ],
    };
}
