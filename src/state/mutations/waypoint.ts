import type { WaypointObject } from '../../chart'
import { addToOrdered, removeFromOrdered } from '../../utils/ordered'
import { toWaypointEntity, type WaypointEntity } from '../entities/waypoint'
import { addToStoreGrid, removeFromStoreGrid } from '../store/grid'
import type { Transaction } from '../transaction'

export const addWaypoint = ({ store }: Transaction, object: WaypointObject) => {
    const entity = toWaypointEntity(object)
    addToStoreGrid(store.grid, entity, entity.beat)

    return [entity]
}

export const removeWaypoint = ({ store }: Transaction, entity: WaypointEntity) => {
    removeFromStoreGrid(store.grid, entity, entity.beat)
}
