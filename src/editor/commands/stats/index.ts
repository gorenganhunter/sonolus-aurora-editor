import type { Command } from '..'
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import StatsModal from '../../stats/StatsModal.vue'
import StatsIcon from './StatsIcon.vue'

export const stats: Command = {
    title: () => i18n.value.commands.stats.title,
    icon: {
        is: StatsIcon,
    },

    execute() {
        void showModal(StatsModal, {})
    },
}
