const default_layout = {};

export default (storage, trace_names, title_mapping) => {
    if (typeof title_mapping != "function") {
        title_mapping = x => x;
    }
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
        const escaped_trace_name = btoa(title_mapping(trace_name)).replace(/=/g, "");
        if (!document.querySelector("#" + escaped_trace_name + "-plot")) {
           const plot_container = document.createElement("div");
            plot_container.id = escaped_trace_name + "-plot";
            document.body.appendChild(plot_container);
        }
        const layout = {
            ...default_layout,
            title: title_mapping(trace_name)
        };
        Plotly.newPlot(escaped_trace_name + "-plot", [{
            x,
            y: traces[trace_name],
            mode: "lines+markers"
        }], layout);
    }
};