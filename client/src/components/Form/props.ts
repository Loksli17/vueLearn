//! check this props attentivle
//todo restruct this file: create common properties in new array;

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

        'required',
        'toggle',
        'showState'
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
        'continueUpload',
    ];


export default {
    selectProps,
    inputProps,
    textProps,
    checkboxProps,
    fileProps,
}