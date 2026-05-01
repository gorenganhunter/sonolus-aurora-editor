import { Type } from '@sinclair/typebox'
import { getOptionalValue, type ParseToChart } from '.'

export const parseInitializationToChart: ParseToChart = (chart, [entity]) => {
    if (entity?.archetype !== 'Initialization') return

    chart.hp = getOptionalValue(entity, 'life', initialLifeSchema) ?? 1
}

const initialLifeSchema = Type.Number({ minimum: 1, multipleOf: 1 })
