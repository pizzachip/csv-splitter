"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var input_params_1 = require("./input_params");
var file_to_split = input_params_1.params.origin_file_pathname;
var fs = require('fs');
var readline = require('readline');
function setRl() {
    return readline.createInterface({
        input: fs.createReadStream(file_to_split),
        crlfDelay: Infinity
    });
}
var file_length = 0;
var file_header = "";
var write_file_name = "";
function splitFile() {
    var line_count = 0;
    var file_count = 1;
    write_file_name = input_params_1.params.origin_file_pathname.concat("-split-", file_count.toString());
    setRl().on('line', function (line) {
        console.log(line);
        var new_file_time = ((line_count - (input_params_1.params.preserve_headers ? 1 : 0)) % input_params_1.params.split_into_number === 0) && (line_count > 1);
        if (new_file_time) {
            file_count += 1;
            write_file_name = input_params_1.params.origin_file_pathname.concat("-split-", file_count.toString());
            fs.appendFileSync(write_file_name, file_header.concat('\n'), 'utf8');
        }
        fs.appendFileSync(write_file_name, line, 'utf8');
        line_count += 1;
    })
        .on('close', function () { return console.log('closed'); });
}
fs.access(file_to_split, function (err) {
    console.log(err ? 'file not available' : 'file ready to go');
});
setRl().on('line', function (line) {
    file_length += 1;
    if (file_length === 1) {
        file_header = line;
    }
})
    .on('close', function () {
    splitFile();
});
