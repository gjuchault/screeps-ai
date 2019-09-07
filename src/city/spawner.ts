export const harvesterSpawner = (spawn: Spawn) => {
  if (spawn.energy >= 200) {
    const harvesterIndex = spawn.memory.harvesterIndex || 1

    const err = spawn.spawnCreep(
      [ WORK, CARRY, MOVE ],
      `screeps-ai/${spawn.name}/harvester/${harvesterIndex}`,
      { memory: { role: 'harvester' }}
    )

    spawn.memory.harvesterIndex = harvesterIndex + 1

    console.log(err)
  }
}
