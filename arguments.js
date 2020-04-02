const commandLineUsage = require("command-line-usage");

// CL args
module.exports.optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean }, // Whether we're verbose
    { name: "help", alias: "h", type: Boolean }, // A cry for help and documentation
    { name: "unified", alias: "u", type: Boolean }, // If we should replicate the directory structure
    { name: "src", type: String, multiple: true, defaultOption: true }, // List of source directories and files  
    { name: "dest", alias: "d", type: String } // The output root directory
];

// Help documentation
module.exports.usage = commandLineUsage([
    {
        header: "scratch-convert",
        content: "Converts Scratch 2 to Scratch 3 JSON representations."
    },
    {
        header: "Options",
        optionList: [
            {
                name: "verbose",
                description: "Verbose messaging.",
                alias: "v",
                type: Boolean
            },
            {
                name: "help",
                description: "Display this usage guide.",
                alias: "h",
                type: Boolean
            },
            {
                name: "src",
                description: "List of directories and files to convert from SB2 to SB3. Directories will always be followed recursively.",
                type: String,
                multiple: true,
                defaultOption: true,
                typeLabel: "{underline file} ..."
            },
            {
                name: "unified",
                description: "Whether to save SB3 projects to a single unified directory. If not set, replicates original directory structure under the output root.",
                alias: "u",
                type: Boolean
            },
            {
                name: "dest",
                description: "Destination root directory for output files.",
                alias: "d",
                type: String
            }
        ]
    },
    {
        content: "Project home: {underline https://github.com/GSE-CCL/scratch-convert}"
    }
]);