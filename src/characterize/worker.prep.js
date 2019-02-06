if (typeof importScripts != "undefined") {
    try {
        importScripts("https://unpkg.com/requirejs@2.3.6/require.js");
        require(["worker.js"], () => {});
    } catch (error) {
        console.error(error);
        (async () => {
            try {
                await eval(`import("./worker.js")`);
            } catch (error) {
                console.error(error);
            }
        })();
    }
}