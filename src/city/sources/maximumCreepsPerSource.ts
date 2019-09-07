export const maximumCreepsPerSource = (source: Source) => {
  const { pos, room } = source

  const terrain = new (Room as any).Terrain(room.name) as any

  let max = 0

  if (terrain.get(pos.x - 1, pos.y -1) !== TERRAIN_MASK_WALL) max += 1
  if (terrain.get(pos.x - 1, pos.y) !== TERRAIN_MASK_WALL) max += 1
  if (terrain.get(pos.x - 1, pos.y + 1) !== TERRAIN_MASK_WALL) max += 1
  if (terrain.get(pos.x, pos.y - 1) !== TERRAIN_MASK_WALL) max += 1
  if (terrain.get(pos.x, pos.y + 1) !== TERRAIN_MASK_WALL) max += 1
  if (terrain.get(pos.x + 1, pos.y - 1) !== TERRAIN_MASK_WALL) max += 1
  if (terrain.get(pos.x + 1, pos.y) !== TERRAIN_MASK_WALL) max += 1
  if (terrain.get(pos.x + 1, pos.y + 1) !== TERRAIN_MASK_WALL) max += 1

  return max
}
