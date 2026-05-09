import { EngineArchetypeDataName, EngineArchetypeName, type LevelDataEntity } from '@sonolus/core'
import type { WaypointLevelDataEntity } from '../../../chart/parse/levelData/waypoint'
import { getStoreEntities } from '.'
import type { Store } from '../../../state/store'

export const serializeWaypointsToLevelDataEntities = (store: Store) =>
    [...getStoreEntities(store.grid.waypoint)].map(
        (wp): WaypointLevelDataEntity => ({
            archetype: "Waypoint",
            data: [],
            tick: wp.beat * 480,
            waypoint_name: wp.name
        }),
    )
