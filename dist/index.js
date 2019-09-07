'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const harvesterSpawner = (spawn) => {
    if (spawn.energy >= 200) {
        const harvesterIndex = spawn.memory.harvesterIndex || 1;
        const err = spawn.spawnCreep([WORK, CARRY, MOVE], `screeps-ai/${spawn.name}/harvester/${harvesterIndex}`, { memory: { role: 'harvester' } });
        spawn.memory.harvesterIndex = harvesterIndex + 1;
        console.log(err);
    }
};

const harvester = (creep, spawn) => {
    if (typeof creep.carry.energy === 'undefined') {
        return;
    }
    if (creep.carry.energy < creep.carryCapacity) {
        creep.say(`spawn=${spawn.name} creep=${creep.name} --> harvest`);
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
    harvesterSpawner(spawn);
    const creeps = spawn.room.find(FIND_MY_CREEPS, {
        filter: (creep) => creep.memory.role === 'harvester'
    });
    for (const creep of Object.values(creeps)) {
        harvester(creep, spawn);
    }
};

const loop = () => {
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
