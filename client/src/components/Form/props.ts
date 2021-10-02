//! check this props attentivle

const 
    selectProp: Array<string> = [
        'name',
        'type',
        'error',
        'label',

        'selected',
        'options',
        'multiple',
        'disabledOption',
        'search',
        'currentItem'
    ],
    inputProp: Array<string> = [
        'name',
        'type',
        'error',
        'label',

        'max',
        'min',
        'pattern',
        'required',
        'disabled',
        'readonly',
        'placeholder',
        'step',
        'autocomplete',
        'autofocus',
    ],
    textProp: Array<string> = [
        'name',
        'type',
        'error',
        'label',

        'cols',
        'maxLength',
        'rows',
        'tabIndex',
        'wrap',
    ],
    checkboxProp: Array<string> = [
        'name',
        'type',
        'error',
        'label',
    ];


export default {
    selectProp,
    inputProp,
    textProp,
    checkboxProp,
}