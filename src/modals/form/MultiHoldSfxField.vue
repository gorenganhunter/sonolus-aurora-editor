<script setup lang="ts">
import type { ConnectorSfx } from '../../chart/note'
import { i18n } from '../../i18n'
import MultiSelectField from './MultiSelectField.vue'

const modelValue = defineModel<ConnectorSfx | undefined>({ required: true })
</script>

<template>
    <MultiSelectField
        v-model="modelValue"
        :label="i18n.modals.form.holdSfx.label"
        :options="[
            [i18n.modals.form.holdSfx.default, 'default'],
            [i18n.modals.form.holdSfx.none, 'none'],
            [i18n.modals.form.holdSfx.alt2, 'alt2'],
            [i18n.modals.form.holdSfx.alt3, 'alt3'],
            [i18n.modals.form.holdSfx.alt4, 'alt4']
/*            [i18n.modals.form.sfx.normalTap, 'normalTap'],
            [i18n.modals.form.sfx.criticalTap, 'criticalTap'],
            [i18n.modals.form.sfx.normalFlick, 'normalFlick'],
            [i18n.modals.form.sfx.criticalFlick, 'criticalFlick'],
            [i18n.modals.form.sfx.normalTrace, 'normalTrace'],
            [i18n.modals.form.sfx.criticalTrace, 'criticalTrace'],
            [i18n.modals.form.sfx.normalTick, 'normalTick'],
            [i18n.modals.form.sfx.criticalTick, 'criticalTick'],
            [i18n.modals.form.sfx.damage, 'damage'],*/
        ]"
    />
</template>
