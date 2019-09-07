'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const maximumCreepsPerSource = (source) => {
    const { pos, room } = source;
    const terrain = new Room.Terrain(room.name);
    let max = 0;
    if (terrain.get(pos.x - 1, pos.y - 1) !== TERRAIN_MASK_WALL)
        max += 1;
    if (terrain.get(pos.x - 1, pos.y) !== TERRAIN_MASK_WALL)
        max += 1;
    if (terrain.get(pos.x - 1, pos.y + 1) !== TERRAIN_MASK_WALL)
        max += 1;
    if (terrain.get(pos.x, pos.y - 1) !== TERRAIN_MASK_WALL)
        max += 1;
    if (terrain.get(pos.x, pos.y + 1) !== TERRAIN_MASK_WALL)
        max += 1;
    if (terrain.get(pos.x + 1, pos.y - 1) !== TERRAIN_MASK_WALL)
        max += 1;
    if (terrain.get(pos.x + 1, pos.y) !== TERRAIN_MASK_WALL)
        max += 1;
    if (terrain.get(pos.x + 1, pos.y + 1) !== TERRAIN_MASK_WALL)
        max += 1;
    return max;
};
//# sourceMappingURL=maximumCreepsPerSource.js.map

const workBodies = Array(1).fill(WORK);
const carryBodies = Array(1).fill(CARRY);
const moveBodies = Array(1).fill(MOVE);
const shouldSpawn = (spawn) => {
    const hasEnoughEnergy = spawn.energy >= 200;
    let sourcesMaxEnergyPerTick = 0;
    let sourcesMaximumHarvesters = 0;
    const roomSources = spawn.room.find(FIND_SOURCES);
    for (const source of Object.values(roomSources)) {
        sourcesMaxEnergyPerTick += source.energyCapacity / ENERGY_REGEN_TIME;
        sourcesMaximumHarvesters += maximumCreepsPerSource(source);
    }
    const spawnHarvestMaxEnergyPerTick = spawn.memory.harvesterCapacityPerTick || 0;
    const spawnHarvestNumber = spawn.memory.harvesterIndex || 0;
    // we have enough energy to build it
    // and we don't harvest more than the source can restore
    return hasEnoughEnergy &&
        sourcesMaxEnergyPerTick > spawnHarvestMaxEnergyPerTick &&
        sourcesMaximumHarvesters > spawnHarvestNumber;
};
const harvester = (spawn) => {
    if (shouldSpawn(spawn)) {
        const harvesterIndex = spawn.memory.harvesterIndex || 0;
        const err = spawn.spawnCreep([...workBodies, ...carryBodies, ...moveBodies], `screeps-ai/${spawn.name}/harvester/${harvesterIndex}`, { memory: { role: 'harvester', spawn } });
        if (!err) {
            spawn.memory.harvesterIndex = harvesterIndex + 1;
            spawn.memory.harvesterCapacityPerTick = (spawn.memory.harvesterCapacityPerTick || 0) + HARVEST_POWER * workBodies.length;
        }
        else {
            console.log('Can not spawn harvester: ', err);
        }
    }
};

const spawners = (spawn) => {
    harvester(spawn);
};

const harvester$1 = (creep, spawn) => {
    if (typeof creep.carry.energy === 'undefined') {
        return;
    }
    if (creep.carry.energy < creep.carryCapacity) {
        creep.say(`harvest`);
        const sources = spawn.room.find(FIND_SOURCES);
        if (!sources[0]) {
            creep.suicide();
            return;
        }
        const err = creep.harvest(sources[0]);
        if (err === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {
                visualizePathStyle: {
                    stroke: '#ff0000'
                }
            });
        }
    }
    else {
        creep.say('bringback');
        const err = creep.transfer(spawn, RESOURCE_ENERGY);
        if (err === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn, {
                visualizePathStyle: {
                    stroke: '#ff0000'
                }
            });
        }
    }
};
//# sourceMappingURL=harvester.js.map

const city = (spawn) => {
    // TODO: initialize room (serialize paths, find sources, etc.)
    spawners(spawn);
    const creeps = spawn.room.find(FIND_MY_CREEPS);
    for (const creep of Object.values(creeps)) {
        if (creep.memory.role === 'harvester')
            harvester$1(creep, spawn);
    }
};
//# sourceMappingURL=index.js.map

const loop = () => {
    Memory.creeps = Memory.creeps || {};
    for (const creepName of Object.keys(Memory.creeps)) {
        if (!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
        }
    }
    for (const spawnName of Object.keys(Game.spawns)) {
        city(Game.spawns[spawnName]);
    }
};
//# sourceMappingURL=index.js.map

exports.loop = loop;
//# sourceMappingURL=index.js.map
