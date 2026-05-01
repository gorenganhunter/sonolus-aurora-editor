import { findIntegral, integrate, type Integral } from '.'
import type { Chart, TimeScaleObject } from '../../chart'
import { state } from '../../history'
import type { GroupId } from '../groups'
import { beatToTime, type BpmIntegral } from './bpms'

export type TimeScaleIntegral = Integral & {
  beat: number
}

export const createTimeScales = (chart: Chart, bpms: BpmIntegral[]) => {
  let map: Map<GroupId, TimeScaleIntegral[]> = new Map();
  for (const id of chart.groups.keys()) {
    map.set(id, calculateTimeScales(bpms, chart.timeScales.filter(t => t.groupId === id).map(toTimeScaleIntegral)))
  }
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
})

export const timeToScaledTime = (timeScales: TimeScaleIntegral[], time: number) => {
  const { x, y, s } = findIntegral(timeScales, 'x', time)

  return y + (time - x) * s
}

export const scaledTimeToTime = (timeScales: TimeScaleIntegral[], scaledTime: number) => {
  const { x, y, s } = findIntegral(timeScales, 'y', scaledTime)

  return x + (scaledTime - y) / s
}
