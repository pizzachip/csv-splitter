"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_params_1 = require("./input_params");
const file_to_split = input_params_1.params.origin_file_pathname.concat(input_params_1.params.file_suffix);
const fs = require('fs');
const readline = require('readline');
function setRl() {
    return readline.createInterface({
        input: fs.createReadStream(file_to_split),
        crlfDelay: Infinity
    });
}
let file_length = 0;
let file_header = "";
let write_file_name = "";
function transform(line) {
    // let new_line: string = line.replace(/$/g,"<br>")
    // new_line.concat("\n")
    let new_line = line;
    return new_line;
}
function splitFile() {
    let split_into_filesize = Math.round(file_length / input_params_1.params.split_into_number);
    let line_count = 0;
    let file_count = 1;
    write_file_name = input_params_1.params.origin_file_pathname.concat("-split-", file_count.toString(), input_params_1.params.file_suffix);
    setRl().on('line', (line) => {
        let write_line = transform(line);
        let new_file_time = (((line_count -
            (input_params_1.params.preserve_headers ? 1 : 0)) % split_into_filesize) === 0)
            && (line_count > 1);
        if (new_file_time) {
            console.log(file_length, " | ", split_into_filesize, " | ", line_count, " | ", new_file_time);
            file_count += 1;
            write_file_name = input_params_1.params.origin_file_pathname.concat("-split-", file_count.toString(), input_params_1.params.file_suffix);
            fs.appendFileSync(write_file_name, file_header, 'utf8');
        }
        fs.appendFileSync(write_file_name, write_line, 'utf8');
        line_count += 1;
    })
        .on('close', () => console.log('closed'));
}
console.log(file_to_split);
fs.access(file_to_split, (err) => {
    console.log(err ? 'file not available' : 'file ready to go');
});
setRl().on('line', (line) => {
    file_length += 1;
    if (file_length === 1) {
        file_header = line;
    }
})
    .on('close', () => {
    splitFile();
});
