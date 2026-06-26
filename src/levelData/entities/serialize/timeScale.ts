import { EngineArchetypeDataName, EngineArchetypeName, type LevelDataEntity } from '@sonolus/core'
import { getStoreEntities } from '.'
import type { GroupId } from '../../../chart/groups'
import type { TimeScaleEntity } from '../../../state/entities/timeScale'
import type { Store } from '../../../state/store'

export const serializeTimeScalesToLevelDataEntities = (
    groupEntities: Map<GroupId, LevelDataEntity>,
    store: Store,
    getName: () => string,
) => {
    const timeScalesByGroup = new Map<GroupId, TimeScaleEntity[]>()

    for (const timeScale of getStoreEntities(store.grid.timeScale)) {
        const timeScales = timeScalesByGroup.get(timeScale.groupId)
        if (timeScales) {
            timeScales.push(timeScale)
        } else {
            timeScalesByGroup.set(timeScale.groupId, [timeScale])
        }
    }

    const entities: LevelDataEntity[] = []

    const added: GroupId[] = []

    for (const [groupId, timeScales] of timeScalesByGroup) {
        const timeScaleGroup = groupEntities.get(groupId)
        if (!timeScaleGroup) throw new Error('Unexpected missing group')

        added.push(groupId)

        let prev: LevelDataEntity | undefined
        entities.push(
            timeScaleGroup,
            ...timeScales
                .sort((a, b) => a.beat - b.beat)
                .map((timeScale) => {
                    const entity: LevelDataEntity = {
                        archetype: 'TimeScaleChange',
                        data: [
                            {
                                name: 'group',
                                ref: (timeScaleGroup.name ??= getName()),
                            },
                            {
                                name: EngineArchetypeDataName.Beat,
                                value: timeScale.beat,
                            },
                            {
                                name: 'editorLane',
                                value: timeScale.editorLane,
                            },
                            {
                                name: EngineArchetypeDataName.TimeScale,
                                value: timeScale.timeScale,
                            },
                            // {
                            //     name: '#TIMESCALE_SKIP',
                            //     value: timeScale.skip,
                            // },
                            // {
                            //     name: '#TIMESCALE_EASE',
                            //     value: timeScaleEases[timeScale.timeScaleEase],
                            // },
                            // {
                            //     name: 'hideNotes',
                            //     value: +timeScale.hideNotes,
                            // },
                        ],
                        name: "t" + getName()
                    }

                    if (prev) {
                        prev.data.push({
                            name: 'next',
                            ref: (entity.name ??= getName()),
                        })
                    } else {
                        timeScaleGroup.data.push({
                            name: 'head',
                            ref: (entity.name ??= getName()),
                        })
                    }

                    return (prev = entity)
                }),
        )
    }

    for (const [id, entity] of groupEntities.entries()) {
        if (!added.includes(id)) entities.push(entity)
    }

    return entities
}
