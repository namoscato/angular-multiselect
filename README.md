# AngularJS Multiselect [![Build Status](https://travis-ci.org/namoscato/angular-multiselect.svg?branch=backport)](https://travis-ci.org/namoscato/angular-multiselect)

AngularJS multiselect component based off [`ngOptions`](https://docs.angularjs.org/api/ng/directive/ngOptions), backported to work with AngularJS v1.2.28 and Bootstrap's jQuery plugin.

## Dependencies

* [AngularJS](https://angularjs.org/) v1.2.28
* [Bootstrap](http://getbootstrap.com/) v3.3.5 for dropdown functionality
* [jQuery](https://jquery.com/) v2.1.4 for Bootstrap JavaScript support

## Development

1. Install dependencies

        npm install

2. Compile JavaScript & CSS

        gulp all

3. Run local webserver

        gulp serve

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

where the value of `options` is of the following form: `[`_`select`_ **`as`**`]` _`label`_ **`for`** _`value`_ **`in`** _`array`_

## Running Tests

Install the [Karma](http://karma-runner.github.io/) commandline interface (`karma-cli`) globally and run:

    karma start
