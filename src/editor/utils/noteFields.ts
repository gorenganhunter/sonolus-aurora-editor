import { store } from '../../history/store'
import type { NoteEntity } from '../../state/entities/slides/note'

export type NoteFields = {
    isAttached: boolean
    // left: boolean
    // size: boolean
    // isCritical: boolean
    lane: boolean
    flickDirection: boolean
    shortenEarlyWindow: boolean
    // isFake: boolean
    // sfx: boolean
    // isConnectorSeparator: boolean
    // connectorType: boolean
    connectorEase: boolean
    // connectorActiveIsCritical: boolean
    // connectorActiveIsFake: boolean
    // connectorGuideColor: boolean
    // connectorGuideAlpha: boolean
    // connectorLayer: boolean
}

export const getNoteFields = (note: NoteEntity): NoteFields => {
    const isAnchor = note.noteType === "anchor"
    // console.log(note)
    const infos = store.value.slides.info.get(note.slideId)
    if (!infos) throw new Error('Unexpected missing infos')

    const index = infos.findIndex((info) => info.note === note)
    if (index === -1) throw new Error('Unexpected missing info')

    const isFirst = index === 0
    const isLast = index === infos.length - 1
    // const isInActive = info.activeHead !== info.activeTail
    // const isActiveHead = info.activeHead === info.note
    // const isActiveTail = info.activeTail === info.note
    // const isInGuide = info.guideHead !== info.guideTail
    // const isGuideHead = info.guideHead === info.note
    // const isGuideTail = info.guideTail === info.note

    return {
        isAttached: !isFirst && !isLast,
        lane: isFirst || isLast || !note.isAttached,
        // size: isFirst || isLast || !note.isAttached,
        // isCritical: note.noteType !== 'anchor' && note.noteType !== 'damage',
        flickDirection:
            (note.noteType === 'default'),
        shortenEarlyWindow: !isAnchor,
        // isFake: note.noteType !== 'anchor',
        // sfx: !note.isFake,
        // isConnectorSeparator: !isFirst && !isLast,
        // connectorType: (isFirst || note.isConnectorSeparator) && !isLast,
        connectorEase: (isFirst || !note.isAttached) && !isLast,
        // connectorActiveIsCritical: isInActive && (isActiveHead || note.isConnectorSeparator),
        // connectorActiveIsFake: isInActive && (isActiveHead || note.isConnectorSeparator),
        // connectorGuideColor: isInGuide && (isGuideHead || note.isConnectorSeparator),
        // connectorGuideAlpha: isInGuide && (isGuideHead || note.isConnectorSeparator || isGuideTail),
        // connectorLayer: (isFirst || note.isConnectorSeparator) && !isLast,
    }
}
