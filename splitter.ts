import { params } from './input_params'

const file_to_split: string = params.origin_file_pathname.concat(params.file_suffix)
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

function transform(line:string) {
  // let new_line: string = line.replace(/$/g,"<br>")
  // new_line.concat("\n")
  let new_line = line
  return new_line
}

function splitFile() {
  let split_into_filesize: number = Math.round(file_length / params.split_into_number)
  let line_count:number = 0 
  let file_count:number = 1
  write_file_name = params.origin_file_pathname.concat("-split-",file_count.toString(),params.file_suffix)

  setRl().on('line', (line: string) => {
    let write_line:string = transform(line)
    let new_file_time:boolean =  
      ( 
        ( 
          (line_count-
            (params.preserve_headers ? 1 : 0) 
          ) % split_into_filesize 
        ) === 0 
      ) 
      && ( line_count > 1 )

    if (new_file_time) 
        {
          console.log(file_length," | ",
            split_into_filesize," | ",
            line_count," | ",
            new_file_time)

          file_count += 1
          write_file_name = params.origin_file_pathname.concat("-split-",file_count.toString(),params.file_suffix)
          fs.appendFileSync(write_file_name, file_header, 'utf8')
        }
     fs.appendFileSync(write_file_name, write_line, 'utf8')
     line_count += 1
    })
    .on('close', ()=> console.log('closed'))
  }

console.log(file_to_split)
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


