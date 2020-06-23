const colors = require("colors");
const express = require("express");
const fs = require("fs");
const VirtualMachine = require("scratch-vm");
const process = require("process");

const PORT = process.env.PORT || 3000;

// Mute consoles because of scratch-vm's overuse thereof
console.log = () => {};

/* Converts an individual project from SB2 to SB3.
 * Takes in an sb2 data structure and options.
 * 
 * Returns an sb3 data structure. False if failed.
*/
let convert = function(sb2, options, res) {
    if (options["verbose"]) {
        console.log("Converting".blue);
    }

    let vm = new VirtualMachine();
    vm.setCompatibilityMode(true);
    vm.clear();
    
    let loaded = vm.loadProject(sb2);
    loaded.then(() => {
        res.json(vm.toJSON());
    }).catch(() => {
        console.log("Trouble".red);
        res.json(false);
    });
};

let app = express();
app.use(express.json());

app.post("/convert", function(req, res){
    convert(req.body, {"verbose": true}, res);
});

// Listen on port
app.listen(PORT);
console.log("Now listening on port", PORT + ".");
console.log("Hit CTRL-C to exit server application.");
