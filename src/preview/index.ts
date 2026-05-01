import { computed } from 'vue'
import { view } from '../editor/view'
import { bpms } from '../history/bpms'
import { timeScales } from '../history/timeScales'
import { timeToBeat } from '../state/integrals/bpms'
import { scaledTimeToTime, timeToScaledTime } from '../state/integrals/timeScales'
import { beatToKey } from '../state/store/grid'
import { computedRange } from '../utils/range'
import { noteDuration } from './note'
import { state } from '../history'
import type { GroupId } from '../state/groups'

export const scaledTimes = (group: GroupId) => computed(() => {
    const min = timeToScaledTime(timeScales.value.get(group)!, view.cursorTime)
    const ns = state.value.groups.get(group)?.forceNoteSpeed

    return {
        min,
        max: min + (ns ? 5 / ns : noteDuration.value)
    }
})

export const times = (group: GroupId) => computed(() => ({
    min: view.cursorTime,
    max: scaledTimeToTime(timeScales.value.get(group)!, scaledTimes(group).value.max),
}))

export const beats = (group: GroupId) => computed(() => ({
    min: timeToBeat(bpms.value, view.cursorTime),
    max: timeToBeat(bpms.value, times(group).value.max),
}))

export const keys = computedRange(() => {
    let range = {
        min: Infinity,
        max: -Infinity
    }

    for (const id of state.value.groups.keys()) {
        let { min, max } = beats(id).value
        if (min > max) [min, max] = [max, min]

        if (min < range.min) range.min = min
        if (max > range.max) range.max = max
    }

    // const range = {
    //     min: beatToKey(timeToBeat(bpms.value, view.cursorTime)),
    //     max: 1000//maxBeatToKey(beats.value.max),
    // }
    // =======
    //     min: beatToKey(beats.value.min),
    //     max: beatToKey(beats.value.max),
    // >>>>>>> upstream/main
    return {
        min: beatToKey(range.min),
        max: beatToKey(range.max)
    }
})
