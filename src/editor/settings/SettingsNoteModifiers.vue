<script setup lang="ts">
import { i18n } from '../../i18n'
import KeyField from '../../modals/form/KeyField.vue'
import { settings, type KeyboardShortcut, NoteModifier, type NoteModifier as NoteModifierType, type NoteModifierRecord, NoteModifierRecord as NMR } from '../../settings'
import SettingsSection from './SettingsSection.vue'

const getKey = <P extends keyof NoteModifierRecord>(property: P, value: keyof NoteModifierRecord[P]): KeyboardShortcut | undefined => {
// console.log("pv", property, value)

const p = settings.noteModifierKey[property]
if (!p) return undefined
// @ts-ignore
const t = p[value]
console.log(property, value, t)
return t
}
const setKey = <P extends keyof NoteModifierRecord>(property: P, value: keyof NoteModifierRecord[P], shortcut?: KeyboardShortcut) => {
    settings.noteModifierKey = {
        ...settings.noteModifierKey,
        [property]: {
            ...settings.noteModifierKey[property],
            [value]: shortcut
        }
    }
}
</script>

<template>
    <SettingsSection :title="i18n.settings.noteModifiers.title">
        <template v-for="(v, property) in NMR.properties">
        <KeyField
            v-for="(k, value) in v.properties"
            :key="`${property}.${value}`"
            :label="`${property}.${value}`"
            :model-value="getKey(property, value as never)"
            @update:model-value="setKey(property, value as never, $event)"
        />
        </template>
    </SettingsSection>
</template>
