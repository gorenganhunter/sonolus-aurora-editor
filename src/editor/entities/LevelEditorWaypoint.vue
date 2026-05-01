<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../history/bpms'
import type { WaypointEntity } from '../../state/entities/waypoint'
import { beatToTime } from '../../state/integrals/bpms'
import { ups } from '../view'

const props = defineProps<{
    entity: WaypointEntity
    isHighlighted: boolean
}>()

const time = computed(() => beatToTime(bpms.value, props.entity.beat))

const y = computed(() => time.value * ups.value)
</script>

<template>
    <g>
        <line :x1="-4.5" :x2="4.5" :y1="y" :y2="y" stroke="#0f0" stroke-opacity="0.5" />

        <text :x="6.1" :y text-anchor="start" dominant-baseline="middle" fill="#0f0">
            {{ entity.name }}
        </text>
    </g>
</template>
