'use strict'
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const inputFileNames = ['a.txt', 'b.txt', 'c.txt', 'd.txt', 'e.txt', 'f.txt']
const readFileAndComputeAlgoritm = (filename) => {
    var filestream = fs.createReadStream(path.join(__dirname, 'input', filename));
    const rl = readline.createInterface(filestream)
   
    rl.on('line', (line) => {
        console.log(line)
    });

    const computeAlgoritm = () => {
        fs.writeFileSync(path.join(__dirname, 'output', filename), 'pippo')
    }

    rl.on('close', () => {
        computeAlgoritm()
    })
}

inputFileNames.forEach(filename => {
    readFileAndComputeAlgoritm(filename)
})