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
import type { GroupId } from '../chart/groups'

export const scaledTimes = (group: GroupId) => computed(() => {
    const min = timeToScaledTime(timeScales.value.get(group)!, view.cursorTime)
    const ns = state.value.groups.get(group)?.forceNoteSpeed

    return {
        min: min - (ns ? 5 / ns : noteDuration.value),
        max: min + (ns ? 5 / ns : noteDuration.value)
    }
})

export const times = (group: GroupId) => computed(() => {
    const ts = timeScales.value.get(group)!
    const t = scaledTimes(group).value
    // console.log("times", t)
    return {
        min: scaledTimeToTime(ts, t.min),
        max: scaledTimeToTime(ts, t.max),
    }
})

export const beats = (group: GroupId) => computed(() => {
    const t = times(group).value
    // console.log("beats", t)
    return {
        min: timeToBeat(bpms.value, t.min),
        max: timeToBeat(bpms.value, t.max),
    }
})

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
