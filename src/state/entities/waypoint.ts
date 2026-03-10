import { type BaseEntity } from '.'
import type { WaypointObject } from '../../chart'

export type WaypointEntity = BaseEntity & {
    type: 'waypoint'
    name: string
}

export const toWaypointEntity = (object: WaypointObject): WaypointEntity => ({
    type: 'waypoint',
    hitbox: {
        lane: 7,
        beat: object.beat,
        w: 1,
        h: 0.4,
    },

    beat: object.beat,
    name: object.name,
})
