module.exports = {
    "tasks": {
        "scripts": {
            "src": "src/**/*.js",
            "dest": "build",
            "chain": ["gulp-rename", "gulp-string-replace", "gulp-babel"]
        }
    },
    "modules": {
        "gulp-rename": [{
            "extname": ".mjs"
        }],
        "gulp-string-replace": [/\.js/g, ".mjs"],
        "gulp-babel": []
    }
}