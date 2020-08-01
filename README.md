# AngularJS Multiselect [![Build Status](https://travis-ci.org/namoscato/angular-multiselect.svg?branch=master)](https://travis-ci.org/namoscato/angular-multiselect)

AngularJS multiselect component based off [`ngOptions`](https://docs.angularjs.org/api/ng/directive/ngOptions).

## Dependencies

* [AngularJS](https://angularjs.org/) v1.x
* [Bootstrap CSS](http://getbootstrap.com/) v3.x for dropdown styles
* [UI Bootstrap](http://angular-ui.github.io/bootstrap/) v1.3.x for dropdown functionality

## Installation

### npm

```
npm i amo-angular-multiselect
```

### Bower

```
bower install amo-angular-multiselect
```

## Usage

Declare a dependency on the `amo.multiselect` module:

```js
angular.module('myModule', ['amo.multiselect']);
```

and add the `amoMultiselect` directive to your template:

```html
<amo-multiselect
    ng-model="app.model"
    options="option.id as option.label for option in app.options">
</amo-multiselect>
```

where the value of `options` is of the following form:

`[`_`select`_ **`as`**`]` _`label`_ `[`**`group by`** _`group`_`]` **`for`** _`value`_ **`in`** _`array`_

| Keyword  | Description |
| -------- | ----------- |
| `select` | The result of this expression will be bound to the model of the parent `<amo-multiselect>` element. If not specified, `select` expression will default to `value`. |
| `label`  | The result of this expression will be the label for each option. |
| `group`  | The result of this expression will be used to group options. |
| `value`  | Local variable which will refer to each item in the `array` during iteration. |
| `array`  | An expression which evaluates to an array. |

## Settings

The following settings can be set on a per-instance basis via _dasherized_ `<amo-multiselect>` attributes. Some settings can be set globally via _camel cased_ `amoMultiselectConfig` [constant](https://docs.angularjs.org/api/auto/service/$provide#constant) properties.

| Name | Type | Global | Default | Description |
| ---- | ---- |:------:| ------- | ----------- |
| `conjunctionText` | `@string` | Yes | and | Coordinating conjunction text used to join option labels |
| `deselectAllText` | `@string` | Yes | Deselect&nbsp;All | Deselect all option label text |
| `filterText` | `@string` | Yes | Search... | Search filter input placeholder text |
| `isDeselectAllEnabled` | `<boolean` | Yes | `true` | State of deselect all functionality |
| `isDisabled` | `<boolean` | No | `false` | State of dropdown toggle functionality |
| `isFilterEnabled` | `<boolean` | Yes | `true` | State of search filter input visibility |
| `isSelectAllEnabled` | `<boolean` | Yes | `true` | State of select all functionality |
| `label` | `&string` | No | — | Expression bound to the current button label text |
| `limitTo` | `<number` | Yes | 500 | Upper bound limit of options to show per group so that browser performance will not suffer with large data sets. Specify `0` or `false` to disable limiting. |
| `name` | `@string` | No | — | Unique instance name used as the value of the button's `id` attribute |
| `onChange` | `&function(label)` | No | — | Expression called with `label` string when model changes |
| `onToggleDropdown` | `&function(isOpen)` | No | — | Expression called with `isOpen` boolean when dropdown opens or closes |
| `selectAllText` | `@string` | Yes | Select&nbsp;All | Select all option label text |
| `selectedSuffixSingularText` | `@string` | Yes | item | Singular suffix appended to button label text when option label properties are undefined |
| `selectedSuffixText` | `@string` | Yes | items | Suffix appended to button label text when option label properties are undefined |
| `selectText` | `@string` | Yes | Select... | Default button label text when no options are selected |

## Development

```
npm i
npm start
```

## Running Tests

```
npm test
```
