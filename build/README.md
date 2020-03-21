# Data Table

Data table web component with multiple features

## Install

To install:

    yarn @clubajax/data-table
    cd data-table
    yarn

## Usage

Create a `data-table` element, passing in at least a _schema_ and _rows_.

_Data Table has not been tested using markup. It shoudl work, but the schema and rows will need to be passed in dynamically._

### Simple Example

```
const schema = {
    columns: [
        {key: 'name', label: 'Name'},
        {key: 'age', label: 'Age'},
        {key: 'height', label: 'Height'}
    ]
};

const data = [
    {
        id: 1,
        name: 'Moke',
        age: 20,
        height: 6.1,
    }, {
        id: 2,
        name: 'Joke',
        age: 10,
        height: 4.5,
    }, {
        id: 3,
        name: 'Doke',
        age: 40,
        height: 5.9,
    }
];

dom('data-table', {
    schema: schema,
    rows: data,
}, parentNode);
```

## Data

Data is an array of objects, of which each object represents a row. Each object should be a key-value pair; the key is the property, and the value is what will be displayed in the table.

## Schema

The Schema can have several properties:

 * **sort**: The property in the columns of which the table will be initially sorted.
 * **desc**: The initial sort default to asecending. If `desc = true`, it will default to descending.
 * **width**: The width of that column. Can be an interger (pixels) or a string (to use percentages).  
 * **columns**: An array of objects which represents the columns. Each object s a key-value pair; the `key` property should map to a property in a data object. The `label` is what displays in the table header. Columns can also contain an additional property:
 * **columns.component**: An object that represents a widget that will make that column of cells editable.
 * **columns.component.type**: The type of widget that will appear in the cell. Note for all but `link`, a `peerDependency` of [@clubajax/form](https://github.com/clubajax/form).


### Component Types

#### `link`
The cell will render as a link. An additonal property should be used, `url` of which the value should map to a property in the data object.

#### `ui-input`
When the cell is clicked, an input will show. 

An additional property of `subtype` can be used for other input types. Defaults to text. (Note, this is untested).

An additonal property of `format` can also be used to format the input and HTML cell display. The following formats are currently supported: `currency`, `integer`, and `percentage`.

#### `ui-dropdown`
The cell will render as a dropdown. The property in the data will be the value of the dropdown. An additonal property, `options` should be used, which is an array of objects that represents the dropdown options.

#### `ui-checkbox`
The cell will render as a checkbox. The property in the data will be the value of the checkbox; `true` for checked, `false` for unchecked.

#### Change Event

When using any component (other than `link`), and the component is changed, the Data Table will emit a `change` event. The event will be a DOM HTMLClick event, and the `event.value` will be the changed data item (reprenting that row).

## Data Table Attributes

 * **scrollable**: This attribute will render a static header, while the table body can scroll (both horizontally and vertically). _NOTE: Not yet tested on Windows. While it will work, the scrollbar may cause alignment issues_.
 * **clickable**: When using this attribute, each row and header cell will be clickable, and have a hover state. It will emit custom events, `header-click` and `row-click`. 
 * **selectable**: This attribute allows for a single-selection of rows. If used with `sortable`, the selction is maintained. A `change` event will be emitted, with the value of the item/row id. The item and the row will also be in the event.

 ## Styling

 Data Table uses CSS custom vars, so it is a simple matter of overwriting them, copying from the included stylesheet. Else, it would be a simple matter of overwriting the existing styles and making use of attribute selectors.

 ## License

 [Free](./LICENSE), as in Beer with Bob