<script setup lang="ts">
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import FormModal from '../../../modals/form/FormModal.vue'
import MultiWaypointField from '../../../modals/form/MultiWaypointField.vue'
import { bpms } from '../../../history/bpms'
import { store, cullAllEntities, walkAllEntities } from '../../../history/store'
import { beatToKey } from '../../../state/store/grid'
import { focusViewAtBeat } from '../../view'
import { beatToTime } from '../../../state/integrals/bpms'
import { formatBeat, formatTime } from '../../../utils/format'
import { getStoreEntities } from '../../../levelData/entities/serialize'
import { pushState, replaceState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import type { Entity } from '../../../state/entities'
import { removeBpm } from '../../../state/mutations/bpm'
import { removeNote } from '../../../state/mutations/slides/note'
import { removeTimeScale } from '../../../state/mutations/timeScale'
import { removeWaypoint } from '../../../state/mutations/waypoint'
import { createTransaction, type Transaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { notify } from '../../notification'

const index = defineModel<number | undefined>({ required: true })

defineEmits<{
    close: []
}>()

const waypoints = [...getStoreEntities(store.value.grid.waypoint)].sort((a, b) => a.beat - b.beat)

const canRemoves: {
    [T in Entity as T['type']]?: (entity: T) => boolean
} = {
    bpm: (entity) => entity.beat > 0,
    timeScale: (entity) => entity.beat > 0
}

const removes: {
    [T in Entity as T['type']]?: (transaction: Transaction, entity: T) => void
} = {
    bpm: removeBpm,
    timeScale: removeTimeScale,

    note: removeNote
}

const canRemove = (entity: Entity) => canRemoves[entity.type]?.(entity as never) ?? true

const clearWaypoints = (i?: number) => {
    if (i === undefined) return

    const minWp = waypoints[i]
    const maxWp = waypoints[i + 1]

    let minBeat = minWp ? minWp.beat : 0
    let maxBeat = maxWp ? maxWp.beat : Number.NEGATIVE_INFINITY

    if (maxBeat < 0) {
        walkAllEntities((entity) => {
            if (entity.beat > maxBeat) maxBeat = entity.beat
        })

        maxBeat += 1
    }

    const entities = [...cullAllEntities(beatToKey(minBeat), beatToKey(maxBeat))].filter(({ beat, type }) => (beat >= minBeat && beat < maxBeat)).filter(canRemove)
    
    if (!entities.length) return

    const transaction = createTransaction(state.value)

    for (const entity of entities) {
        removes[entity.type]?.(transaction, entity as never)
    }

    pushState(
        interpolate(() => i18n.value.tools.eraser.erased, `${entities.length}`),
        transaction.commit([]),
    )

    notify(interpolate(() => i18n.value.tools.eraser.erased, `${entities.length}`))
}

</script>

<template>
    <FormModal :title="i18n.waypoint.clear.title" @close="$emit('close')" @submit="() => { clearWaypoints(index); $emit('close') }">
        <MultiWaypointField v-model="index" :label="i18n.waypoint.clear.select" />
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
    </FormModal>
</template>
