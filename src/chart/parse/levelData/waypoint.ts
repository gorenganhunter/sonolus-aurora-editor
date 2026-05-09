import { EngineArchetypeDataName, EngineArchetypeName, type LevelDataEntity } from '@sonolus/core'
import { getValue, type ParseToChart } from '.'
import { beatSchema } from './schemas'
import type { Chart } from '../..'

export type WaypointLevelDataEntity = LevelDataEntity & {
    wp_name?: string
    waypoint_name?: string
    tick?: number
}

export const parseWaypointsToChart = (chart: Chart, entities: LevelDataEntity[]) => {
    for (const entity of entities) {
        if (entity.archetype !== "Waypoint") continue

        const wp = entity as WaypointLevelDataEntity

        chart.waypoints.push({
            beat: wp.tick !== undefined ? (wp.tick / 480) : getValue(entity, EngineArchetypeDataName.Beat, beatSchema),
            name: wp.waypoint_name ?? wp.wp_name!,
        })
    }
}
