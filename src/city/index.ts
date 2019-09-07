import { harvesterSpawner } from './spawner'
import { harvester } from './roles/harvester'

export const city = (spawn: Spawn) => {
  harvesterSpawner(spawn)

  const creeps = spawn.room.find<Creep>(FIND_MY_CREEPS, {
    filter: (creep: Creep) => creep.memory.role === 'harvester'
  })

  for (const creep of Object.values(creeps)) {
    harvester(creep, spawn)
  }
}
