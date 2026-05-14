import { EngineArchetypeDataName, EngineArchetypeName, type LevelDataEntity } from '@sonolus/core'
import { getStoreEntities } from '.'
import type { TimeScaleEntity } from '../../../state/entities/timeScale'
import type { GroupId, Groups } from '../../../state/groups'
import type { Store } from '../../../state/store'

export const serializeTimeScaleGroupsToLevelDataEntities = (groups: Groups) =>
    new Map(
        [...groups.entries()].map(([id, { name, forceNoteSpeed }]): [GroupId, LevelDataEntity] => [
            id,
            {
                archetype: 'TimeScaleGroup',
                data: [
                    {
                        name: 'editorName',
                        ref: name,
                    },
                    ...(forceNoteSpeed
                        ? [
                            {
                                name: 'noteSpeed',
                                value: forceNoteSpeed,
                            },
                        ]
                        : []),
                ],
                name: "g" + name
            },
        ]),
    )

export const serializeTimeScaleChangesToLevelDataEntities = (
    timeScaleGroupEntities: Map<GroupId, LevelDataEntity>,
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

    for (const [groupId, timeScales] of timeScalesByGroup) {
        const timeScaleGroup = timeScaleGroupEntities.get(groupId)
        if (!timeScaleGroup) throw new Error('Unexpected missing group')

        let prev: LevelDataEntity | undefined
        entities.push(
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
                                name: EngineArchetypeDataName.TimeScale,
                                value: timeScale.timeScale,
                            },
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

    return entities
}
