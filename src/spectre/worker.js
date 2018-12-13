import sweepParameter_promise from "./sweep-parameter.js";
import timer_promise from "../timer.js";

(async () => {
    const timer = await timer_promise;
    const sweepParameter = await sweepParameter_promise;
    
    console.time("test");
    try {
        const method_name = new URL(location).searchParams.get("method");
        console.log("start sweep", method_name);
        await sweepParameter(method_name);
    } catch (error) {
        console.error(error);
    } finally {
        timer.terminate();
        console.timeEnd("test");
    }
})();