import { type BaseEntity } from '.'
import type { GroupId } from '../../chart/groups'
import type { TimeScaleObject } from '../../chart/timeScale'

export type TimeScaleEntity = BaseEntity & {
    type: 'timeScale'
    groupId: GroupId
    timeScale: number
    // skip: number
    // ease: TimeScaleEase
    // hideNotes: boolean
}

export const toTimeScaleEntity = (object: TimeScaleObject): TimeScaleEntity => ({
    type: 'timeScale',
    hitbox: {
        lane: -5,
        beat: object.beat,
        w: 0.5,
        h: 0.4,
    },

    groupId: object.groupId,
    beat: object.beat,
    timeScale: object.timeScale,
    // skip: object.skip,
    // ease: object.ease,
    // hideNotes: object.hideNotes,
})
