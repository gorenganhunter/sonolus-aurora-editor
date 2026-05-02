<script setup lang="ts">
import { selectedEntities } from '../history/selectedEntities'
import LevelEditorHitbox from './entities/LevelEditorHitbox.vue'
import LevelEditorNoteHitbox from './entities/LevelEditorNoteHitbox.vue'
import { settings } from '../settings'
</script>

<template>
    <template v-for="entity in selectedEntities" :key="entity">
        <LevelEditorHitbox v-if="(!settings.hitboxAsSelectionBox || entity.type !== 'note' || entity.noteType === 'anchor') && entity.hitbox" :hitbox="entity.hitbox" stroke-opacity="0.5" />
        <LevelEditorNoteHitbox v-if="settings.hitboxAsSelectionBox && entity.type === 'note' && entity.noteType !== 'anchor'" :entity />
    </template>
</template>
