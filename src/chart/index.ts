import type { BpmObject } from './bpm'
import type { Groups } from './groups'
import type { NoteObject } from './note'
import type { TimeScaleObject } from './timeScale'
import type { WaypointObject } from './waypoint'

export type Chart = {
    hp: number
    waypoints: WaypointObject[]
    bpms: BpmObject[]
    groups: Groups
    timeScales: TimeScaleObject[]
    slides: NoteObject[][]
}
