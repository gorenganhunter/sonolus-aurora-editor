<script setup lang="ts">
import { computed, useId } from 'vue'
import { bpms } from '../../../history/bpms'
import type { ConnectorEntity } from '../../../state/entities/slides/connector'
import { beatToTime } from '../../../state/integrals/bpms'
import { getColor } from './color'
import ConnectorFakeMarker from './ConnectorFakeMarker.vue'
import ConnectorGradient from './ConnectorGradient.vue'
import { getPathD } from './path'

const props = defineProps<{
    entity: ConnectorEntity
}>()

const id = useId()

const graphic = computed(() => {
    const { attachHead, attachTail, head, tail/*, segmentHead, segmentTail*/ } = props.entity

    const tAttachHead = beatToTime(bpms.value, attachHead.beat)
    const tAttachTail = beatToTime(bpms.value, attachTail.beat)
    const tMid = (tAttachHead + tAttachTail) / 2

    const lMid = (attachHead.lane + attachTail.lane) / 2

    const tHead = beatToTime(bpms.value, head.beat)
    const tTail = beatToTime(bpms.value, tail.beat)

    let d = ''

    if (tHead < tMid) {
        d += getPathD(
            tAttachHead,
            attachHead.lane,
            tMid,
            lMid,
            tHead,
            Math.min(tMid, tTail),
            attachHead.connectorEase === 'inOut' ? 'in' : 'out',
        )
    }

    if (tTail > tMid) {
        d += getPathD(
            tMid,
            lMid,
            tAttachTail,
            attachTail.lane,
            Math.max(tHead, tMid),
            tTail,
            attachHead.connectorEase === 'inOut' ? 'out' : 'in',
        )
    }

    // const { fill, gradient } = getColor(id, segmentHead, segmentTail, tHead, tTail)
    const fill = "#ffffff55"

    return {
        path: {
            d,
            fill,
        },
        // gradient,
    }
})
</script>

<template>
    <!--ConnectorGradient v-if="graphic.gradient" v-bind="graphic.gradient" /-->
    <path v-bind="graphic.path" />
    <!--ConnectorFakeMarker :entity /-->
</template>
