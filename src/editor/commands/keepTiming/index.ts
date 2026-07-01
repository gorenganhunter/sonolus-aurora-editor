import type { Command } from '..'
import { i18n } from '../../../i18n'
import { notify } from '../../notification'
import { view } from '../../view'
import KeepTimingIcon from './KeepTimingIcon.vue'

export const keepTiming: Command = {
    title: () => i18n.value.commands.keepTiming.title,
    icon: {
        is: KeepTimingIcon,
    },

    execute() {
        if (view.keepTiming === 'beat') {
            view.keepTiming = 'time'

            notify(() => i18n.value.commands.keepTiming.time)
        } else {
            view.keepTiming = 'beat'

            notify(() => i18n.value.commands.keepTiming.beat)
        }
    },
}
