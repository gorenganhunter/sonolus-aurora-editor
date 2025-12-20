<script setup lang="ts">
import { isViewRecentlyActive } from '../../../view'

defineProps<{
    isHighlighted: boolean
}>()
</script>

<template>
    <circle
        cx="0"
        cy="0"
        r="0.5"
        stroke="#fff"
    />
</template>
