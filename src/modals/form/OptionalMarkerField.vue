<script setup lang="ts">
import type { NoteMarker } from '../../chart/note'
import { i18n } from '../../i18n'
import OptionalSelectField from './OptionalSelectField.vue'

const modelValue = defineModel<NoteMarker | undefined>({ required: true })
</script>

<template>
    <OptionalSelectField
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

