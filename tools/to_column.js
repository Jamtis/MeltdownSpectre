const argv = require("minimist")(process.argv.slice(2));

const fs = require("fs");

try {
    const files = fs.readdirSync(argv.input, {
        encoding: "utf8"
    });
    for (const file of files) {
        if (file.endsWith(".json")) {
            const input_content = fs.readFileSync(argv.input + file, {
                encoding: "utf8"
            });
            // console.log(input_content);
            let {test_results, display_data, division_results, sequential_results} = JSON.parse(input_content);
            division_results = division_results || test_results || display_data; // legacy support
            const property_names = new Set;
            console.assert(division_results, file);
            // gather all property names
            for (const entry of Object.values(division_results)) {
                for (const property_name of Object.keys(entry)) {
                    // console.log("property_name", property_name);
                    property_names.add(property_name);
               }
            }
            const properties = [...property_names];
            let header_string = `index\t${properties.map(key => key + " (division)").join("\t")}`;
            if (sequential_results) {
                header_string += `\t${properties.map(key => key + " (sequential)").join("\t")}`;
            }
            const entry_string = Object.entries(division_results).map(([key, entry]) => {
                const line_array = [key];
                for (const property_name of property_names) {
                    line_array.push(entry[property_name] === undefined ? "" : entry[property_name]);
                }
                if (sequential_results) {
                    const sequential_entry = sequential_results[key];
                    for (const property_name of property_names) {
                        line_array.push(sequential_entry[property_name] === undefined ? "" : sequential_entry[property_name]);
                    }
                }
                return line_array.join("\t");
            }).join("\n");
            const text_content = header_string + "\n" + entry_string;
            // console.log(header_string);
            // console.log(entry_string);
            fs.writeFile(argv.input + "tables/" + file.replace(/\.json$/, ".txt"), text_content, error => error && console.error(error));
        }
    }
} catch (error) {
    console.error(error);
}