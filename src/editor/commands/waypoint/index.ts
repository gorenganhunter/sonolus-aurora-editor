import type { Command } from '..'
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import WaypointModal from './WaypointModal.vue'
import TextIcon from '../TextIcon.vue'
import { switchToolTo, toolName } from '../../tools'
import { notify } from '../../notification'
import { isSidebarVisible } from '../../sidebars'

export const waypoint: Command = {
    title: () => i18n.value.commands.waypoint.title,
    icon: {
        is: TextIcon,
        props: {
            title: 'Wp',
            class: 'text-[#000]',
        },
    },

    async execute() {
        if (toolName.value === 'waypoint') {
            if (isSidebarVisible.value) {
            } else {
                await showModal(WaypointModal, {})
            }
        } else {
            switchToolTo('waypoint')
        }

        notify(() => i18n.value.commands.waypoint.switched)
    },
}
