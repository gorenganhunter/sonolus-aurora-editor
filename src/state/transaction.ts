import type { State } from '.'
import { addToGroups, type GroupId, type Groups } from '../chart/groups'
import { settings } from '../settings'
import type { Entity } from './entities'
import type { SlideId } from './entities/slides'
import { toTimeScaleEntity } from './entities/timeScale'
import { calculateBpms, type BpmIntegral } from './integrals/bpms'
import { calculateTimeScales, type TimeScaleIntegral } from './integrals/timeScales'
import { rebuildSlide } from './mutations/slides'
import { addToStoreGrid } from './store/grid'

export type Transaction = ReturnType<typeof createTransaction>

export const createTransaction = (state: State) => {
    const grid = createMapObjectTransaction(state.store.grid)
    const slides = createMapObjectTransaction(state.store.slides)
    const dirtySlideIds = new Set<SlideId>()

    let lastGroup: GroupId | undefined
    let groups: Groups | undefined

    let bpms: BpmIntegral[] | undefined
    let timeScales: Map<GroupId, TimeScaleIntegral[]> | undefined

    return {
        store: {
            grid: grid.accessor,
            slides: slides.accessor,

            markDirty(slideId: SlideId) {
                dirtySlideIds.add(slideId)
            },
        },

        addToGroup: (groupId: GroupId) => {
            if (!settings.autoAddGroup) return

            lastGroup ??= [...state.groups.keys()].at(-1)
            if (groupId !== lastGroup) return

            groups = new Map(state.groups)
            addToGroups(groups)
        },

        get groups() {
            return (groups ??= structuredClone(state.groups))
        },

        get bpms() {
            return (bpms ??= [...state.bpms])
        },
        get timeScales() {
            return (timeScales ??= structuredClone(state.timeScales))
        },

        commit(selectedEntities: Entity[]): State {
            if (bpms) bpms = calculateBpms(bpms)
            if (bpms || timeScales || groups) {
                timeScales ??= structuredClone(state.timeScales)
                for (const id of (groups ?? state.groups).keys()) {
                    if (!timeScales.get(id)) {
                        const entity = toTimeScaleEntity({ beat: 0, timeScale: 1, groupId: id })
                        addToStoreGrid(this.store.grid, entity, entity.beat)
                    }
                    timeScales.set(id, calculateTimeScales(bpms ?? state.bpms, timeScales.get(id) ?? [{ beat: 0, x: 0, y: 0, s: 1 }]))
                }
            }

            for (const slideId of dirtySlideIds) {
                rebuildSlide(this.store, slideId, selectedEntities)
            }

            return {
                bgm: state.bgm,
                hp: state.hp,
                store: {
                    grid: {
                        ...state.store.grid,
                        ...grid.value,
                    },
                    slides: {
                        ...state.store.slides,
                        ...slides.value,
                    },
                },
                bpms: bpms ?? state.bpms,
                timeScales: timeScales ?? state.timeScales,
                groups: groups ?? state.groups,

                selectedEntities,
            }
        },
    }
}

const createMapObjectTransaction = <T extends Record<string, Map<unknown, unknown>>>(object: T) => {
    const value: Record<string, Map<unknown, unknown>> = {}

    return {
        accessor: Object.defineProperties(
            {},
            Object.fromEntries(
                Object.entries(object).map(([k, v]) => [
                    k,
                    {
                        get: () => (value[k] ??= new Map(v)),
                    },
                ]),
            ),
        ) as T,

        value: value as Partial<T>,
    }
}
