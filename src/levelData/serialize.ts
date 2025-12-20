import type { LevelData } from '@sonolus/core'
import type { Store } from '../state/store'
import { serializeToLevelDataEntities } from './entities/serialize'

export const serializeToLevelData = (
    bgmOffset: number,
    store: Store,
    groupCount: number,
): LevelData => {
    const data = {
        bgmOffset,
        entities: [
            {
                archetype: 'Initialization',
                data: [
                    {
                        name: 'life',
                        value: 30
                    }
                ],
            },
            {
                archetype: 'Stage',
                data: []
            },
            ...serializeToLevelDataEntities(store, groupCount),
        ],
    }
    // console.log(store, data)
    return data
}
