
'use strict'


const getSingleRowCapacity = (row, servers, pool) => {
  let serverVisited = {}
  let capacity = 0
  row.forEach(slot => {
    if (serverVisited && serverVisited.id === slot) {
      return
    }
    serverVisited = servers.find(server => {
      const bool = server.id === slot && server.pool === pool
      return bool
    })
    if (!serverVisited) { return }
    capacity += serverVisited.capacity
  })
  return capacity
}
const getAllRowsCapacity = (matrix, servers, pool) => {
  const totalCapacity = matrix.reduce((previousValue, row) => {
    const capacity = getSingleRowCapacity(row, servers, pool)
    return previousValue + capacity
  }, 0)
  return totalCapacity
}

const computeGcp = (matrix, servers, pool) => {
  let min = Infinity
  const aaa = getAllRowsCapacity(matrix, servers, pool)
  matrix.forEach(row => {
    const bbb = getSingleRowCapacity(row, servers, pool)
    const gc = aaa - bbb
    if (gc < min) {
      min = gc
    }
  })
  return min
}


module.exports = function getPoolToAssign(matrix, servers, pools, serverId) {
  let maximumMin = -1
  let poolToAssign
  let min = Infinity
  for (let pool = 0; pool < pools; pool++) {
    const server = servers.find(pippo => pippo.id === serverId)
    server.pool = pool
    for (let internalPool = 0; internalPool < pools; internalPool++) {
      const gcp = computeGcp(matrix, servers, internalPool)
      if (gcp < min) {
        min = gcp
      }
    }
    if (min > maximumMin) {
      maximumMin = min
      poolToAssign = pool
    }
  }
  return poolToAssign
}
