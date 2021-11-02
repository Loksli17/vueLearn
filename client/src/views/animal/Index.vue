

<style lang="scss">
    @import "@/assets/scss/button.scss";
    @import "@/assets/scss/add-line.scss";

    .add-line{
        @extend %add-line;

        a{
            @extend %button;
        }

        .create-btn{
            @extend %create-button;
        }
    }
</style>