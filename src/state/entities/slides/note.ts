import type { SlideId } from '.'
import type { BaseEntity } from '..'
import type { GroupId } from '../../../chart/groups'
import type {
    ConnectorEase,
    // ConnectorGuideColor,
    // ConnectorLayer,
    // ConnectorType,
    FlickDirection,
    NoteObject,
    // NoteSfx,
    NoteType,
    ShortenEarlyWindow,
} from '../../../chart/note'

export type NoteEntity = BaseEntity & {
    type: 'note'
    slideId: SlideId
    groupId: GroupId
    noteType: NoteType
    lane: number
    // spawnLane: number
    isAttached: boolean
    flickDirection: FlickDirection
    shortenEarlyWindow: ShortenEarlyWindow
    // isFake: boolean
    // sfx: NoteSfx
    // isConnectorSeparator: boolean
    // connectorType: ConnectorType
    connectorEase: ConnectorEase
    // connectorLayer: ConnectorLayer
    // connectorActiveIsCritical: boolean
    // connectorActiveIsFake: boolean
    // connectorGuideColor: ConnectorGuideColor
    // connectorGuideAlpha: number

    useInfoOf?: NoteEntity
}

export const toNoteEntity = (
    slideId: SlideId,
    object: NoteObject,
    useInfoOf?: NoteEntity,
): NoteEntity => ({
    type: 'note',
    hitbox: {
        lane: object.lane,
        beat: object.beat,
        w: 1 / 2,
        h: 0.4,
    },

    slideId,
    groupId: object.groupId,
    beat: object.beat,
    noteType: object.noteType,
    isAttached: object.isAttached,
    lane: object.lane,
    // spawnLane: object.spawnLane,
    flickDirection: object.flickDirection,
    shortenEarlyWindow: object.shortenEarlyWindow,
    connectorEase: object.connectorEase,
    // isFake: object.isFake,

    useInfoOf,
})
