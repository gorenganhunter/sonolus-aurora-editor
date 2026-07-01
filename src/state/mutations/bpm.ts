import type { AddMutation, RemoveMutation } from '.'
import type { BpmObject } from '../../chart/bpm'
import type { NoteObject } from '../../chart/note'
import type { TimeScaleObject } from '../../chart/timeScale'
import type { WaypointObject } from '../../chart/waypoint'
import { view } from '../../editor/view'
import { state } from '../../history'
import { bpms } from '../../history/bpms'
import { addToOrdered, removeFromOrdered } from '../../utils/ordered'
import type { Entity } from '../entities'
import { toBpmEntity, type BpmEntity } from '../entities/bpm'
import type { NoteEntity } from '../entities/slides/note'
import type { TimeScaleEntity } from '../entities/timeScale'
import type { WaypointEntity } from '../entities/waypoint'
import { beatToTime, timeToBeat, toBpmIntegral } from '../integrals/bpms'
import { addToStoreGrid, getInStoreGrid, removeFromStoreGrid } from '../store/grid'
import type { Transaction } from '../transaction'
import { replaceNote } from './slides/note'
import { addTimeScale, removeTimeScale } from './timeScale'
import { addWaypoint, removeWaypoint } from './waypoint'

export const addBpm: AddMutation<BpmObject> = (transaction, object) => {
    const { bpms, store } = transaction

    if (view.keepTiming === 'time' && bpms.length > 0) saveTiming(transaction)

    addToOrdered(bpms, 'x', toBpmIntegral(object))

    const entity = toBpmEntity(object)
    addToStoreGrid(store.grid, entity, entity.beat)

    if (view.keepTiming === 'time') refreshTiming(transaction)

    return [entity]
}

export const removeBpm: RemoveMutation<BpmEntity> = (transaction, entity) => {
    const { bpms, store } = transaction

    if (view.keepTiming === 'time') saveTiming(transaction)

    removeFromOrdered(bpms, 'x', entity.beat)

    removeFromStoreGrid(store.grid, entity, entity.beat)

    if (view.keepTiming === 'time' && bpms.length > 0) refreshTiming(transaction)
}

const saveTiming = ({ bpms, store }: Transaction) => {
    for (const map of [store.grid.note, store.grid.timeScale, store.grid.waypoint]) {
        for (const entities of map.values()) {
            entities.forEach(entity => {
                entity.realTimeCache = beatToTime(bpms, entity.beat)
            })
        }
    }
}

const refreshTiming = (transaction: Transaction) => {
    const { bpms, store } = transaction
    for (const map of [store.grid.note, store.grid.timeScale, store.grid.waypoint]) {
        for (const entities of map.values()) {
            entities.forEach(entity => {
                if (entity.realTimeCache === undefined) return
                
                moves[entity.type]?.(transaction, entity as never, timeToBeat(bpms, entity.realTimeCache))
                entity.realTimeCache = undefined
            })
        }
    }
}
const toMovedTimeScaleObject = (entity: TimeScaleEntity, beat: number): TimeScaleObject => ({
    ...entity,
    beat,
    timeScale: entity.timeScale,
    // skip: entity.skip,
    // ease: entity.ease,
    // hideNotes: entity.hideNotes,
})

const toMovedWaypointObject = (entity: WaypointEntity, beat: number): WaypointObject => ({
    beat,
    name: entity.name,
})

const toMovedNoteObject = (
    entity: NoteEntity,
    beat: number,
): NoteObject => {
    return {
        ...entity,
        beat
    }
}

type Move<T extends Entity> = (
    transaction: Transaction,
    entity: T,
    beat: number,
) => Entity[] | undefined

const moves: {
    [T in Entity as T['type']]: Move<T> | undefined
} = {
    bpm: undefined,
    timeScale: (transaction, entity, beat) => {
        const object = toMovedTimeScaleObject(entity, beat)

        if (entity.beat) removeTimeScale(transaction, entity)

        const overlap = getInStoreGrid(transaction.store.grid, 'timeScale', object.beat)?.find(
            (entity) => entity.beat === object.beat && entity.groupId === object.groupId,
        )
        if (overlap) removeTimeScale(transaction, overlap)

        return addTimeScale(transaction, object)
    },

    note: (transaction, entity, beat) => {
        const object = toMovedNoteObject(entity, beat)

        return replaceNote(transaction, entity, object)
    },

    waypoint: (transaction, entity, beat) => {
        const object = toMovedWaypointObject(entity, beat)

        removeWaypoint(transaction, entity)

        const overlap = getInStoreGrid(transaction.store.grid, 'waypoint', object.beat)?.find(
            (entity) => entity.beat === object.beat,
        )
        if (overlap) removeWaypoint(transaction, overlap)

        return addWaypoint(transaction, object)
    },

    connector: undefined,
}
