import sweepParameter_promise from "./sweep-parameter.js";
import timer_promise from "../timer.js";

(async () => {
    try {
        console.log("worker start");
        const timer = await timer_promise;
        console.log("timer resolved in worker", timer);
        const sweepParameter = await sweepParameter_promise;
        console.log("sweep resovled in worker");

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
    } catch (error) {
        console.error(error);
    }
})();