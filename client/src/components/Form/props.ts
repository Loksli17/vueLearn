//! check this props attentivle

const 
    selectProps: Array<string> = [
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

    inputProps: Array<string> = [
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

    textProps: Array<string> = [
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

    checkboxProps: Array<string> = [
        'name',
        'type',
        'error',
        'label',
    ],

    fileProps: Array<string> = [
        'name',
        'type',
        'error',
        'label',

        'maxFilesAmount',
        'autoLoad',
        'maxFileSize',
        'types',
        'files',
        'loadHandler',
        'dragAndDropCapableError',
        'fileSizeError',
        'fileTypeError',
    ];


export default {
    selectProps,
    inputProps,
    textProps,
    checkboxProps,
    fileProps,
}