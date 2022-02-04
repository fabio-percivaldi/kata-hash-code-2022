/* eslint-disable max-statements */
/* eslint-disable max-depth */
/* eslint-disable no-console */
'use strict'
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const inputFileNames = ['b']
let matrix = []

const addUnvailableSlot = (inputMatrix, rowNumber, slotNumber) => {
  inputMatrix[rowNumber][slotNumber] = -1
  return inputMatrix
}

const initMatrix = (rows, columns) => {
  const constructedMatrix = []
  for (let row = 0; row < rows; row++) {
    constructedMatrix.push([])
    for (let column = 0; column < columns; column++) {
      constructedMatrix[row].push(0)
    }
  }
  return constructedMatrix
}
const sortServers = (servers) => {
  return servers.sort((serverX, serverY) => {
    const scoreX = serverX.capacity / serverY.size
    const scoreY = serverY.capacity / serverY.size
    if (scoreX < scoreY) {
      return 1
    }
    if (scoreX > scoreY) {
      return -1
    }
    return 0
  })
}
const servers = []

const readFileAndComputeAlgoritm = (filename) => {
  const filestream = fs.createReadStream(path.join(__dirname, 'input', `${filename}.in`))
  const rl = readline.createInterface(filestream)

  let index = -1
  let rows, columns, numberOfUnavailableServer, numberOfPool, numberOfServer
  rl.on('line', (line) => {
    index += 1
    if (index === 0) {
      [rows, columns, numberOfUnavailableServer, numberOfPool, numberOfServer] = line.split(' ')
      matrix = initMatrix(rows, columns)
      return
    }

    if (index <= numberOfUnavailableServer) {
      const [rowNumber, slotNumber] = line.split(' ')
      addUnvailableSlot(matrix, rowNumber, slotNumber)
      return
    }

    if (index > numberOfUnavailableServer) {
      const [size, capacity] = line.split(' ')
      servers.push({ id: index, size: parseInt(size), capacity: parseInt(capacity), used: false, pool: null })
    }
  })
  const computeOutput = () => {
    const solution = []
    const serverSortedById = servers.sort((serverX, serverY) => {
      return serverX.id - serverY.id
    })
    serverSortedById.forEach(server => {
      if (!server.used) {
        solution.push('x')
      } else {
        solution.push(`${server.row} ${server.slot} ${server.pool}`)
      }
    })
    fs.writeFileSync(path.join(__dirname, 'output', `${filename}.out`), solution.join('\n'))
  }

  const computeAlgoritm = (composedMatrix, listOfServers, numberOfPools) => {
    let assignedPool = 0
    for (let serverIndex = 0; serverIndex < listOfServers.length; serverIndex++) {
      const { size, id: serverId, used } = servers[serverIndex]
      for (let row = 0; row < composedMatrix.length; row++) {
        let actualSize = 0
        for (let column = 0; column < composedMatrix[row].length; column++) {
          if (composedMatrix[row][column] !== 0 || column === composedMatrix[row].length) {
            actualSize = 0
            continue
          }
          if (composedMatrix[row][column] === 0) {
            actualSize += 1
            if (actualSize === size) {
              // se la quantità è uguale alla dimensione del server posso piazzarlo
              for (let toFill = 0; toFill < actualSize; toFill++) {
                if (!used) {
                  composedMatrix[row][column - toFill] = serverId
                }
              }
              servers[serverIndex].used = true
              servers[serverIndex].row = row
              servers[serverIndex].slot = column - (size - 1)
              servers[serverIndex].pool = assignedPool
              assignedPool += 1
              if (assignedPool >= numberOfPools) {
                assignedPool = 0
              }
              break
            }
          }
          if (servers[serverIndex].used) {
            break
          }
        }
        if (servers[serverIndex].used) {
          break
        }
      }
    }
  }

  rl.on('close', () => {
    sortServers(servers)
    computeAlgoritm(matrix, servers, numberOfPool)
    computeOutput()
  })
}

inputFileNames.forEach(filename => {
  readFileAndComputeAlgoritm(filename)
})
