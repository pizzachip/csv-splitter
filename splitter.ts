import { params } from './input_params'

const file_to_split: string = params.origin_file_pathname
const fs = require('fs')
const readline = require('readline')
function setRl() { return readline.createInterface({
    input: fs.createReadStream(file_to_split),
    crlfDelay: Infinity  
  })
}

let file_length: number = 0
let file_header: string = ""
let write_file_name: string = ""

function splitFile() {
  let line_count:number = 0 
  let file_count:number = 1
  write_file_name = params.origin_file_pathname.concat("-split-",file_count.toString())

  setRl().on('line', (line: string) => {
    //console.log(line)
    let new_file_time:boolean =  ( (line_count-(params.preserve_headers ? 1 : 0) )%params.split_into_number === 0 ) && ( line_count > 1 )

    if (new_file_time) 
        { 
          file_count += 1
          write_file_name = params.origin_file_pathname.concat("-split-",file_count.toString())
          fs.appendFileSync(write_file_name, file_header.concat('\n'), 'utf8')
        }

     fs.appendFileSync(write_file_name, line, 'utf8')
     line_count += 1
    })
    .on('close', ()=> console.log('closed'))
  }

fs.access(file_to_split, (err: any)=> {
  console.log( err ? 'file not available' : 'file ready to go')
})

setRl().on('line', (line: string) => {

    file_length += 1;
    if (file_length === 1) { file_header = line }

  })
  .on('close', ()=> {
    splitFile()  
  })


