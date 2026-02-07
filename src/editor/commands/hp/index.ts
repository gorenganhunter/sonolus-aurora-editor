import type { Command } from '..'
import { pushState, state } from '../../../history'
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import { notify } from '../../notification'
import TextIcon from '../TextIcon.vue'
import HPModal from './HPModal.vue'

export const hp: Command = {
    title: () => i18n.value.commands.hp.title,
    icon: {
        is: TextIcon,
        props: {
            title: 'HP',
            class: 'text-[#00f]',
        },
    },

    async execute() {
        const newHP = await showModal(HPModal, {
            hp: state.value.hp,
        })
        if (!newHP) return

        pushState(() => i18n.value.commands.hp.changed, {
            ...state.value,
            hp: newHP,
        })

        notify(() => i18n.value.commands.hp.changed)
    },
}
