import { Type } from '@sinclair/typebox'
import { getOptionalRef, getOptionalValue, type ParseCtx } from '.'

export const parseGroupsToChart = ({ entities, addGroup }: ParseCtx) => {
    for (const entity of entities) {
        if (entity.archetype !== 'TimeScaleGroup') continue

        addGroup(entity.name, getOptionalRef(entity, 'editorName') ?? (entity.name?.startsWith("g") ? entity.name.slice(1) : entity.name), {
            forceNoteSpeed: getOptionalValue(entity, 'noteSpeed', forceNoteSpeedSchema),
        })
    }
}

const forceNoteSpeedSchema = Type.Number({ minimum: 1, maximum: 20 })
