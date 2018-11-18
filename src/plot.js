const layout = {};

export default storage => {
    const x = [];
    const ratio_y = [];
    const rate_y = [];
    const duration_y = [];
    const entries = Object.entries(storage);
    entries.sort(([a], [b]) => a - b);
    for (const [key, value] of entries) {
        const float_key = parseFloat(key);
        x.push(float_key);
        ratio_y.push(value.ratio);
        rate_y.push(value.rate);
        duration_y.push(value.duration);
    }
    Plotly.newPlot("ratio-plot", [{
        x,
        y: ratio_y
    }], layout);
    Plotly.newPlot("rate-plot", [{
        x,
        y: rate_y
    }], layout);
    Plotly.newPlot("duration-plot", [{
        x,
        y: duration_y
    }], layout);
};