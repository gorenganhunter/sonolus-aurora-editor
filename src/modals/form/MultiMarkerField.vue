<script setup lang="ts">
import type { NoteMarker } from '../../chart/note'
import { i18n } from '../../i18n'
import MultiSelectField from './MultiSelectField.vue'

const modelValue = defineModel<NoteMarker | undefined>({ required: true })
</script>

<template>
    <MultiSelectField
        v-model="modelValue"
        :label="i18n.modals.form.marker.label"
        :options="[
            [i18n.modals.form.marker.none, 'none'],
            [i18n.modals.form.marker.danger, 'danger'],
            [i18n.modals.form.marker.questionable, 'questionable'],
            [i18n.modals.form.marker.info, 'info']
        ]"
    />
</template>
