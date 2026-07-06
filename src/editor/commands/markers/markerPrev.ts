import type { Command } from '..'
import { replaceState, state } from '../../../history'
import { bpms } from '../../../history/bpms'
import { walkAllEntities } from '../../../history/store'
import { i18n } from '../../../i18n'
import type { NoteEntity } from '../../../state/entities/slides/note'
import { timeToBeat } from '../../../state/integrals/bpms'
import { focusViewAtBeat, view } from '../../view'
import MarkerPrevIcon from './MarkerPrevIcon.vue'

export const markerPrev: Command = {
    title: () => i18n.value.commands.markers.markerPrev.title,
    icon: {
        is: MarkerPrevIcon,
    },

    execute() {
        const beat = timeToBeat(bpms.value, view.cursorTime)
        let prevEntity: NoteEntity | undefined = undefined

        walkAllEntities((entity) => {
            if (entity.type === "note" && entity.marker !== "none" && entity.beat < beat && ((!prevEntity) || (prevEntity && entity.beat > prevEntity.beat))) {
                prevEntity = entity
            }
        })

        if (!prevEntity) return

        replaceState({
            ...state.value,
            selectedEntities: [prevEntity],
        })

        focusViewAtBeat((prevEntity as NoteEntity).beat)
    },
}
