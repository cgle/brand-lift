require.config({
    paths: {
        "jquery": "libs/jquery",
        "underscore": "libs/underscore",
        "backbone": "libs/backbone"
    },
    shim: {
        "underscore": {
            deps: [],
            exports: "_"
        },
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        }
    }
})