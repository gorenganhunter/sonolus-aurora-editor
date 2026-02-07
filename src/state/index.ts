import type { Chart } from '../chart'
import type { Bgm } from './bgm'
import type { Entity } from './entities'
import { createBpms, type BpmIntegral } from './integrals/bpms'
import { createTimeScales, type TimeScaleIntegral } from './integrals/timeScales'
import type { Store } from './store'
import { createStore } from './store/creates'

export type State = {
    filename?: string

    bgm: Bgm
    hp: number
    store: Store
    bpms: BpmIntegral[]
    timeScales: TimeScaleIntegral[]
    groupCount: number

    selectedEntities: Entity[]
}

export const createState = (chart: Chart, offset: number, filename?: string): State => {
    const bpms = createBpms(chart)
    return {
        filename,

        bgm: { offset },
        hp: chart.hp,
        store: createStore(chart),
        bpms,
        timeScales: createTimeScales(chart, bpms),
        groupCount: chart.groupCount,

        selectedEntities: [],
    }
}
