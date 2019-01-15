import sweepParameter_promise from "./sweep-parameter.js";
import timer_promise from "../../timer.js";

(async () => {
    const timer = await timer_promise;
    // overwrite
    /*let before;
    timer.restore = () => {
        before = performance.now();
    };
    timer.load = () => {
        return performance.now() - before;
    };*/
    const sweepParameter = await sweepParameter_promise;
    
    console.time("test");
    try {
        const method_name = new URL(location).searchParams.get("method");
        const division_property = new URL(location).searchParams.get("division") || "success_ratio";
        console.log("start sweep", method_name);
        await sweepParameter(method_name, division_property);
    } catch (error) {
        console.error(error);
    } finally {
        timer.terminate();
        console.timeEnd("test");
    }
})();