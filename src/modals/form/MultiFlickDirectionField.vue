<script setup lang="ts">
import type { FlickDirection } from '../../chart'
import { i18n } from '../../i18n'
import MultiSelectField from './MultiSelectField.vue'

const modelValue = defineModel<FlickDirection | undefined>({ required: true })
</script>

<template>
    <MultiSelectField
        v-model="modelValue"
        :label="i18n.modals.form.flickDirection.label"
        :options="[
            [i18n.modals.form.flickDirection.none, 'none'],
            [i18n.modals.form.flickDirection.left, 'left'],
            [i18n.modals.form.flickDirection.right, 'right'],
            [i18n.modals.form.flickDirection.up, 'up'],
            [i18n.modals.form.flickDirection.down, 'down'],
        ]"
    />
</template>
