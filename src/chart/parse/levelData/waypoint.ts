import { EngineArchetypeDataName, EngineArchetypeName, type LevelDataEntity } from '@sonolus/core'
import { getValue, type ParseToChart } from '.'
import { beatSchema } from './schemas'
import type { Chart } from '../..'

export type WaypointLevelDataEntity = LevelDataEntity & {
    wp_name?: string
}

export const parseWaypointsToChart = (chart: Chart, entities: LevelDataEntity[]) => {
    for (const entity of entities) {
        const wp = entity as WaypointLevelDataEntity

        if (entity.archetype !== "Waypoint" || !wp.wp_name) continue

        chart.waypoints.push({
            beat: getValue(entity, EngineArchetypeDataName.Beat, beatSchema),
            name: wp.wp_name,
        })
    }
}
