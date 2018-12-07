const layout = {};

export default (storage, trace_names) => {
    const x = [];
    const traces = {};
    for (const trace_name of trace_names) {
        traces[trace_name] = [];
    }
    const entries = Object.entries(storage);
    entries.sort(([a], [b]) => a - b);
    for (const [key, value] of entries) {
        const float_key = parseFloat(key);
        x.push(float_key);
        for (const trace_name of trace_names) {
            traces[trace_name].push(value[trace_name]);
        }
    }
    for (const trace_name of trace_names) {
        if (!document.querySelector("#" + trace_name + "-plot")) {
           const plot_container = document.createElement("div");
            plot_container.id = trace_name + "-plot";
            document.body.appendChild(plot_container);
        }
        Plotly.newPlot(trace_name + "-plot", [{
            x,
            y: traces[trace_name],
            mode: "lines+markers"
        }], layout);
    }
};