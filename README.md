# AngularJS Multiselect [![Build Status](https://travis-ci.org/namoscato/angular-multiselect.svg?branch=master)](https://travis-ci.org/namoscato/angular-multiselect)

AngularJS multiselect component based off [`ngOptions`](https://docs.angularjs.org/api/ng/directive/ngOptions).

## Dependencies

* [AngularJS](https://angularjs.org/) v1.5.x
* [Bootstrap](http://getbootstrap.com/) v3.3.x for dropdown styles
* [UI Bootstrap](http://angular-ui.github.io/bootstrap/) v1.2.x for dropdown functionality

## Usage

The interface for this directive is based off [`ngOptions`](https://docs.angularjs.org/api/ng/directive/ngOptions):

```html
<amo-multiselect
    ng-model="app.model"
    options="option.id as option.label for option in app.options"
    on-change="app.onChange(label)"
    on-toggle-dropdown="app.onToggleDropdown(isOpen)"
    label="app.label"
    search-text="Search..."
    select-text="Select..."
    select-all-text="Select All"
    deselect-all-text="Deselect All"
    selected-suffix-singular-text="thing"
    selected-suffix-text="things">
</amo-multiselect>
```

where the value of `options` is of the following form:

`[`_`select`_ **`as`**`]` _`label`_ `[`**`group by`** _`group`_`]` **`for`** _`value`_ **`in`** _`array`_

where:

* `array`: An expression which evaluates to an array.
* `value`: Local variable which will refer to each item in the `array` during iteration.
* `label`: The result of this expression will be the label for `<option>` element.
* `select`: The result of this expression will be bound to the model of the parent `<select>` element. If not specified, `select` expression will default to `value`.
* `group`: The result of this expression will be used to group options.

## Development

1. Install dependencies

        npm install

2. Compile JavaScript & CSS

        gulp all

3. Run local webserver

        gulp serve

## Running Tests

Install the [Karma](http://karma-runner.github.io/) commandline interface globally and run:

    karma start
