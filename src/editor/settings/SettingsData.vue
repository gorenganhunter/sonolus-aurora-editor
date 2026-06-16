<script setup lang="ts">
import { saveAs } from 'file-saver'
import { i18n } from '../../i18n'
import NumberField from '../../modals/form/NumberField.vue'
import ToggleField from '../../modals/form/ToggleField.vue'
import { settings, settingsProperties } from '../../settings'
import SettingsSection from './SettingsSection.vue'
import { notify } from '../notification.ts'
import { pickFileForOpen } from '../../utils/file.ts'
import { Value } from '@sinclair/typebox/value'

const importSettings = async () => {
    console.log(1)
    const { file } = await pickFileForOpen("settings", [{ accept: { "application/json": ".json" } }])
    if (!file) return

    const json = JSON.parse(await file.text())

    for (const key in settings) {
        settings[key] = json[key]
    }
}

const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings)])
    saveAs(blob, "settings.json")
}

const resetSettings = () => {
    for (const [k, v] of Object.entries(settingsProperties)) {
        settings[k] = Value.Create(v)
    }
}
</script>

<template>
    <div class="flex flex-row gap-2">
        <button
            class="rounded-full bg-button px-4 py-1 shadow-md transition-colors hover:shadow-accent active:bg-accent active:text-button"
            @click="importSettings">
            {{ i18n.settings.import.title }}
        </button>
        <button
            class="rounded-full bg-button px-4 py-1 shadow-md transition-colors hover:shadow-accent active:bg-accent active:text-button"
            @click="exportSettings">
            {{ i18n.settings.export.title }}
        </button>
        <button
            class="rounded-full bg-button px-4 py-1 shadow-md transition-colors hover:shadow-accent active:bg-accent active:text-button"
            @click="resetSettings">
            {{ i18n.settings.reset.title }}
        </button>
    </div>
</template>
