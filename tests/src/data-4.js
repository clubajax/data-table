function getData4() {
    return {
        schema: {
            columns: [
                {
                    key: 'last',
                    label: 'Last',
                    callback(event) {
                        // console.log('callback', event.item);
                        return `${event.item.last}, ${event.item.first}`;
                    }
                }, {
                    key: 'middle',
                    label: 'Middle Name',
                    component: {
                        type: 'ui-input',
                        subtype: 'text'
                    }
                }, {
                    key: 'date',
                    label: 'Date',
                    component: {
                        type: 'date-input',
                    }
                }, {
                    key: 'job',
                    label: 'Occupation',
                    component: {
                        type: 'link',
                        url: 'site'
                    }
                }, {
                    key: 'edu',
                    label: 'Education',
                    component: {
                        type: 'ui-dropdown',
                        options: [
                            {value: 'bootcamp', label: 'Boot Camp'},
                            {value: 'highschool', label: 'High School'},
                            {value: 'associates', label: 'Associates'},
                            {value: 'bachelors', label: 'Bachelors'},
                            {value: 'masters', label: 'Masters'},
                        ]
                    }
                }, {
                    key: 'school',
                    label: 'School',
                    component: {
                        key: 'schoolId',
                        type: 'ui-dropdown',
                        options: [
                            {value: 1, label: 'Yale'},
                            {value: 2, label: 'Harvard'},
                            {value: 3, label: 'Cornell'},
                            {value: 4, label: 'Princeton'},
                            {value: 5, label: 'Dartmouth'},
                        ]
                    }
                }, {
                    key: 'optin',
                    label: 'Opt In',
                    width: '80px',
                    component: {
                        type: 'ui-checkbox'
                    }
                }, {
                    icon: 'edit',
                    component: {
                        type: 'edit-rows'
                    }
                }
            ]
        },
        items: [
            {
                id: 1,
                date: '11/20/1973',
                first: 'Mike',
                last: 'Wilcox',
                middle: 'JavaScript',
                job: 'UI Guy',
                company: 'Intelligencia',
                site: 'http://intelligencia.com',
                edu: 'associates',
                optin: true,
                school: 'Yale',
                schoolId: 1
            }, {
                id: 2,
                date: '11/20/2020',
                first: 'Jeziel',
                last: 'Jones',
                middle: 'Hello Kitty',
                job: 'UI Guy',
                company: 'Dorkville',
                site: 'http://dorkville.us',
                edu: 'bootcamp',
                optin: false,
                school: 'Harvard',
                schoolId: 2
            }, {
                id: 3,
                date: '12/25/1999',
                first: 'Motti',
                last: 'Marom',
                middle: '',
                job: 'Criticizing',
                company: 'QA R US',
                site: 'http://qarus.com',
                edu: 'bachelors',
                optin: true,
                school: 'Cornell',
                schoolId: 3
            }, {
                id: 4,
                date: '01/01/1970',
                first: 'Madhu',
                last: 'Chebrolu',
                middle: true,
                job: 'Rubier',
                company: 'Backends',
                site: 'http://bends.com',
                edu: 'masters',
                optin: false,
                school: 'Princeton',
                schoolId: 4
            }
        ]
    }
}