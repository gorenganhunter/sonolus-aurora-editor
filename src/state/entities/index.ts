import type { BpmEntity } from './bpm'
import type { SlideEntity } from './slides'
import type { TimeScaleEntity } from './timeScale'
import type { WaypointEntity } from './waypoint'

export type EntityHitbox = {
    lane: number
    beat: number
    w: number
    h: number
}

export type BaseEntity = {
    hitbox?: EntityHitbox

    beat: number
}

export type Entity = BpmEntity | TimeScaleEntity | SlideEntity | WaypointEntity

export type EntityType = Entity['type']

export type EntityOfType<T extends EntityType> = Entity & { type: T }
