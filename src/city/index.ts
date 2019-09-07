import { spawners } from './spawners/index'
import { harvester } from './roles/harvester'

export const city = (spawn: Spawn) => {
  // TODO: initialize room (serialize paths, find sources, etc.)

  spawners(spawn)

  const creeps = spawn.room.find<Creep>(FIND_MY_CREEPS)

  for (const creep of Object.values(creeps)) {
    if (creep.memory.role === 'harvester') harvester(creep, spawn)
  }
}
