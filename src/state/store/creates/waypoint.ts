import type { Store } from '..'
import type { Chart } from '../../../chart'
import { toWaypointEntity } from '../../entities/waypoint'
import { addToStoreGrid } from '../grid'

export const createStoreWaypoints = (store: Store, chart: Chart) => {
    for (const object of chart.waypoints) {
        const entity = toWaypointEntity(object)

        addToStoreGrid(store.grid, entity, entity.beat)
    }
}
