import { Type } from '@sinclair/typebox'
import { EngineArchetypeDataName, EngineArchetypeName } from '@sonolus/core'
import { getOptionalRef, getOptionalValue, getValue, type ParseToChart } from '.'
import { beatSchema } from './schemas'

export const parseTimeScalesToChart: ParseToChart = ({ chart, entities, getGroupId, addGroup }) => {
    for (const entity of entities) {
        if (entity.archetype !== 'TimeScaleGroup') continue

        addGroup(entity.name, getOptionalRef(entity, 'editorName') ?? (entity.name?.startsWith("g") ? entity.name.slice(1) : entity.name), {
            forceNoteSpeed: getOptionalValue(entity, 'noteSpeed', forceNoteSpeedSchema),
        })
    }

    for (const entity of entities) {
        if (entity.archetype !== 'TimeScaleChange') continue

        chart.timeScales.push({
            groupId: getGroupId(entity),
            beat: getValue(entity, EngineArchetypeDataName.Beat, beatSchema),
            timeScale: getValue(entity, EngineArchetypeDataName.TimeScale, valueSchema),
            // skip: getValue(entity, '#TIMESCALE_SKIP', skipSchema),
            // ease: eases[getValue(entity, '#TIMESCALE_EASE', easeSchema)],
            // hideNotes: !!getOptionalValue(entity, 'hideNotes', hideNotesSchema),
        })
    }
}

const forceNoteSpeedSchema = Type.Number({ minimum: 1, maximum: 20 })

const valueSchema = Type.Number()

// const skipSchema = Type.Number()
//
// const easeSchema = Type.Union([Type.Literal(0), Type.Literal(1)])
//
// const eases = {
//     0: 'none',
//     1: 'linear',
// } as const
//
// const hideNotesSchema = Type.Number()
