import type { Tool } from '..'
import type { WaypointObject } from '../../../chart'
import { pushState, replaceState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { store } from '../../../history/store'
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import type { Entity } from '../../../state/entities'
import { toWaypointEntity, type WaypointEntity } from '../../../state/entities/waypoint'
import { addWaypoint, removeWaypoint } from '../../../state/mutations/waypoint'
import { getInStoreGrid } from '../../../state/store/grid'
import { createTransaction, type Transaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { notify } from '../../notification'
import { isSidebarVisible } from '../../sidebars'
import { focusViewAtBeat, setViewHover, snapYToBeat, view, yToValidBeat } from '../../view'
import { hitEntitiesAtPoint } from '../utils'
import WaypointPropertiesModal from './WaypointPropertiesModal.vue'

let active:
    | {
        type: 'add'
    }
    | {
        type: 'move'
        entity: WaypointEntity
    }
    | undefined

export const waypoint: Tool = {
    title: () => i18n.value.tools.waypoint.title,

    hover(x, y) {
        const [entity, beat] = tryFind(x, y)
        if (entity) {
            view.entities = {
                hovered: [entity],
                creating: [],
            }
        } else {
            view.entities = {
                hovered: [],
                creating: [
                    toWaypointEntity({
                        beat,
                        name: "Waypoint",
                    }),
                ],
            }
        }
    },

    tap(x, y, modifiers) {
        const [entity, beat] = tryFind(x, y)
        if (entity) {
            if (modifiers.ctrl) {
                const selectedWaypointEntities: Entity[] = selectedEntities.value.filter(
                    (entity) => entity.type === 'waypoint',
                )

                const targets = selectedWaypointEntities.includes(entity)
                    ? selectedWaypointEntities.filter((e) => e !== entity)
                    : [...selectedWaypointEntities, entity]

                replaceState({
                    ...state.value,
                    selectedEntities: targets,
                })
                view.entities = {
                    hovered: [],
                    creating: [],
                }
                focusViewAtBeat(entity.beat)

                notify(interpolate(() => i18n.value.tools.waypoint.selected, `${targets.length}`))
            } else {
                if (selectedEntities.value.includes(entity)) {
                    focusViewAtBeat(entity.beat)

                    if (!isSidebarVisible.value) {
                        void showModal(WaypointPropertiesModal, {})
                    }
                } else {
                    replaceState({
                        ...state.value,
                        selectedEntities: [entity],
                    })
                    view.entities = {
                        hovered: [],
                        creating: [],
                    }
                    focusViewAtBeat(entity.beat)

                    notify(interpolate(() => i18n.value.tools.waypoint.selected, '1'))
                }
            }
        } else {
            const object: WaypointObject = {
                beat,
                name: "",
            }

            const overlap = find(object.beat)
            if (overlap) {
                edit(overlap, object)
            } else {
                add(object)
            }
            focusViewAtBeat(object.beat)

            void showModal(WaypointPropertiesModal, {})
        }
    },

    dragStart(x, y) {
        const [entity, beat] = tryFind(x, y)
        if (entity) {
            replaceState({
                ...state.value,
                selectedEntities: [entity],
            })
            view.entities = {
                hovered: [],
                creating: [],
            }
            focusViewAtBeat(entity.beat)

            notify(interpolate(() => i18n.value.tools.waypoint.moving, '1'))

            active = {
                type: 'move',
                entity,
            }
        } else {
            focusViewAtBeat(beat)

            notify(interpolate(() => i18n.value.tools.waypoint.adding, '1'))

            active = {
                type: 'add',
            }
        }

        return true
    },

    dragUpdate(x, y) {
        if (!active) return

        setViewHover(y)

        switch (active.type) {
            case 'add': {
                const [entity, beat] = tryFind(x, y)
                if (entity) {
                    view.entities = {
                        hovered: [entity],
                        creating: [],
                    }
                    focusViewAtBeat(entity.beat)
                } else {
                    view.entities = {
                        hovered: [],
                        creating: [
                            toWaypointEntity({
                                beat,
                                name: "",
                            }),
                        ],
                    }
                    focusViewAtBeat(beat)
                }
                break
            }
            case 'move': {
                const beat = snapYToBeat(y, active.entity.beat)

                view.entities = {
                    hovered: [],
                    creating: [
                        toWaypointEntity({
                            beat,
                            name: active.entity.name,
                        }),
                    ],
                }
                focusViewAtBeat(beat)
                break
            }
        }
    },

    dragEnd(x, y) {
        if (!active) return

        switch (active.type) {
            case 'add': {
                const [entity, beat] = tryFind(x, y)
                if (entity) {
                    replaceState({
                        ...state.value,
                        selectedEntities: [entity],
                    })
                    view.entities = {
                        hovered: [],
                        creating: [],
                    }
                    focusViewAtBeat(entity.beat)

                    void showModal(WaypointPropertiesModal, {})
                } else {
                    const object: WaypointObject = {
                        beat,
                        name: "",
                    }

                    const overlap = find(object.beat)
                    if (overlap) {
                        edit(overlap, object)
                    } else {
                        add(object)
                    }
                    focusViewAtBeat(object.beat)

                    void showModal(WaypointPropertiesModal, {})
                }
                break
            }
            case 'move': {
                const beat = snapYToBeat(y, active.entity.beat)

                editMoveOrReplace(active.entity, {
                    beat,
                    name: active.entity.name,
                })
                focusViewAtBeat(beat)
                break
            }
        }

        active = undefined
    },
}

export const editWaypoint = (entity: WaypointEntity, object: Partial<WaypointObject>) => {
    editMoveOrReplace(entity, {
        beat: object.beat ?? entity.beat,
        name: object.name ?? entity.name,
    })
}

export const editSelectedWaypoint = (
    transaction: Transaction,
    entity: WaypointEntity,
    object: Partial<WaypointObject>,
) => {
    removeWaypoint(transaction, entity)
    return addWaypoint(transaction, {
        beat: object.beat ?? entity.beat,
        name: object.name ?? entity.name,
    })
}

const find = (beat: number) =>
    getInStoreGrid(store.value.grid, 'waypoint', beat)?.find((entity) => entity.beat === beat)

const tryFind = (x: number, y: number): [WaypointEntity] | [undefined, number] => {
    const [hit] = hitEntitiesAtPoint('waypoint', x, y).sort(
        (a, b) => +selectedEntities.value.includes(b) - +selectedEntities.value.includes(a),
    )
    if (hit) return [hit]

    const beat = yToValidBeat(y)
    const nearest = find(beat)
    if (nearest) return [nearest]

    return [undefined, beat]
}

const editMoveOrReplace = (entity: WaypointEntity, object: WaypointObject) => {
    if (entity.beat === object.beat) {
        edit(entity, object)
        return
    }

    const overlap = find(object.beat)
    if (overlap) {
        replace(overlap, object, entity)
    } else {
        move(object, entity)
    }
    focusViewAtBeat(object.beat)
}

const update = (message: () => string, action: (transaction: Transaction) => Entity[]) => {
    const transaction = createTransaction(state.value)

    const selectedEntities = action(transaction)

    pushState(
        interpolate(message, `${selectedEntities.length}`),
        transaction.commit(selectedEntities),
    )
    view.entities = {
        hovered: [],
        creating: [],
    }

    notify(interpolate(message, `${selectedEntities.length}`))
}

const add = (object: WaypointObject) => {
    update(
        () => i18n.value.tools.waypoint.added,
        (transaction) => {
            return addWaypoint(transaction, object)
        },
    )
}

const edit = (entity: WaypointEntity, object: WaypointObject) => {
    update(
        () => i18n.value.tools.waypoint.edited,
        (transaction) => {
            removeWaypoint(transaction, entity)
            return addWaypoint(transaction, object)
        },
    )
}

const move = (object: WaypointObject, old: WaypointEntity) => {
    update(
        () => i18n.value.tools.waypoint.moved,
        (transaction) => {
            removeWaypoint(transaction, old)
            return addWaypoint(transaction, object)
        },
    )
}

const replace = (entity: WaypointEntity, object: WaypointObject, old: WaypointEntity) => {
    update(
        () => i18n.value.tools.waypoint.replaced,
        (transaction) => {
            removeWaypoint(transaction, old)
            removeWaypoint(transaction, entity)
            return addWaypoint(transaction, object)
        },
    )
}
