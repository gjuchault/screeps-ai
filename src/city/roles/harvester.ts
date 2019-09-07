export const harvester = (creep: Creep, spawn: Spawn) => {
  if (typeof creep.carry.energy === 'undefined') {
    return
  }

  if (creep.carry.energy < creep.carryCapacity) {
    creep.say(`harvest`)
    const sources = spawn.room.find<Source>(FIND_SOURCES)

    if (!sources[0]) {
      creep.suicide()
      return
    }

    const err = creep.harvest(sources[0])

    if (err === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], {
        visualizePathStyle: {
          stroke: '#ff0000'
        }
      })
    }
  } else {
    creep.say('bringback')
    const err = creep.transfer(spawn, RESOURCE_ENERGY);

    if (err === ERR_NOT_IN_RANGE) {
      creep.moveTo(spawn, {
        visualizePathStyle: {
          stroke: '#ff0000'
        }
      })
    }
  }
}
