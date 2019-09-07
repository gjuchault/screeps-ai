import { city } from './city/index'

export const loop = () => {
  Memory.creeps = Memory.creeps || {}

  for (const creepName of Object.keys(Memory.creeps)) {
    if (!Game.creeps[creepName]) {
      delete Memory.creeps[creepName]
    }
  }

  for (const spawnName of Object.keys(Game.spawns)) {
    city(Game.spawns[spawnName])
  }
}
