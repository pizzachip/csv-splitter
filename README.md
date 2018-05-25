# CSV file splitter

The purpose of this little node utility is to take a big ass csv file
and split it into x number of little csv files.

The inputs will be 
* the name/path of the input file
* A yes/no if you want to keep the first line as headers
* the number of files to split it into

The system will then produce a set of files of relatively equal length each with the original file name
but followed by a _[number] suffix
