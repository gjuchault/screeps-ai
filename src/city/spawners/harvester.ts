import { maximumCreepsPerSource } from "city/sources/maximumCreepsPerSource"

const workBodies = Array(1).fill(WORK) as (typeof WORK)[]
const carryBodies = Array(1).fill(CARRY) as (typeof CARRY)[]
const moveBodies = Array(1).fill(MOVE) as (typeof MOVE)[]

const shouldSpawn = (spawn: Spawn) => {
  const hasEnoughEnergy = spawn.energy >= 200
  let sourcesMaxEnergyPerTick = 0
  let sourcesMaximumHarvesters = 0

  const roomSources = spawn.room.find<Source>(FIND_SOURCES)

  for (const source of Object.values(roomSources)) {
    sourcesMaxEnergyPerTick += source.energyCapacity / ENERGY_REGEN_TIME
    sourcesMaximumHarvesters += maximumCreepsPerSource(source)
  }

  const spawnHarvestMaxEnergyPerTick = spawn.memory.harvesterCapacityPerTick || 0;
  const spawnHarvestNumber = spawn.memory.harvesterIndex || 0;

  // we have enough energy to build it
  // and we don't harvest more than the source can restore
  return hasEnoughEnergy &&
    sourcesMaxEnergyPerTick > spawnHarvestMaxEnergyPerTick &&
    sourcesMaximumHarvesters > spawnHarvestNumber
}

export const harvester = (spawn: Spawn) => {
  if (shouldSpawn(spawn)) {
    const harvesterIndex = spawn.memory.harvesterIndex || 0

    const err = spawn.spawnCreep(
      [ ...workBodies, ...carryBodies, ...moveBodies ],
      `screeps-ai/${spawn.name}/harvester/${harvesterIndex}`,
      { memory: { role: 'harvester', spawn }}
    )

    if (!err) {
      spawn.memory.harvesterIndex = harvesterIndex + 1
      spawn.memory.harvesterCapacityPerTick = (spawn.memory.harvesterCapacityPerTick || 0) + HARVEST_POWER * workBodies.length;
    } else {
      console.log('Can not spawn harvester: ', err)
    }
  }
}
