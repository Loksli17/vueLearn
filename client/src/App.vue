<template>
    <div class="app-wrap">
        <FlashMessage class="flash-message" position="right bottom"/>
        <router-view/>
    </div>
</template>


<style lang="scss">
    .app-wrap{
        padding: 20px 50px;
        box-sizing: border-box;
    }
</style>
