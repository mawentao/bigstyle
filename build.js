({
    baseUrl: './touch/static/src',
    dir: './touch/static/dist',
    modules: [
        {
            name: 'jsapp'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true
})
