import type { Command } from '..'
import type { FlickDirection } from '../../../chart/note'
import { pushState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import { i18n } from '../../../i18n'
import type { Entity } from '../../../state/entities'
import { createTransaction, type Transaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { align } from '../../../utils/math.ts'
import { notify } from '../../notification'
import { editSelectedNote } from '../../tools/note'
import { editSelectedTimeScale } from '../../tools/timeScale/index.ts'
import { editSelectedWaypoint } from '../../tools/waypoint/index.ts'
import { view } from '../../view'
import SnapIcon from './SnapIcon.vue'

export const snap: Command = {
    title: () => i18n.value.commands.snap.title,
    icon: {
        is: SnapIcon,
    },

    execute() {
        const entities = selectedEntities.value

        if (!entities.length) {
            notify(() => i18n.value.commands.snap.noSelected)
            return
        }

        const transaction = createTransaction(state.value)

        const snappedEntities = entities.flatMap(
            (entity) => snaps[entity.type]?.(transaction, entity as never) ?? [entity],
        )

        pushState(
            interpolate(() => i18n.value.commands.snap.snapped, `${entities.length}`),
            transaction.commit(snappedEntities),
        )
        view.entities = {
            hovered: [],
            creating: [],
        }

        notify(interpolate(() => i18n.value.commands.snap.snapped, `${entities.length}`))
    },
}

type Snap<T> = (transaction: Transaction, entity: T) => Entity[]

const snaps: {
    [T in Entity as T['type']]: Snap<T> | undefined
} = {
    bpm: undefined,
    timeScale: (transaction, entity) =>
        editSelectedTimeScale(transaction, entity, {
            beat: align(entity.beat, view.division)
        }),

    note: (transaction, entity) =>
        editSelectedNote(transaction, entity, {
            beat: align(entity.beat, view.division)
        }),
    connector: undefined,
    waypoint: (transaction, entity) =>
        editSelectedWaypoint(transaction, entity, {
            beat: align(entity.beat, view.division)
        })
}
