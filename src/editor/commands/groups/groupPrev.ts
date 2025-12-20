import type { Command } from '..'
import { pushState, state } from '../../../history'
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
        if (view.group === undefined) {
            view.group = state.value.groupCount - 1
        } else if (view.group === 0) {
            view.group = undefined
        } else {
            view.group--
        }

        if (view.group !== undefined && !state.value.timeScales.filter(({ group }) => group === view.group).length) {
            const transaction = createTransaction(state.value)
            const selectedEntities = addTimeScale(transaction, { beat: 0, timeScale: 1, group: view.group })
            pushState(interpolate(() => i18n.value.tools.timeScale.added, `${selectedEntities.length}`, 'Timescale'), transaction.commit(selectedEntities))
        }

        updateViewLastActive()

        notify(
            view.group === undefined
                ? () => i18n.value.commands.groups.switched.all
                : view.group
                    ? interpolate(() => i18n.value.commands.groups.switched.other, `#${view.group}`)
                    : () => i18n.value.commands.groups.switched.default,
        )
    },
}
