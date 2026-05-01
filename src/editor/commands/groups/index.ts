import { groups } from '../../../history/groups'
import { i18n } from '../../../i18n'
import type { GroupId } from '../../../state/groups'
import { interpolate } from '../../../utils/interpolate'
import { pushState, state } from '../../../history'
import { notify } from '../../notification'
import { addTimeScale } from '../../../state/mutations/timeScale'
import { createTransaction } from '../../../state/transaction'
import { updateViewLastActive, view } from '../../view'

export const switchToGroup = (groupId: GroupId | undefined) => {
    view.groupId = groupId

    if (view.groupId !== undefined && !state.value.timeScales.get(view.groupId)?.find(({ beat }) => beat === 0)) {
        const transaction = createTransaction(state.value)
        const selectedEntities = addTimeScale(transaction, { beat: 0, timeScale: 1, groupId: view.groupId })
        pushState(interpolate(() => i18n.value.tools.timeScale.added, `${selectedEntities.length}`, 'Timescale'), transaction.commit(selectedEntities))
    }

    updateViewLastActive()

    notify(
        view.groupId === undefined
            ? () => i18n.value.commands.groups.switched.all
            : interpolate(
                () => i18n.value.commands.groups.switched.one,
                groups.value.get(view.groupId)?.name ?? '',
            ),
    )
}
