<script setup lang="ts">
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import BaseModal from '../../../modals/BaseModal.vue'
import { bpms } from '../../../history/bpms'
import { store } from '../../../history/store'
import { focusViewAtBeat } from '../../view'
import { beatToTime } from '../../../state/integrals/bpms'
import { formatBeat, formatTime } from '../../../utils/format'
import { getStoreEntities } from '../../../levelData/entities/serialize'

const waypoints = [...getStoreEntities(store.value.grid.waypoint)]

// const move = (beat: number) => {
//     focusViewAtBeat(beat)
//     $emit('close')
// }

/*const tools = {
    copy: CopyWaypointModal,
    clear: ClearWaypointModal
}*/

// const changeModal = (modal: any) => {
//     showModal(modal, {})
//     $emit('close')
// }
</script>

<template>
    <BaseModal :title="i18n.waypoint.title">
        <div class="flex flex-col gap-2">
            <button
                v-for="({ beat, name }, i) in waypoints"
                :key="i"
                class="rounded-full bg-button px-4 py-1 shadow-md transition-colors hover:shadow-accent active:bg-accent active:text-button"
                @click="() => { focusViewAtBeat(beat); $emit('close') }"
            >
                {{ `${name} - ${formatBeat(beat)} (${formatTime(beatToTime(bpms, beat))})` }}
            </button>
        </div>
        <hr>
        <!--div class="flex flex-col gap-2">
            <button
                v-for="(modal, name) in tools"
                :key="name"
                class="rounded-full bg-button px-4 py-1 shadow-md transition-colors hover:shadow-accent active:bg-accent active:text-button"
                @click="changeModal(modal)"
            >
                {{ i18n.waypoint[name].title }}
            </button>
        </div-->
    </BaseModal>
</template>
