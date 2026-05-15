import { addToOrdered, removeFromOrdered } from '../../utils/ordered'
import type { AddMutation, RemoveMutation } from '.'
import type { TimeScaleObject } from '../../chart/timeScale'
import { toTimeScaleEntity, type TimeScaleEntity } from '../entities/timeScale'
import { toTimeScaleIntegral } from '../integrals/timeScales'
import { addToStoreGrid, removeFromStoreGrid } from '../store/grid'

export const addTimeScale: AddMutation<TimeScaleObject> = ({ store, timeScales, addToGroup }, object) => {
    const entity = toTimeScaleEntity(object)
    addToOrdered(timeScales.get(object.groupId)!, 'beat', toTimeScaleIntegral(object))
    addToStoreGrid(store.grid, entity, entity.beat)
    addToGroup(object.groupId)

    return [entity]
}

export const removeTimeScale: RemoveMutation<TimeScaleEntity> = ({ store, timeScales }, entity) => {
    removeFromOrdered(timeScales.get(entity.groupId)!, 'beat', entity.beat)
    removeFromStoreGrid(store.grid, entity, entity.beat)
}
