
  (function () {
    const info = [
  [
    "/home/codio/workspace/v8analysis/time-worker.js",
    {
      "ics": [
        {
          "functionName": "setTimeout",
          "file": "/home/codio/workspace/v8analysis/time-worker.js",
          "line": 8,
          "column": 17,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "add",
              "map": "1b50a5289a01",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        }
      ],
      "deopts": [],
      "codes": [
        {
          "functionName": "<anonymous>",
          "file": "/home/codio/workspace/v8analysis/time-worker.js",
          "line": 1,
          "column": 1,
          "isScript": true,
          "updates": [
            {
              "timestamp": 73725,
              "state": 1,
              "severity": 2
            }
          ]
        },
        {
          "functionName": "setTimeout",
          "file": "/home/codio/workspace/v8analysis/time-worker.js",
          "line": 2,
          "column": 12,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1079471,
              "state": 1,
              "severity": 2
            },
            {
              "timestamp": 1082078,
              "state": 2,
              "severity": 1
            }
          ]
        }
      ],
      "fullPath": "/home/codio/workspace/v8analysis/time-worker.js",
      "relativePath": "time-worker.js",
      "src": "const {parentPort, workerData} = require('worker_threads');\nsetTimeout(() => {\n    const array = new Uint32Array(workerData);\n    parentPort.postMessage(\"start\");\n    while (true) {\n        // const begin = performance.now();\n        // for (let i = 0; i < 1e8; ++i) {\n        Atomics.add(array, 0, 1);\n        // }\n        // console.log(\"current rate\", 1e5 / (performance.now() - begin), \"MHz\");\n        // ++array[0];\n    }\n}, 1000);"
    }
  ],
  [
    "/home/codio/workspace/v8analysis/wasm.js",
    {
      "ics": [
        {
          "functionName": "Cache",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 50,
          "column": 19,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "size",
              "map": "4f49c6d1e41",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "Cache",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 52,
          "column": 23,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "dataview",
              "map": "4f49c6d1ee1",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 106,
          "column": 18,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "mem",
              "map": "4f49c6d2341",
              "optimizationState": 1,
              "severity": 1
            },
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "js",
              "map": "4f49c6d22f1",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 109,
          "column": 36,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "_Z10startTimerv",
              "map": "4f49c6d2431",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 110,
          "column": 34,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "_Z9stopTimerv",
              "map": "4f49c6d2431",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 111,
          "column": 13,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "_Z3logj",
              "map": "4f49c6d2431",
              "optimizationState": 1,
              "severity": 1
            },
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "env",
              "map": "4f49c6d22f1",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 119,
          "column": 32,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "exports",
              "map": "4f49c688421",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 124,
          "column": 53,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "buffer",
              "map": "4f49c688e21",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 126,
          "column": 25,
          "updates": [
            {
              "type": "KeyedStoreIC",
              "oldState": 0,
              "newState": 2,
              "key": "0",
              "map": "4f49c684781",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 126,
          "column": 32,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "random",
              "map": "4f49c684d71",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 130,
          "column": 9,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "page_size",
              "map": "4f49c6d2a21",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 131,
          "column": 9,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "probe_length",
              "map": "4f49c6d2a21",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 132,
          "column": 9,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "probe_table",
              "map": "4f49c6d2a21",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 133,
          "column": 9,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "secret_table",
              "map": "4f49c6d2a21",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 134,
          "column": 27,
          "updates": [
            {
              "type": "StoreIC",
              "oldState": 0,
              "newState": 1,
              "key": "exports",
              "map": "4f49c6d2a21",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 56,
          "column": 34,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "size",
              "map": "4f49c6d1f31",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 58,
          "column": 26,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "dataview",
              "map": "4f49c6d1f31",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 58,
          "column": 35,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "getUint32",
              "map": "4f49c6831a1",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "load",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 23,
          "column": 28,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "load",
              "map": "4f49c689a01",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush_JS_reload_JS_probe_JS",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 227,
          "column": 28,
          "updates": [
            {
              "type": "KeyedLoadIC",
              "oldState": 0,
              "newState": 2,
              "key": "847872",
              "map": "4f49c684781",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "restore",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 18,
          "column": 21,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "store",
              "map": "4f49c689a01",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "restore",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 19,
          "column": 26,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "load",
              "map": "4f49c6d1bc1",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush_JS_reload_JS_probe_JS",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 232,
          "column": 32,
          "updates": [
            {
              "type": "KeyedLoadIC",
              "oldState": 0,
              "newState": 2,
              "key": "0",
              "map": "4f49c684781",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush_JS_reload_JS_probe_JS",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 233,
          "column": 27,
          "updates": [
            {
              "type": "KeyedStoreIC",
              "oldState": 0,
              "newState": 2,
              "key": "0",
              "map": "4f49c684c81",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush_JS_reload_JS_probe_JS",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 230,
          "column": 19,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "restore",
              "map": "4f49c6d1bc1",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush_JS_reload_JS_probe_JS",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 233,
          "column": 35,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "load",
              "map": "4f49c6d1bc1",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush_JS_reload_JS_probe_JS",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 239,
          "column": 37,
          "updates": [
            {
              "type": "KeyedLoadIC",
              "oldState": 0,
              "newState": 2,
              "key": "0",
              "map": "4f49c684c81",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "run_tests",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 145,
          "column": 9,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "page_size",
              "map": "4f49c6d2a21",
              "optimizationState": 1,
              "severity": 1
            },
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "probe_length",
              "map": "4f49c6d2a21",
              "optimizationState": 1,
              "severity": 1
            },
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "probe_table",
              "map": "4f49c6d2a21",
              "optimizationState": 1,
              "severity": 1
            },
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "secret_table",
              "map": "4f49c6d2a21",
              "optimizationState": 1,
              "severity": 1
            },
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "exports",
              "map": "4f49c6d2a21",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "run_tests",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 146,
          "column": 33,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "random",
              "map": "4f49c684d71",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush_JS_reload_JS_probe_JS",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 226,
          "column": 15,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "flush",
              "map": "4f49c6d1f31",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush_JS_reload_JS_probe_JS",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 255,
          "column": 21,
          "updates": [
            {
              "type": "LoadIC",
              "oldState": 1,
              "newState": 2,
              "key": "log",
              "map": "4f49c6cbdb1",
              "optimizationState": 1,
              "severity": 1
            }
          ]
        }
      ],
      "deopts": [
        {
          "functionName": "flush",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 60,
          "column": 17,
          "updates": [
            {
              "timestamp": 1168840,
              "bailoutType": "soft",
              "deoptReason": "Insufficient type feedback for generic named access",
              "optimizationState": 2,
              "inlined": false,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush_JS_reload_JS_probe_JS",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 249,
          "column": 19,
          "updates": [
            {
              "timestamp": 1207107,
              "bailoutType": "soft",
              "deoptReason": "Insufficient type feedback for call",
              "optimizationState": 2,
              "inlined": false,
              "severity": 1
            }
          ]
        }
      ],
      "codes": [
        {
          "functionName": "resolve",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 30,
          "column": 24,
          "isScript": false,
          "updates": [
            {
              "timestamp": 91650,
              "state": 1,
              "severity": 2
            }
          ]
        },
        {
          "functionName": "Cache",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 49,
          "column": 16,
          "isScript": false,
          "updates": [
            {
              "timestamp": 91927,
              "state": 1,
              "severity": 2
            }
          ]
        },
        {
          "functionName": "worker.on",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 31,
          "column": 30,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1159872,
              "state": 1,
              "severity": 2
            }
          ]
        },
        {
          "functionName": "initWASM",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 101,
          "column": 24,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1160135,
              "state": 1,
              "severity": 2
            }
          ]
        },
        {
          "functionName": "Promise",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 78,
          "column": 31,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1162490,
              "state": 1,
              "severity": 2
            }
          ]
        },
        {
          "functionName": "setTimeout",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 78,
          "column": 63,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1164697,
              "state": 1,
              "severity": 2
            }
          ]
        },
        {
          "functionName": "run_tests",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 138,
          "column": 25,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1164768,
              "state": 1,
              "severity": 2
            }
          ]
        },
        {
          "functionName": "flush_JS_reload_JS_probe_JS",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 222,
          "column": 41,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1164860,
              "state": 1,
              "severity": 2
            },
            {
              "timestamp": 1205170,
              "state": 2,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "flush",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 54,
          "column": 10,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1164916,
              "state": 1,
              "severity": 2
            },
            {
              "timestamp": 1168011,
              "state": 2,
              "severity": 1
            },
            {
              "timestamp": 1176998,
              "state": 2,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "restore",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 16,
          "column": 16,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1164940,
              "state": 1,
              "severity": 2
            },
            {
              "timestamp": 1197307,
              "state": 2,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "load",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 21,
          "column": 13,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1165023,
              "state": 1,
              "severity": 2
            },
            {
              "timestamp": 1192188,
              "state": 2,
              "severity": 1
            }
          ]
        },
        {
          "functionName": "terminate",
          "file": "/home/codio/workspace/v8analysis/wasm.js",
          "line": 25,
          "column": 18,
          "isScript": false,
          "updates": [
            {
              "timestamp": 1211946,
              "state": 1,
              "severity": 2
            }
          ]
        }
      ],
      "fullPath": "/home/codio/workspace/v8analysis/wasm.js",
      "relativePath": "wasm.js",
      "src": "let window = this;\nconst {Worker} = require('worker_threads');\n\n// ------------------------------------------------------------------------------------------------------\n\nconst sharedbuffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT);\nconst array = new Uint32Array(sharedbuffer);\nconst TimerPromise =\n(async () => {\n    const worker = new Worker(\"./time-worker.js\", {workerData: sharedbuffer});\n    /*const response = await fetch(\"./time-worker.js\");\n    const encoded_string = btoa(await response.text());\n    const script_url = \"data:text/javascript;base64,\" + encoded_string;\n    const worker = new Worker(script_url);*/\n    const Timer = {\n        restore() {\n            // array[0] = 0;\n            Atomics.store(array, 0, 0);\n            return Timer.load();\n        },\n        load() {\n            // return array[0];\n            return Atomics.load(array, 0);\n        },\n        terminate() {\n            worker.terminate();\n        }\n    };\n    window.Timer = Timer;\n    return new Promise(resolve => {\n        worker.on(\"message\", () => {\n            resolve(Timer);\n        });\n        // worker.postMessage(sharedbuffer);\n    });\n})();\n\n// ------------------------------------------------------------------------------------------------------\n\nlet Timer;\n(async () => {\n    Timer = await TimerPromise;\n})();\n\nconst offset = 64;\n// prevent optimization\nlet junk = 0;\nclass Cache {\n    constructor(size) {\n        this.size = size;\n        const buffer = new ArrayBuffer(size);\n        this.dataview = new DataView(buffer);\n    }\n    flush() {\n        Timer.restore();\n        for (let i = 0; i < this.size / offset; ++i) {\n            // read array value into cache\n            junk ^= this.dataview.getUint32(i * offset);\n        }\n        console.log(\"average cache time\", Timer.load() / (this.size / offset));\n        return junk;\n    };\n}\n\n// -------------------------------------------------------------------------------------------------------\n\nconst cache = new Cache(4 * (1 << 20));\n\nconst code_promise = (async () => {\n    return new Uint8Array([0,97,115,109,1,0,0,0,1,141,128,128,128,0,3,96,0,0,96,0,1,127,96,1,127,1,127,2,171,128,128,128,0,2,3,101,110,118,15,95,90,49,48,115,116,97,114,116,84,105,109,101,114,118,0,0,3,101,110,118,13,95,90,57,115,116,111,112,84,105,109,101,114,118,0,1,3,137,128,128,128,0,8,1,1,1,1,1,1,1,2,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,33,6,129,128,128,128,0,0,7,165,129,128,128,0,9,6,109,101,109,111,114,121,2,0,15,95,90,49,48,112,114,111,98,101,84,97,98,108,101,118,0,2,15,95,90,49,48,102,108,117,115,104,67,97,99,104,101,118,0,3,15,95,90,49,48,105,110,105,116,105,97,108,105,122,101,118,0,4,16,95,90,49,49,103,101,116,80,97,103,101,83,105,122,101,118,0,5,19,95,90,49,52,103,101,116,80,114,111,98,101,76,101,110,103,116,104,118,0,6,20,95,90,49,53,103,101,116,80,114,111,98,101,65,100,100,114,101,115,115,118,0,7,21,95,90,49,54,103,101,116,83,101,99,114,101,116,65,100,100,114,101,115,115,118,0,8,10,95,90,54,114,101,108,111,97,100,104,0,9,10,148,130,128,128,0,8,128,129,128,128,0,1,7,127,65,128,120,33,2,3,64,16,0,32,2,65,144,136,129,1,106,16,1,54,2,0,32,2,65,4,106,34,2,13,0,11,65,127,33,2,65,0,33,4,65,144,128,129,1,33,3,65,0,33,5,65,0,33,6,3,64,32,3,40,2,0,34,0,32,2,32,0,32,2,73,34,1,27,33,2,32,4,32,5,32,1,27,33,5,32,3,65,4,106,33,3,32,6,32,0,69,106,33,6,32,4,65,1,106,34,4,65,128,2,71,13,0,11,65,127,32,5,32,6,65,1,75,27,11,192,128,128,128,0,1,3,127,65,0,33,1,65,144,128,128,1,33,0,65,0,33,2,3,64,32,0,40,2,0,32,2,65,255,1,113,115,33,2,32,0,65,128,2,106,33,0,32,1,65,192,0,106,34,1,65,128,32,73,13,0,11,32,2,65,255,1,113,11,132,128,128,128,0,0,65,0,11,133,128,128,128,0,0,65,128,32,11,135,128,128,128,0,0,65,128,128,192,0,11,132,128,128,128,0,0,65,16,11,135,128,128,128,0,0,65,144,128,192,0,11,144,128,128,128,0,0,32,0,65,12,116,65,16,106,45,0,0,16,2,114,11]);\n})();\n\n(async () => {\n    Timer = await TimerPromise;\n    try {\n            const wasm_configuration = await initWASM();\n        for (let i = 0; i < 20; ++i) {\n            await new Promise((resolve, reject) => setTimeout(async () => {\n            try {\n                const success = await run_tests(wasm_configuration);\n                // keep_book(success);\n            resolve();\n            } catch (error) {\n                if (error.message != \"timer fault\") {\n                    reject(error);\n                } else {\n                    // console.warn(\"timer fault\");\n                    --i;\n                    resolve();\n                }\n            }\n            }, 0));\n        }\n    } catch (error) {\n        console.error(error);\n    }\n    Timer.terminate();\n    // location.reload();\n})();\n\nasync function initWASM() {\n    let i = 0;\n    const wasm_memory = new WebAssembly.Memory({initial: 110});\n    const {instance} = await WebAssembly.instantiate(await code_promise, {\n        js: {\n            mem: wasm_memory\n        },\n        env: {\n            _Z10startTimerv: Timer.restore,\n            _Z9stopTimerv: Timer.load,\n            _Z3logj(argument) {\n              console.log(\"log\", argument, i++);\n            }\n        }\n    });\n    // console.log(\"exports\", instance.exports);\n    instance.exports._Z10initializev();\n\n    const page_size = instance.exports._Z11getPageSizev();\n    const probe_length = instance.exports._Z14getProbeLengthv();\n    const probe_address = instance.exports._Z15getProbeAddressv();\n    const probe_table = new Uint8Array(wasm_memory.buffer, probe_address, probe_length);\n    const secret_address = instance.exports._Z16getSecretAddressv();\n    const secret_table = new Uint8Array(wasm_memory.buffer, secret_address, probe_length);\n    for (let i = 0; i < probe_length; i += page_size) {\n        secret_table[i] = Math.random() * 256 | 0;\n    }\n\n    return {\n        page_size,\n        probe_length,\n        probe_table,\n        secret_table,\n        exports: instance.exports\n    };\n}\n\nasync function run_tests(wasm_configuration) {\n    const {\n        page_size,\n        probe_length,\n        probe_table,\n        secret_table,\n        exports\n    } = wasm_configuration;\n    let test_probe_index = Math.random() * 256 | 0;\n    let probe_result = flush_JS_reload_JS_probe_JS();\n    return probe_result == test_probe_index;\n    \n    function flush_WASM_reload_WASM_probe_WASM() {\n        // console.groupCollapsed(\"flush_WASM_reload_WASM_probe_WASM\");\n        exports._Z10flushCachev();\n        exports._Z6reloadh(test_probe_index);\n        const result = exports._Z10probeTablev();\n        // console.groupEnd();\n        if (result == -1) {\n            throw Error(\"timer fault\");\n        }\n        if (test_probe_index == result) {\n            console.log(\"success\");\n        } else {\n            console.log(\"failure\", result, \"for\", test_probe_index);\n        }\n        return result;\n    }\n    function flush_WASM_reload_JS_probe_WASM() {\n        // console.groupCollapsed(\"flush_WASM_reload_JS_probe_WASM\");\n        const probe_index = test_probe_index * page_size;\n        exports._Z10flushCachev();\n        let junk = 0;\n        junk ^= probe_table[probe_index];\n        const result = exports._Z10probeTablev() | junk;\n        // console.groupEnd();\n        if (result == -1) {\n            throw Error(\"timer fault\");\n        }\n        // console.groupEnd();\n        if (test_probe_index == result) {\n            console.log(\"success\");\n        } else {\n            console.log(\"failure\", result, \"for\", test_probe_index);\n        }\n        return result;\n    }\n    function flush_WASM_reload_JS_probe_JS() {\n        // console.groupCollapsed(\"flush_WASM_reload_JS_probe_JS\");\n        const time_table = new Uint32Array(256);\n        let junk = 0;\n        exports._Z10flushCachev();\n        junk ^= probe_table[test_probe_index * page_size];\n        for (let i = 0; i < 256; ++i) {\n            const probe_index = i * page_size;\n            Timer.restore();\n            // access the probe table\n            junk ^= probe_table[probe_index];\n            time_table[i] = Timer.load();\n        }\n        let zero_counter = 0;\n        let min_index = 0 & junk;\n        let min_value = 0xffffffff;\n        for (let i = 0; i < 256; ++i) {\n            const value = time_table[i];\n            zero_counter += value == 0;\n            // console.log(value, i);\n            if (value < min_value) {\n                min_value = value;\n                min_index = i;\n            }\n        }\n        // console.groupEnd();\n        if (zero_counter > 1) {\n            throw Error(\"timer fault\");\n        }\n        const z_index = zIndex(time_table, min_value).toFixed(2);\n        if (test_probe_index == min_index) {\n            console.log(\"success for\", test_probe_index, \"with\", z_index);\n        } else {\n            console.log(\"failure\", min_index, \"for\", test_probe_index, \"with\", z_index);\n        }\n        return min_index;\n    }\n    function flush_JS_reload_JS_probe_JS() {\n        // console.groupCollapsed(\"flush_WASM_reload_JS_probe_JS\");\n        const time_table = new Uint32Array(256);\n        let junk = 0;\n        cache.flush();\n        junk ^= probe_table[test_probe_index * page_size];\n        for (let i = 0; i < 256; ++i) {\n            const probe_index = i * page_size;\n            Timer.restore();\n            // access the probe table\n            junk ^= probe_table[probe_index];\n            time_table[i] = Timer.load();\n        }\n        let zero_counter = 0;\n        let min_index = 0 & junk;\n        let min_value = 0xffffffff;\n        for (let i = 0; i < 256; ++i) {\n            const value = time_table[i];\n            zero_counter += value == 0;\n            // console.log(value + \"\\t\" + i);\n            if (value < min_value) {\n                min_value = value;\n                min_index = i;\n            }\n        }\n        // console.groupEnd();\n        if (zero_counter > 1) {\n            throw Error(\"timer fault\");\n        }\n        // const z_index = zIndex(time_table, min_value).toFixed(2);\n        if (test_probe_index == min_index) {\n            console.log(\"success for\", test_probe_index);//, \"with\", z_index);\n        } else {\n            console.log(\"failure\", min_index, \"for\", test_probe_index);//, \"with\", z_index);\n        }\n        return min_index;\n    }\n}\n\nfunction keep_book(success) {\n    let distribution;\n    try {\n        distribution = JSON.parse(localStorage.getItem(\"distribution\"));\n    } catch (error) {}\n    distribution = distribution || [];\n    let current_iteration = parseInt(localStorage.getItem(\"current_iteration\")) | 0;\n    if (success) {\n        ++current_iteration;\n    } else {\n        distribution[current_iteration] = (distribution[current_iteration] | 0) + 1;\n        localStorage.setItem(\"distribution\", JSON.stringify(distribution));\n        current_iteration = 0;\n    }\n    localStorage.setItem(\"current_iteration\", current_iteration);\n}"
    }
  ]
]
    deoptigateRender(info)
  })()
  