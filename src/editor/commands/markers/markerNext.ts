import type { Command } from '..'
import { replaceState, state } from '../../../history'
import { bpms } from '../../../history/bpms'
import { walkAllEntities } from '../../../history/store'
import { i18n } from '../../../i18n'
import type { NoteEntity } from '../../../state/entities/slides/note'
import { timeToBeat } from '../../../state/integrals/bpms'
import { focusViewAtBeat, view } from '../../view'
import MarkerNextIcon from './MarkerNextIcon.vue'

export const markerNext: Command = {
    title: () => i18n.value.commands.markers.markerNext.title,
    icon: {
        is: MarkerNextIcon,
    },

    execute() {
        const beat = timeToBeat(bpms.value, view.cursorTime)
        let nextEntity: NoteEntity | undefined = undefined

        walkAllEntities((entity) => {
            if (entity.type === "note" && entity.marker !== "none" && entity.beat > beat && ((!nextEntity) || (nextEntity && entity.beat < nextEntity.beat))) {
                nextEntity = entity
            }
        })

        if (!nextEntity) return

        replaceState({
            ...state.value,
            selectedEntities: [nextEntity],
        })

        focusViewAtBeat((nextEntity as NoteEntity).beat)
    },
}
