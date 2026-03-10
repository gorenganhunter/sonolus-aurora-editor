<script setup lang="ts">
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import BaseModal from '../../../modals/BaseModal.vue'
import WaypointCopyModal from './WaypointCopyModal.vue'
import WaypointClearModal from './WaypointClearModal.vue'
import { bpms } from '../../../history/bpms'
import { store } from '../../../history/store'
import { focusViewAtBeat } from '../../view'
import { beatToTime } from '../../../state/integrals/bpms'
import { formatBeat, formatTime } from '../../../utils/format'
import { getStoreEntities } from '../../../levelData/entities/serialize'

const waypoints = [...getStoreEntities(store.value.grid.waypoint)].sort((a, b) => a.beat - b.beat)

// const move = (beat: number) => {
//     focusViewAtBeat(beat)
//     $emit('close')
// }

const tools = {
    copy: WaypointCopyModal,
    clear: WaypointClearModal
}
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
                {{ `${name} - ${beat} (${formatTime(beatToTime(bpms, beat))})` }}
            </button>
        </div>
        <hr>
        <h2 class="font-bold mb-2">{{ i18n.waypoint.tools }}</h2>
        <div class="flex flex-col gap-2">
            <button
                v-for="(modal, name) in tools"
                :key="name"
                class="rounded-full bg-button px-4 py-1 shadow-md transition-colors hover:shadow-accent active:bg-accent active:text-button"
                @click="() => { showModal(modal, {}); $emit('close') }"
            >
                {{ i18n.waypoint[name].title }}
            </button>
        </div>
    </BaseModal>
</template>
