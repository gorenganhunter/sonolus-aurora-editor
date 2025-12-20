import { findIntegral, integrate, type Integral } from '.'
import type { Chart, TimeScaleObject } from '../../chart'
import { beatToTime, type BpmIntegral } from './bpms'

export type TimeScaleIntegral = Integral & {
  beat: number
  group: number
}

export const createTimeScales = (chart: Chart, bpms: BpmIntegral[]) => {
  let map: TimeScaleIntegral[] = [];
  [...new Set(chart.timeScales.map(t => t.group))].forEach(st => {
    map.push(...calculateTimeScales(bpms, chart.timeScales.filter(t => t.group === st).map(toTimeScaleIntegral)))
  })
  return map
}

export const calculateTimeScales = (bpms: BpmIntegral[], timeScales: TimeScaleIntegral[]) =>
  integrate(
    timeScales
      .sort((a, b) => a.beat - b.beat)
      .map(
        (timeScale): TimeScaleIntegral => ({
          ...timeScale,
          x: beatToTime(bpms, timeScale.beat),
        }),
      ),
  )

export const toTimeScaleIntegral = (object: TimeScaleObject): TimeScaleIntegral => ({
  beat: object.beat,
  x: 0,
  y: 0,
  s: object.timeScale,
  group: object.group
})

export const timeToScaledTime = (timeScales: TimeScaleIntegral[], time: number) => {
  const { x, y, s } = findIntegral(timeScales, 'x', time)

  return y + (time - x) * s
}

export const scaledTimeToTime = (timeScales: TimeScaleIntegral[], scaledTime: number) => {
  const { x, y, s } = findIntegral(timeScales, 'y', scaledTime)

  return x + (scaledTime - y) / s
}
