module.exports = {
    "tasks": {
        "html": {
            "src": "src/**/*.html",
            "dest": "build",
            "chain": ["gulp-htmlmin"]
        },
        "scripts": {
            "src": "src/**/*.js",
            "dest": "build",
            "chain": ["gulp-babel"]
        },
        "scripts-prep": {
            "src": ["src/**/*.prep.js", "src/**/*time-worker.js"],
            "dest": "build",
            "chain": [{
                module: "gulp-babel",
                settings: [{
                    "plugins": ["@babel/plugin-syntax-dynamic-import"]
                }]
            }]
        }
    },
    "modules": {
        "gulp-rename": [{
            "extname": ".mjs"
        }],
        "gulp-string-replace": [/\.js/g, ".mjs"],
        "gulp-babel": [{
            "plugins": ["@babel/plugin-transform-modules-amd", "@babel/plugin-syntax-dynamic-import"]
        }]
    }
}