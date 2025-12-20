<script setup lang="ts">
import { i18n } from '../../i18n'
import SelectField from '../../modals/form/SelectField.vue'
import NumberField from '../../modals/form/NumberField.vue'
import { settings } from '../../settings'
import SettingsSection from './SettingsSection.vue'
</script>

<template>
    <SettingsSection :title="i18n.settings.preview.title">
        <SelectField
            v-model="settings.previewPosition"
            :label="i18n.settings.preview.position.title"
            :options="[
                [i18n.settings.preview.position.auto, 'auto'],
                [i18n.settings.preview.position.top, 'top'],
                [i18n.settings.preview.position.left, 'left'],
            ]"
        />
        
        <NumberField
            v-model="settings.previewNoteSpeed"
            :label="i18n.settings.preview.noteSpeed.title"
            :min="1"
            :max="15"
            :step="0.1"
        />
    </SettingsSection>
</template>
