'use strict'
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const inputFileNames = ['a.in', 'b.in']
const readFileAndComputeAlgoritm = (filename) => {
  const filestream = fs.createReadStream(path.join(__dirname, 'input', filename))
  const rl = readline.createInterface(filestream)

  rl.on('line', (line) => {
    console.log(line)
  })

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
