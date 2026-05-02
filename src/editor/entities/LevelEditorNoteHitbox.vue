<script setup lang="ts">
import { computed } from 'vue'
import { bpms } from '../../history/bpms'
import type { NoteEntity } from '../../state/entities/slides/note'
import { beatToTime } from '../../state/integrals/bpms'
import { ups } from '../view'
import { store } from '../../history/store'

const props = defineProps<{
    entity: NoteEntity
}>()

const time = computed(() => beatToTime(bpms.value, props.entity.beat))
const infos = computed(() => store.value.slides.info.get(props.entity.slideId))

const type = computed(() => {
    const { entity } = props

    if (entity.noteType === 'anchor') return 'anchor'

    // if (entity.noteType === 'damage') return 'damage'
    //
    // if (entity.noteType === 'trace') return 'trace'
    //
    // if (entity.noteType === 'forceTick') return 'tick'
    if (entity.flickDirection !== "none") return 'single'

    if (!infos.value) return 'single'

    const infoEntity = entity.useInfoOf ?? entity
    const index = infos.value.findIndex((info) => info.note === infoEntity)
    if (index !== -1) {
        const info = infos.value[index]
        // console.log(entity, info)
        if (infos.value.length === 1) return 'single'

        if (index === 0) return 'head'
        //
        // if (info.segmentTail === infoEntity) return 'tail'

        if (infoEntity.noteType === 'default') return 'tick'

        return 'single'
    }

    if (!infos.value.length) return 'single'

    let isActive = true
    let i = 0
    // for (; i < infos.value.length; i++) {
    //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //     const { note } = infos.value[i]!
    //
    //     if (entity.beat < note.beat) break
    //
    //     if (i === 0/* || note.isConnectorSeparator*/) {
    //         isActive = note.connectorType === 'active'
    //     }
    // }

    if (isActive) {
        // if (!infos.value[i]) return 'tick'
        //
        // if (entity.isConnectorSeparator && entity.connectorType === 'guide') return 'tail'

        return 'tick'
    } else if (!infos.value[i - 1]) {
        // if (entity.connectorType === 'guide') return 'single'

        return 'head'
    } else {
        if (!infos.value[i]) return 'single'

/*        if (entity.isConnectorSeparator && entity.connectorType === 'active')*/ return 'head'

        return 'single'
    }
})
</script>

<template>
    <rect
        :x="entity.lane - 0.9"
        :y="(time + 10 / 60) * ups"
        :width="1.8"
        :height="3 / 60 * -ups"
        fill="green"
        fill-opacity="0.25"
    />
    <rect
        :x="entity.lane - 0.9"
        :y="(time + 7 / 60) * ups"
        :width="1.8"
        :height="2 / 60 * -ups"
        fill="orange"
        fill-opacity="0.25"
    />
    <rect
        :x="entity.lane - 0.9"
        :y="(time + 5 / 60) * ups"
        :width="1.8"
        :height="2 / 60 * -ups"
        fill="magenta"
        fill-opacity="0.25"
    />
    <rect
        :x="entity.lane - 0.9"
        :y="(time + 3 / 60) * ups"
        :width="1.8"
        :height="6 / 60 * -ups"
        fill="white"
        fill-opacity="0.25"
    />
    <rect
        v-if="entity.shortenEarlyWindow !== 'perfect'"
        :x="entity.lane - 0.9"
        :y="(time - 3 / 60) * ups"
        :width="1.8"
        :height="2 / 60 * -ups"
        fill="magenta"
        fill-opacity="0.25"
    />
    <rect
        v-if="entity.shortenEarlyWindow !== 'perfect' && entity.shortenEarlyWindow !== 'great'"
        :x="entity.lane - 0.9"
        :y="(time - 5 / 60) * ups"
        :width="1.8"
        :height="2 / 60 * -ups"
        fill="orange"
        fill-opacity="0.25"
    />
    <rect
        v-if="entity.shortenEarlyWindow !== 'perfect' && entity.shortenEarlyWindow !== 'great' && entity.shortenEarlyWindow !== 'good' && type !== 'tick'"
        :x="entity.lane - 0.9"
        :y="(time - 7 / 60) * ups"
        :width="1.8"
        :height="3 / 60 * -ups"
        fill="green"
        fill-opacity="0.25"
    />
</template>
