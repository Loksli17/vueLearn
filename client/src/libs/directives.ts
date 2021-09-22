

export default {

    clickOutside: {
        name: 'click-outside',

        mounted: (el: any, binding: any) => {
            el.clickOutsideEvent = function (e: any) {
                if (!(el == e.target || el.contains(e.target))){
                    binding.value(e);
                }
            };
            document.body.addEventListener('click', el.clickOutsideEvent)
        },

        unmounted: (el: any) => {
            document.body.removeEventListener('click', el.clickOutsideEvent)
        },
    }
}