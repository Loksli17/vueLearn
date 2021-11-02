module.exports = {
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
                .tap(options => {
                    // modify the options...
                    options.transformToRequire = {
                        audio: 'src',
                        video: ['src', 'poster'],
                        source: 'src',
                        img: 'src',
                        image: ['xlink:href', 'href'],
                        use: ['xlink:href', 'href']
                    }
                    return options
                });
    }
}