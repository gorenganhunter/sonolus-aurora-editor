import type { TimeScaleObject } from '../../chart'
import { addToOrdered, removeFromOrdered } from '../../utils/ordered'
import { toTimeScaleEntity, type TimeScaleEntity } from '../entities/timeScale'
import { toTimeScaleIntegral } from '../integrals/timeScales'
import { addToStoreGrid, removeFromStoreGrid } from '../store/grid'
import type { Transaction } from '../transaction'

export const addTimeScale = ({ store, timeScales, addToGroup }: Transaction, object: TimeScaleObject) => {
    const entity = toTimeScaleEntity(object)
    addToOrdered(timeScales.get(object.group)!, 'beat', toTimeScaleIntegral(object))
    addToStoreGrid(store.grid, entity, entity.beat)
    addToGroup(object.group)

    return [entity]
}

export const removeTimeScale = ({ store, timeScales }: Transaction, entity: TimeScaleEntity) => {
    removeFromOrdered(timeScales.get(entity.group)!, 'beat', entity.beat)

    removeFromStoreGrid(store.grid, entity, entity.beat)
}
