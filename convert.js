const colors = require('colors');
const commandLineArgs = require("command-line-args");
const fs = require("fs");
const path = require("path");
const VirtualMachine = require("scratch-vm");

const args = require("./arguments");

/* Represents success rate */
var success = {
    rounds: 0,
    success: 0,
    total: 0
}

/* Converts an individual project from SB2 to SB3 */
let convert = function(input_path, output_path, options) {
    if (options["verbose"]) {
        console.log("Converting".blue, input_path);
    }

    success.total += 1;

    let vm = new VirtualMachine();
    vm.setCompatibilityMode(true);
    vm.clear();
    
    let proj = fs.readFileSync(input_path);
    let loaded = vm.loadProject(proj);
    loaded.then(() => {
        fs.writeFileSync(output_path, vm.toJSON());
        success.success += 1;
        success.rounds += 1;

        if (success.rounds == success.total) {
            console.log("\nSuccessfully converted", success.success,
                        "out of", success.total,
                        "for success rate of", (success.success / success.total),
                        "\n"
                       );
            process.nextTick(process.exit);
        }
    }).catch(() => {
        console.log("Trouble with".red, input_path);
        success.rounds += 1;
        if (success.rounds == success.total) {
            console.log("\nSuccessfully converted", success.success,
                        "out of", success.total,
                        "for success rate of", (success.success / success.total),
                        "\n"
                       );
            process.nextTick(process.exit);
        }
    });
};

/* Loops through a directory */
let convertDirectory = function(input_path, output_root, options) {
    // Determine current input path
    input_path = path.normalize(input_path);
    if (!path.isAbsolute(input_path)) {
        input_path = path.join(process.cwd(), input_path);
    }
    if (options["verbose"]) {
        console.log("Working on ".yellow, input_path);
    }

    // Do something different for each file
    let files = fs.readdirSync(input_path);
    files.forEach((file) => {
        let file_path = path.join(input_path, file);
        let file_out_path = output_root;
        if (!fs.existsSync(output_root)) {
            fs.mkdirSync(output_root);
        }

        if (fs.lstatSync(file_path).isDirectory()) {
            if (typeof options["unified"] == "undefined") {
                file_out_path = path.join(output_root, file);
            }
            convertDirectory(file_path, file_out_path, options);
        }
        else if (file.indexOf(".json") > -1) {
            file_out_path = path.join(file_out_path, file);
            convert(file_path, file_out_path, options);
            
        }
    });
};

/* Main function */
let main = function() {
    const options = commandLineArgs(args.optionDefinitions);

    // Display help screen as needed
    if (options["help"]) {
        console.log(args.usage);
    }
    else if (typeof options["src"] != "undefined")
    {
        // Set up output root
        let output_root = process.cwd();
        if (typeof options["dest"] != "undefined") {
            if (path.isAbsolute(options["dest"])) {
                output_root = options["dest"];
            }
            else {
                output_root = path.join(output_root, options["dest"]);
            }
        }

        if (!fs.existsSync(output_root)) {
            fs.mkdirSync(output_root);
        }

        if (options["verbose"]) {
            console.log("Saving to ".green, output_root);
        }

        // Loop through sources
        options["src"].forEach(src => {
            input_path = path.normalize(src);
            if (!path.isAbsolute(input_path)) {
                input_path = path.join(process.cwd(), input_path);
            }

            if (fs.lstatSync(input_path).isDirectory()) {
                convertDirectory(input_path, output_root, options);
            }
            else if (input_path.indexOf(".json") > -1) {
                file_out_path = path.join(output_root, path.basename(src));
                console.log(file_out_path)
                convert(input_path, file_out_path, options);
            }
            
        });
    }
    else
    {
        console.log(args.usage);
    }
};

if (require.main === module) {
    main();
}