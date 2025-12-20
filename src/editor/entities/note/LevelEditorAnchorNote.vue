<script setup lang="ts">
import type { NoteEntity } from '../../../state/entities/slides/note'
import { bodyComponents } from './body'

defineProps<{
    entity: NoteEntity
    isHighlighted: boolean
}>()
</script>

<template>
    <component :is="bodyComponents.none" :is-highlighted="isHighlighted" />
</template>
