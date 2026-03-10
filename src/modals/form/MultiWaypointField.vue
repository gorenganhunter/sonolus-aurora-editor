<script setup lang="ts">
import { store } from '../../history/store'
import { i18n } from '../../i18n'
import MultiSelectField from './MultiSelectField.vue'
import { getStoreEntities } from '../../levelData/entities/serialize'

defineProps<{
    label: string
}>()

const modelValue = defineModel<number | undefined>({ required: true })
const waypoints = [...getStoreEntities(store.value.grid.waypoint)].sort((a, b) => a.beat - b.beat)
</script>

<template>
    <MultiSelectField
        v-model="modelValue"
        :label
        :options="
            waypoints.map(({ name, beat }, i) => [
                name,
                i,
            ])
        "
    />
</template>
