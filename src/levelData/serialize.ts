import type { LevelData } from '@sonolus/core'
import type { Groups } from '../chart/groups'
import type { Store } from '../state/store'
import { serializeToLevelDataEntities } from './entities/serialize'
import { beatToTime } from '../state/integrals/bpms'
import { bpms } from '../history/bpms'

export const serializeToLevelData = (
    bgmOffset: number,
    store: Store,
    groups: Groups,
    hp: number
): LevelData => {
    if (!hp) {
        let firstBeat = Infinity
        let lastBeat = -Infinity
        let duration = 0
        let ns = 0
        for (const note of store.grid.note.values()) {
            note.forEach(n => {
                if (n.beat < firstBeat) firstBeat = n.beat
                if (n.beat > lastBeat) lastBeat = n.beat
            if (n.noteType !== 'anchor') ns++
            })
        }
        if (firstBeat !== Infinity && lastBeat !== -Infinity) {
            duration = beatToTime(bpms.value, lastBeat) - beatToTime(bpms.value, firstBeat)
        }
        hp = Math.ceil((8 + ns / duration) * (duration / 60))
    }
    const data = {
        bgmOffset,
        entities: [
            {
                archetype: 'Initialization',
                data: [
                    {
                        name: 'life',
                        value: hp
                    },
                    {
                        name: 'scoreSystem',
                        value: 1
                    }
                ],
            },
            {
                archetype: 'Stage',
                data: []
            },
            ...serializeToLevelDataEntities(store, groups),
        ],
    }
    // console.log(store, data)
    return data
}
