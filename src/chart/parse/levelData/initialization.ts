import { Type } from '@sinclair/typebox'
import { getOptionalValue, type ParseCtx } from '.'

export const parseInitializationToChart = ({ chart, entities: [entity] }: ParseCtx) => {
    if (entity?.archetype !== 'Initialization') return

    chart.hp = getOptionalValue(entity, 'life', initialLifeSchema) ?? 1
}

const initialLifeSchema = Type.Number({ minimum: 1, multipleOf: 1 })
