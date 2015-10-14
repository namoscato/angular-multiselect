# AngularJS Multiselect

AngularJS multiselect component based off [`ngOptions`](https://docs.angularjs.org/api/ng/directive/ngOptions).

## Dependencies

* [AngularJS](https://angularjs.org/) v1.4.7
* [Bootstrap](http://getbootstrap.com/) v3.3.5 for dropdown styles
* [UI Bootstrap](http://angular-ui.github.io/bootstrap/) v0.14.0+ for dropdown functionality

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
    search-text="Search..."
    select-text="Select..."
    select-all-text="Select All"
    deselect-all-text="Deselect All">
</amo-multiselect>
```

where the value of `options` is of the following form: `[`_`select`_ **`as`**`]` _`label`_ **`for`** _`value`_ **`in`** _`array`_

## Roadmap

- [ ] Add support for older library versions
- [ ] Unit tests & automated tests
- [ ] Isolated build/distribution process
- [ ] Documentation
