<script setup lang="ts">
import { ref, shallowReactive } from 'vue'
import { i18n } from '../../../i18n'
import FormModal from '../../../modals/form/FormModal.vue'
import NumberField from '../../../modals/form/NumberField.vue'
import { view } from '../../view'
import { state } from '../../../history'
import { store } from '../../../history/store'
import { bpms } from '../../../history/bpms'
import { beatToTime } from '../../../state/integrals/bpms'

// const props = defineProps<{
//     hp: number
// }>()

defineEmits<{
    close: [hp?: number]
}>()

const model = ref(state.value.hp)

const autoSet = () => {
    let firstBeat = Infinity
    let lastBeat = -Infinity
    let duration = 0
    for (const note of store.value.grid.note.values()) {
        note.forEach(n => {
            if (n.beat < firstBeat) firstBeat = n.beat
            if (n.beat > lastBeat) lastBeat = n.beat
        })
    }
    if (firstBeat !== Infinity && lastBeat !== -Infinity) {
        duration = beatToTime(bpms.value, lastBeat) - beatToTime(bpms.value, firstBeat)
    }
    model.value = Math.floor(duration / 6) + 1
}
</script>

<template>
    <FormModal
        :title="i18n.commands.hp.modal.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <NumberField
            v-model="model"
            :label="i18n.commands.hp.modal.title"
            :min="1"
            :step="1"
        />
        <button
            type="button"
            class="w-32 rounded-full bg-button px-4 py-1 shadow-md transition-colors hover:shadow-accent active:bg-accent active:text-button"
            @click="autoSet()"
        >
            {{ i18n.commands.hp.modal.auto }}
        </button>
    </FormModal>
</template>
