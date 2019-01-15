const gulp = require("gulp");
const {
    tasks,
    modules
} = require("./gulpconf.js");
for (const task_name in tasks) {
    const task = tasks[task_name];
    const task_function = pipe_part => {
        for (const part of task.chain) {
            const module_name = typeof part == "string" ? part : part.module;
            const module_settings = (typeof part == "string" ? null : part.settings) || modules[module_name] || [];
            let pipe_function = require(module_name);
            if (typeof pipe_function != "function") {
                pipe_function = pipe_function.default;
            }
            pipe_part = pipe_part.pipe(pipe_function(...module_settings));
            pipe_part.on("error", error => console.error(error.toString()));
        }
        if (task.dest !== undefined) {
            pipe_part = pipe_part.pipe(gulp.dest(task.dest));
        }
        return pipe_part;
    };
    gulp.task(task_name, () => task_function(gulp.src(task.src)));
}