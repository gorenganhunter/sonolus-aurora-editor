import type { LevelDataEntity } from '@sonolus/core'
import type { GroupId, Groups } from '../../../chart/groups'

export const serializeGroupsToLevelDataEntities = (groups: Groups) =>
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
