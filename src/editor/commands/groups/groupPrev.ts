import type { Command } from '..'
import { pushState, state } from '../../../history'
import { groups } from '../../../history/groups'
import { i18n } from '../../../i18n'
import { addTimeScale } from '../../../state/mutations/timeScale'
import { createTransaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { notify } from '../../notification'
import { updateViewLastActive, view } from '../../view'
import GroupPrevIcon from './GroupPrevIcon.vue'

export const groupPrev: Command = {
    title: () => i18n.value.commands.groups.groupPrev.title,
    icon: {
        is: GroupPrevIcon,
    },

    execute() {
        const ids = [...groups.value.keys()]
        const index = view.group ? ids.indexOf(view.group) : -1

        if (index < 0) {
            view.group = ids.at(-1)
        } else if (index === 0) {
            view.group = undefined
        } else {
            view.group = ids[index - 1]
        }

        if (view.group !== undefined && !state.value.timeScales.get(view.group)?.find(({ beat }) => beat === 0)) {
            const transaction = createTransaction(state.value)
            const selectedEntities = addTimeScale(transaction, { beat: 0, timeScale: 1, group: view.group })
            pushState(interpolate(() => i18n.value.tools.timeScale.added, `${selectedEntities.length}`, 'Timescale'), transaction.commit(selectedEntities))
        }

        updateViewLastActive()

        notify(
            view.group === undefined
                ? () => i18n.value.commands.groups.switched.all
                : interpolate(
                    () => i18n.value.commands.groups.switched.one,
                    groups.value.get(view.group)?.name ?? '',
                ),
        )
    },
}
