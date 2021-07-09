require('./common');

mocha.setup('bdd');

function createSchema(options) {
    return {
        name: 'Name',
        age: 'Age',
        height: 'Height',
        weight: 'Weight',
        bp: 'Bloodpressure',
    };
}

describe('DataTable', function () {
    this.timeout(3000);
    const describe = window.describe,
        util = window.util,
        test = window.test,
        dom = window.dom,
        on = window.on,
        expect = chai.expect,
        body = dom.byId('tests');

    function getData() {
        const data = getData20();
        delete data.columns.email;
        delete data.columns.phone;
        delete data.columns.ssn;
        delete data.columns.birthday;
        delete data.columns.address1;
        delete data.columns.address2;
        // console.log(JSON.stringify(data, null, 4));
        return data;
    }

    function getDataForDrops() {
        getDropData();
    }

    let renderNode;
    async function renderDropTable() {
        return new Promise((resolve) => {
            const data = copy(getDropData());
            const section = dom('section', { html: dom('label', { html: 'Dropdown Mania' }) }, body);
            console.time('done');
            renderNode = dom(
                'data-table',
                {
                    schema: data.schema,
                    rows: data.rows50,
                },
                section,
            );
            onDomReady(renderNode, function () {
                console.timeEnd('done');
                resolve();
            });
        });
    }

    function destroyRenderNode() {
        renderNode.destroy();
    }

    describe('util', function () {
        it('should create a classname string', () => {
            const { classnames } = util;
            let cls;

            cls = classnames('mike');
            cls('was');
            cls('here');
            expect(cls()).to.equal('mike was here');

            cls = classnames('');
            cls('one');
            cls();
            cls('two');
            expect(cls()).to.equal('one two');
        });
    });

    describe('data table', function () {
        describe.skip('performance', function () {
            it('shuld generate data', function () {
                let data = getDropData().rows;
                data = [...data, ...data, ...data, ...data, ...data];
                data = data.map(({ label, typeId, appliedTypeId, rateTypeId, statusId }, i) => {
                    return {
                        id: i + 1,
                        label,
                        typeId,
                        appliedTypeId,
                        rateTypeId,
                        statusId: 48,
                    };
                });
                const ta = dom('textarea', { class: 'drop-data' }, body);
                console.log('data', data);
                ta.textContent = JSON.stringify(data, null, 4);
            });
            it('should render many dropdowns', function (done) {
                async function render() {
                    await renderDropTable();
                    destroyRenderNode();
                    await renderDropTable();
                    destroyRenderNode();
                    await renderDropTable();
                    destroyRenderNode();
                    await renderDropTable();
                    destroyRenderNode();

                    await renderDropTable();
                    destroyRenderNode();
                    await renderDropTable();
                    destroyRenderNode();
                    await renderDropTable();
                    destroyRenderNode();
                    await renderDropTable();
                    destroyRenderNode();

                    await renderDropTable();

                    done();
                }

                render();
            });
        });

        describe('new schema + components', function () {
            it('should use components and date', function (done) {
                const data = copy(getData4());
                const section = dom('section', { html: dom('label', { html: 'Use All Components (Date)' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    node.on('remove-row', function (e) {
                        console.log('remove-row', e);
                    });
                    done();
                });
            });

            it('should display components', function (done) {
                const data = getData3();
                const section = dom('section', { html: dom('label', { html: 'Display Components' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('test.change', e);
                    });
                    node.on('add-row', function (e) {
                        console.log('test.add', e.value);
                    });
                    node.on('create-row', function (e) {
                        console.log('test.create', e.value.index);
                        const rows = [...data.items];
                        rows.splice(e.value.index + 1, 0, data.getBlankItem());
                        node.rows = rows;
                    });
                    done();
                });
            });

            it('should search', function (done) {
                const data = getSearchData();
                const section = dom('section', { html: dom('label', { html: 'Search Columns' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.rows,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    node.on('cell-change', function (e) {
                        console.log('cell-change', e);
                    });
                    done();
                });
            });
        });

        describe('custom menus/buttons', () => {
            it('should add/remove with action button', function (done) {
                const data = copy(
                    getData3({
                        menus: true,
                    }),
                );
                console.log('data.schema', data.schema);
                const section = dom('section', { html: dom('label', { html: 'ActionButton with Copy' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    node.on('remove-row', function (e) {
                        console.log('remove-row', e);
                    });
                    node.on('add-row', function (e) {
                        console.log('create-row', e);
                    });
                    node.on('action', function (e) {
                        console.log('action', e.detail);
                    });
                    done();
                });
            });

            it('should have custom edit buttons', function (done) {
                const data = getData3();
                const col = data.schema.columns.find((c) => c.icon === 'edit');
                col.component.type = 'edit-buttons';
                col.component.buttons = [
                    {
                        icon: 'plus',
                        value: 'add',
                    },
                    {
                        icon: 'trash',
                        value: 'remove',
                        display(item) {
                            return item.id !== 2;
                        },
                    },
                    {
                        icon: 'copy',
                        value: 'copy',
                    },
                ];

                const section = dom('section', { html: dom('label', { html: 'Custom Edit Buttons' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('action', function (e) {
                        console.log('button.action', e.detail.value);
                    });
                    done();
                });
            });
        });

        describe('add/remove', () => {
            it('should add/remove rows', function (done) {
                const data = copy(getData3());
                const section = dom('section', { html: dom('label', { html: 'Add/Remove Rows' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    node.on('remove-row', function (e) {
                        console.log('remove-row', e);
                    });
                    done();
                });
            });

            it('should have a message when no data', function (done) {
                const data = copy(getData3());
                const items = [];
                const section = dom('section', { html: dom('label', { html: 'Message When No Data' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: items,
                        'add-data-message': 'Would you like to add data?',
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    console.log('data', data);
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    node.on('remove-row', function (e) {
                        console.log('remove-row', e);
                    });
                    node.on('create-row', function (e) {
                        console.log('test.create', e.value.index);
                        const rows = [...node.items];
                        rows.splice(e.value.index + 1, 0, getData3().getBlankItem());
                        node.rows = rows;
                    });
                    done();
                });
            });

            it('should add but not remove input rows', function (done) {
                const section = dom('section', { html: dom('label', { html: 'Add, not remove Input Rows' }) }, body);
                const data = getInputData({ noRemove: true });
                const items = data.items.slice(0, 4);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e.value);
                    });
                    node.on('add-row', function (e) {
                        console.log('change', e);
                        delete e.value.added;
                        items.splice(e.value.index, 0, e.value);
                        node.rows = items;
                    });
                    node.on('remove-row', function (e) {
                        console.log('remove-row', e);
                        items.splice(e.value.index, 1);
                        node.rows = items;
                    });
                    done();
                });
            });

            it('should add but not edit input rows', function (done) {
                const section = dom('section', { html: dom('label', { html: 'Add, not Edit Input Rows' }) }, body);
                const data = getInputData({
                    noEdit: (item) => {
                        return item.id < 100;
                    },
                });
                const items = data.items.slice(0, 4);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e.value);
                    });
                    node.on('create-row', function (e) {
                        console.log('test.create', e.value.index);
                        const rows = [...items];
                        rows.splice(e.value.index + 1, 0, data.getBlankItem());
                        console.log('rows', rows);
                        node.rows = rows;
                    });
                    node.on('add-row', function (e) {
                        console.log('change', e);
                        delete e.value.added;
                        items.splice(e.value.index, 0, e.value);
                        node.rows = items;
                    });
                    node.on('remove-row', function (e) {
                        console.log('remove-row', e);
                        items.splice(e.value.index, 1);
                        node.rows = items;
                    });
                    done();
                });
            });

            it('should add/remove with an actionbutton', function (done) {
                const section = dom('section', { html: dom('label', { html: 'Add/Remove ActionButton' }) }, body);
                const data = getInputData();
                const schema = data.schema;
                schema.columns[schema.columns.length - 1].component.options = [
                    { value: 'add', label: 'Add Row' },
                    { value: 'edit', label: 'Edit Row' },
                    { value: 'remove', label: 'Remove Row' },
                ];
                console.log('schema', schema);
                const items = data.items.slice(0, 2);
                const node = dom(
                    'data-table',
                    {
                        schema,
                        rows: items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    node.on('add-row', function (e) {
                        console.log('change', e);
                        delete e.value.added;
                        items.splice(e.value.index, 0, e.value);
                        node.rows = items;
                    });
                    node.on('remove-row', function (e) {
                        console.log('remove-row', e);
                        items.splice(e.value.index, 1);
                        node.rows = items;
                    });
                    done();
                });
            });
        });

        describe('formatters', function () {
            it('should format component data', function (done) {
                const section = dom('section', { html: dom('label', { html: 'Format Component Data' }) }, body);
                const data = getInputData();
                const items = data.items;
                const schema = data.schema;
                const node = dom(
                    'data-table',
                    {
                        schema: schema,
                        rows: items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    done();
                });
            });

            it('should have formatable inputs', function (done) {
                const section = dom('section', { html: dom('label', { html: 'Formatable Inputs' }) }, body);
                const data = getFormatData();
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    done();
                });
            });

            it('should be dynamically formatable', function (done) {
                const data = getDataDyn();
                const section = dom('section', { html: dom('label', { html: 'Dynamic Format' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                        sortable: true,
                    },
                    section,
                );
                onDomReady(node, function () {
                    done();
                });
            });

            it('should format readonly checkboxes', function (done) {
                const data = getDataFiltered(['firstName', 'lastName', 'has', 'is']);
                const section = dom('section', { html: dom('label', { html: 'Readonly Checkboxes' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    done();
                });
            });
        });

        describe('expandable', () => {
            it('should expand rows', (done) => {
                const data = getGeneralData();
                const section = dom('section', { html: dom('label', { html: 'Expandable Rows' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schemaExpandable,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('expanded', function (e) {
                        console.log('expanded', e.detail);
                    });
                    done();
                });
            });

            it('should request to collapse rows', (done) => {
                const data = getGeneralData();
                const item1 = data.items.pop();
                const item2 = data.items.pop();
                const schema = data.schemaExpandable;
                schema.requestCollapse = true;
                const section = dom(
                    'section',
                    { html: dom('label', { html: 'Request Collapse Expandable Rows' }) },
                    body,
                );
                const node = dom(
                    'data-table',
                    {
                        schema: schema,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    // testing multiple click handler
                    setTimeout(() => {
                        data.items.push(item1);
                        node.rows = data.items;
                        setTimeout(() => {
                            data.items.push(item2);
                            node.rows = data.items;
                        }, 30);
                    }, 30);

                    node.on('expanded', function (e) {
                        console.log('expanded', e.detail);
                    });

                    node.on('request-collapse', function (e) {
                        console.log('request-collapse', e.detail);
                        e.detail.item.expanded = false;
                        // node.collapse = e.detail.item
                        node.collapse = true;
                    });
                    done();
                });
            });

            it('should expand first row', (done) => {
                const data = getGeneralData();
                const section = dom('section', { html: dom('label', { html: 'Expand First Row' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schemaExpandable,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    const newData = [...data.items];
                    newData.unshift(clear(newData[0]));
                    newData[0].expanded = true;
                    node.rows = newData;

                    node.on('expanded', function (e) {
                        console.log('expanded', e.detail);
                    });
                    done();
                });
            });
        });

        describe('panels', () => {
            it('should create paneled data', (done) => {
                const data = getHeaderless();
                const schema = data.schema;
                const rows = data.items.slice(5);
                rows.forEach((item) => {
                    delete item.childIds;
                });
                const section = dom('section', { html: dom('label', { html: 'Panel Data' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema,
                        rows,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('expanded', function (e) {
                        console.log('expanded', e.detail);
                    });
                    done();
                });
            });
        });

        describe('grouping', () => {
            it('should group based on parentIds', (done) => {
                const section = dom('section', { html: dom('label', { html: 'Group by Parent IDs' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: groupedSchema,
                        rows: groupedItems,
                        zebra: true,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    node.on('remove-row', function (e) {
                        console.log('remove-row', e);
                    });
                    done();
                });
            });

            it.only('should group with radio buttons', () => {
                groupedSchema.radios = true;
                console.log('groupedSchema', groupedSchema);
                const section = dom('section', { html: dom('label', { html: 'Group by Parent IDs' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: groupedSchema,
                        rows: groupedItems,
                        zebra: true,
                    },
                    section,
                );

                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    node.on('select', function (e) {
                        console.log('select', e);
                        groupedItems.forEach((m) => {
                            m.selected = false;
                        })
                        const index = groupedItems.findIndex(m => m.id === e.value)
                        groupedItems[index].selected = true;

                        // TODO
                        // How to update selected?
                        // don't want to pass in data again... that will force a rerender
                        // might be better to maintain state within the table
                        //
                        // Also
                        // error if using checks/radio + selectable

                    });
                });
            });

            it('should render form components', () => {
                setTimeout(() => {
                    dom('ui-input', {}, body);
                    dom('ui-checkbox', {}, body);
                    dom('ui-radio', {}, body);
                    dom('ui-dropdown', { label: 'drop' }, body);
                }, 30);
            });

            it('should group based on child ids', (done) => {
                const data = getChildIdData();
                const section = dom('section', { html: dom('label', { html: 'Group by Child IDs' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                        borders: 'bottom',
                        zebra: true,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    node.on('remove-row', function (e) {
                        console.log('remove-row', e);
                    });
                    done();
                });
            });
        });

        describe('rendering (with components)', function () {
            it('should render a table', function (done) {
                const data = getData3();
                const section = dom('section', { html: dom('label', { html: 'Non Selectable Item' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    done();
                });
            });

            it('should handle "loading"', function (done) {
                const data = getGeneralData();
                const section = dom('section', { html: dom('label', { html: 'Loading Status' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        loading: true,
                        rows: [],
                        schema: data.schema,
                    },
                    section,
                );
                onDomReady(node, function () {
                    node.on('sort', function (e) {
                        console.log('sort.event', e);
                    });
                    setTimeout(() => {
                        // node.loading = false;
                    }, 500);
                    done();
                });
            });

            it('should handle "error"', function (done) {
                const data = getGeneralData();
                const section = dom('section', { html: dom('label', { html: 'Display Error' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        error: 'Some stuff did not load properly',
                        rows: [],
                        schema: data.schema,
                    },
                    section,
                );
                onDomReady(node, function () {
                    node.on('sort', function (e) {
                        console.log('sort.event', e);
                    });
                    setTimeout(() => {
                        node.error = false;
                    }, 1500);
                    done();
                });
            });

            it('should handle "no data"', function (done) {
                const section = dom('section', { html: dom('label', { html: 'Data is NULL' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        rows: [],
                        schema: {},
                    },
                    section,
                );
                onDomReady(node, function () {
                    expect(node.classList.contains('no-data')).to.equal(true);
                    done();
                });
            });

            it('should handle "no items"', function (done) {
                const section = dom('section', { html: dom('label', { html: 'Items are []' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: dataNoItems.schema,
                        rows: dataNoItems.items,
                    },
                    section,
                );
                onDomReady(node, function () {
                    expect(node.classList.contains('no-data')).to.equal(true);
                    done();
                });
            });
        });

        describe('clickable', function () {
            it('should have clickable rows', function (done) {
                const section = dom('section', { html: dom('label', { html: 'Clickable Rows' }) }, body);
                const data = getGeneralData();
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                        clickable: true,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('row-click', function (e) {
                        console.log('click', e);
                    });
                    node.on('header-click', function (e) {
                        console.log('click', e);
                    });
                    done();
                });
            });
        });

        describe('filtering', function () {
            it('should be filterable', function (done) {
                // https://mvc-grid.azurewebsites.net/Column/CustomFilter
                // TODO: Make filter test, works with and without sorting
                const components = getFilterComponents();
                const data = copy(getData());
                const schema = {
                    sort: 'company',
                    desc: true,
                    columns: data.columns,
                };
                schema.columns[0].filter = components.input;
                // schema.columns[1].filter = true;
                // schema.columns[2].filter = true;
                // schema.columns[3].filter = true;
                console.log('schema', schema);
                const section = dom('section', { class: 'sized', html: 'Filterable' }, body);
                const node = dom(
                    'data-table',
                    {
                        schema,
                        rows: data.items,
                        scrollable: true,
                        'static-column': 1,

                        zebra: true,
                        // extsort: true,
                    },
                    section,
                );
                onDomReady(node, function () {
                    node.on('filter', (e) => {
                        console.log('filter.event', e);
                    });
                    done();
                });
            });
        });

        describe('scrolling', function () {
            it('should be scrollable with minimal columns', function (done) {
                const data = copy(getData());
                data.columns = data.columns.slice(0, 4);
                console.log('data.columns', data.columns);
                const section = dom('section', { class: 'sized', html: 'Scrollable Stretchy' }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: { columns: data.columns },
                        rows: data.items,
                        scrollable: true,
                        zebra: true,
                    },
                    section,
                );
                onDomReady(node, function () {
                    done();
                });
            });

            it('should be scrollable', function (done) {
                const data = getData();
                const section = dom('section', { class: 'sized', html: 'Scrollable' }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: {
                            sort: 'company',
                            desc: true,
                            columns: data.columns,
                        },
                        rows: data.items,
                        scrollable: true,
                        'static-column': 1,

                        zebra: true,
                        // extsort: true,
                    },
                    section,
                );
                onDomReady(node, function () {
                    done();
                });
            });

            it('should be scrollable with maxHeight set FIXME', function (done) {
                const data = getData();
                const section = dom('section', { html: 'Scrollable, Max Height', style: { height: 400 } }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: { columns: data.columns },
                        rows: data.items.slice(0, 2),
                        scrollable: true,
                        // 'max-height': 200
                    },
                    section,
                );
                onDomReady(node, function () {
                    done();
                });
            });
        });

        describe('sorting', function () {
            it('should sort', function (done) {
                const section = dom('section', { html: dom('label', { html: 'Sortable 1' }) }, body);
                const data = getGeneralData();
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                        footer: dom('div', { html: 'select one of two rows' }),
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('sort', function (e) {
                        console.log('sort.event', e);
                        events.push(e.detail.value);
                    });

                    // expect(selectedColumn(node)).to.equal('weight');
                    // expect(getColData(node, 'weight')).to.equal('220,170,90');
                    // clickCol(node, 'weight');
                    // expect(getColData(node, 'weight')).to.equal('90,170,220');

                    // // reset to default sort
                    // clickCol(node, 'weight');
                    // expect(getColData(node, 'weight')).to.equal('170,90,220');
                    // expect(selectedColumn(node)).to.equal(null);

                    // clickCol(node, 'age');
                    // expect(selectedColumn(node)).to.equal('age');
                    // expect(getColData(node, 'age')).to.equal('40,20,10');

                    // clickCol(node, 'bp');
                    // expect(selectedColumn(node)).to.equal('bp');
                    // expect(getColData(node, 'bp')).to.equal('150,120,100');

                    // node.sort = 'height,desc';
                    // expect(selectedColumn(node)).to.equal('height');
                    // expect(getColData(node, 'height')).to.equal('6.1,5.9,4.5');

                    // node.sort = 'age';
                    // expect(selectedColumn(node)).to.equal('age');
                    // expect(getColData(node, 'age')).to.equal('40,20,10');

                    // node.sort = null;

                    // expect(events.join(';')).to.equal('weight,asc;weight,;age,desc;bp,desc;height,desc;age,desc;');

                    // destroy(node);
                    done();
                });
            });

            it('should server-based sort', function (done) {
                const extsort = {
                    field: 'age',
                    dir: 'desc',
                };
                const data = getGeneralData();
                const section = dom('section', { html: dom('label', { html: 'Server Sortable onSort' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                        extsort,
                        // serversort: true,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('sort', function (e) {
                        console.log('sort.event', e.detail);
                        const update = {
                            field: e.detail.field,
                            dir: e.detail.dir,
                        };

                        setTimeout(() => {
                            node.extsort = update;
                        }, 400);
                        events.push(e.detail.value);
                    });
                    done();
                });
            });

            it('should dual-sort (server-based)', function (done) {
                const extsort = {
                    field: ['name', 'age'],
                    dir: 'desc',
                };
                const data = getGeneralData();
                const schema = {
                    columns: data.schemaDualSort.columns,
                };
                const section = dom('section', { html: dom('label', { html: 'Server Sortable onSort' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema,
                        rows: data.items,
                        extsort,
                        // serversort: true,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('sort', function (e) {
                        console.log('sort.event', e.detail);
                        const update = {
                            field: e.detail.field,
                            dir: e.detail.dir,
                        };

                        setTimeout(() => {
                            console.log('update', update);
                            node.extsort = update;
                        }, 400);
                        events.push(e.detail.value);
                    });
                    done();
                });
            });
        });

        describe('selecting', function () {
            it('should be selectable', function (done) {
                const data = getGeneralData();
                const section = dom('section', { html: dom('label', { html: 'Selectable' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                        selectable: true,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('chn', e);
                        events.push(e.value);
                    });
                    clickRow(node, 1);
                    expect(getSelectedRowId(node)).to.equal('1');
                    clickRow(node, 0);
                    expect(getSelectedRowId(node)).to.equal('3');
                    clickRow(node, 2);
                    expect(getSelectedRowId(node)).to.equal('2');
                    // deselect
                    clickRow(node, 2);
                    expect(getSelectedRowId(node)).to.equal(null);
                    expect(events.join(',')).to.equal('1,3,2,'); // last one is blank
                    destroy(node);

                    node.selected = 1;
                    expect(getSelectedRowId(node)).to.equal('1');

                    // test getter
                    expect(node.selected).to.equal(1);

                    node.selected = null;
                    expect(getSelectedRowId(node)).to.equal(null);

                    done();
                });
            });

            it('should select first row and update', function (done) {
                const data = getGeneralData();
                const section = dom('section', { html: dom('label', { html: 'Selectable' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                        selectable: true,
                        autoselect: true,
                    },
                    section,
                );
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('chn', e);
                    });
                    console.log('ready');

                    setTimeout(() => {
                        // node.selected = null;
                        node.update = {
                            id: 3,
                            name: 'Monkey',
                            age: 40,
                            height: 5.9,
                            weight: 220,
                            bp: 30,
                        };
                    }, 500);
                    done();
                });
            });

            // it('should handle non-selectable items', function (done) {

            // currently broken - looking to set unselectable to the css of a row

            //     const section = dom('section', {html: dom('label', {html: 'Non Selectable Item'})}, body);
            //     const node = dom('data-table', {
            //         schema: data.schema,
            //         rows: data.items,
            //         selectable: true,
            //     }, section);
            //     const events = [];
            //     onDomReady(node, function () {

            //         clickRow(node, 1);
            //         expect(getSelectedRowId(node)).to.equal('4');

            //         clickRow(node, 0);
            //         expect(getSelectedRowId(node)).to.equal(null);

            //         done();
            //     });
            // });
        });

        describe('sort and select', function () {
            it('should sort and select', function (done) {
                const data = getGeneralData();
                const section = dom('section', { html: dom('label', { html: 'Sortable and Selectable' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                        selectable: true,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    clickCol(node, 'weight');
                    expect(getColData(node, 'weight')).to.equal('90,170,220');

                    clickRow(node, 1);
                    expect(getSelectedRowId(node)).to.equal('1');

                    expect(getSelectedRowIdIndex(node)).to.equal(2);

                    clickCol(node, 'height');
                    expect(getSelectedRowId(node)).to.equal('1');
                    expect(getSelectedRowIdIndex(node)).to.equal(1);

                    done();
                });
            });

            it('should maintain sort and select after new items', function (done) {
                const data = getGeneralData();
                const section = dom('section', { html: dom('label', { html: 'Sortable and Selectable' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                        sortable: true,
                        selectable: true,
                    },
                    section,
                );
                const events = [];
                onDomReady(node, function () {
                    clickCol(node, 'weight');
                    expect(getColData(node, 'weight')).to.equal('90,170,220');

                    clickRow(node, 1);
                    expect(getSelectedRowId(node)).to.equal('1');

                    expect(getSelectedRowIdIndex(node)).to.equal(2);

                    clickCol(node, 'height');
                    expect(getSelectedRowId(node)).to.equal('1');
                    expect(getSelectedRowIdIndex(node)).to.equal(1);

                    node.data = {};

                    expect(selectedColumn(node)).to.equal('height');
                    expect(getSelectedRowId(node)).to.equal('1');
                    expect(getSelectedRowIdIndex(node)).to.equal(1);

                    done();
                });
            });
        });

        describe('hide show columns', function () {
            it('should hide and show columns', (done) => {
                const section = dom('section', { html: dom('label', { html: 'Hide Show Cols' }) }, body);
                const data = getData20();
                const node = dom(
                    'data-table',
                    {
                        schema: {
                            sort: 'firstName',
                            columns: data.columns,
                        },
                        rows: data.items,
                        scrollable: true,
                        'show-hide-columns': true,
                    },
                    section,
                );
                onDomReady(node, function () {
                    node.on('change', function (e) {
                        console.log('change', e);
                    });
                    node.on('check-all', function (e) {
                        console.log('check-all', e.value);
                    });

                    done();
                });
            });
        });

        describe('totals', function () {
            it('should render a total row', (done) => {
                // TODO
                // make readonly + checkable checboxes
                const data = getTotals();
                const section = dom('section', { html: dom('label', { html: 'Total Row' }) }, body);
                const node = dom(
                    'data-table',
                    {
                        schema: data.schema,
                        rows: data.items,
                        zebra: true,
                    },
                    section,
                );
                onDomReady(node, function () {
                    node.on('check-all', (e) => {
                        const items = data.items.map((item) => {
                            item.checked = e.value;
                            return item;
                        });
                        node.rows = items;
                    });
                    node.on('change', (e) => {
                        const index = data.items.findIndex((m) => m.id === e.value.id);
                        const items = [...data.items];
                        items.splice(index, 1, data.items[index]);
                        node.rows = items;
                    });
                    done();
                });
            });
        });
    });
});

dataNoItems = {
    schema: {
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'age', label: 'Age' },
            { key: 'height', label: 'Height' },
            { key: 'weight', label: 'Weight' },
            { key: 'bp', label: 'Blood Pressure', unsortable: true, format: 'percentage' },
        ],
    },
    items: [],
};

function selectedColumn(node) {
    const th = dom.query(node, '.desc,.asc');
    if (!th) {
        return null;
    }
    return dom.attr(th, 'data-field');
}

function clickCol(node, field) {
    const th = dom.query(node, '[data-field="' + field + '"]');
    if (!th) {
        console.warn('th not found', field);
        return null;
    }
    on.emit(th, 'click');
}

function clear(item) {
    item = { ...item };
    Object.keys(item).forEach((key) => {
        const value = item[key];
        if (typeof value === 'number') {
            item[key] = 0;
        } else if (typeof value === 'boolean') {
            item[key] = false;
        } else {
            item[key] = '';
        }
    });
    return item;
}

function clickRow(node, index) {
    const row = node.tbody.rows[index];
    on.emit(row, 'click');
}

function getSelectedRowId(node) {
    const tr = dom.query(node, '.selected');
    return tr ? dom.attr(tr, 'data-row-id') : null;
}

function getSelectedRowIdIndex(node) {
    const tr = dom.query(node, '.selected');
    return (tr || { rowIndex: null }).rowIndex;
}

function getColData(node, field) {
    const cells = dom.queryAll(node, 'tbody [data-field="' + field + '"]');
    return cells
        .map(function (cell) {
            return cell.textContent;
        })
        .join(',');
}

function copy(data) {
    return JSON.parse(JSON.stringify(data));
}

function destroy(node) {
    //node.destroy();
}

mocha.run();
