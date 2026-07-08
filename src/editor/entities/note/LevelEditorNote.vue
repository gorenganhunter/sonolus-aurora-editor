<script setup lang="ts">
import { computed } from 'vue'
import { noteComponents } from '.'
import { bpms } from '../../../history/bpms'
import { defaultGroupId, groups } from '../../../history/groups'
import { store } from '../../../history/store'
import { settings } from '../../../settings'
import type { NoteEntity } from '../../../state/entities/slides/note'
import { beatToTime } from '../../../state/integrals/bpms'
import { isViewRecentlyActive, ups } from '../../view'

const props = defineProps<{
    entity: NoteEntity
    isHighlighted: boolean
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
    <g :transform="`translate(${entity.lane}, ${time * ups})`">
        <component :is="noteComponents[type]" :entity :is-highlighted="isHighlighted" />
        <text
            v-if="
                settings.showGroupName &&
                entity.groupId !== defaultGroupId &&
                (isHighlighted || isViewRecentlyActive)
            "
            :x="0.7"
            :y="0.4"
            font-size="0.4"
            text-anchor="start"
            dominant-baseline="middle"
            fill="#0aa"
        >
            {{ groups.get(entity.groupId)?.name }}
        </text>
        <text
            v-if="entity.shortenEarlyWindow !== 'none'"
            :x="0.7"
            :y="-0.4"
            font-size="0.4"
            text-anchor="start"
            dominant-baseline="middle"
            fill="#b00"
        >
            -{{ entity.shortenEarlyWindow }}
        </text>
        <circle
            v-if="entity.marker !== 'none'"
            :cx="-0.4"
            :cy="-0.4"
            :r="0.2"
            :fill="entity.marker === 'danger' ? '#f00' : entity.marker === 'questionable' ? '#ff0' : '#0ff'"
        />
        <text
            v-if="entity.marker !== 'none'"
            :x="-0.4"
            :y="-0.4"
            font-size="0.4"
            text-anchor="middle"
            dominant-baseline="central"
            fill="#000"
        >
            {{ entity.marker === "danger" ? "!" : entity.marker === "questionable" ? "?" : "i" }}
        </text>
        <g transform="translate(-0.4, 0.4) scale(0.5)" v-if="entity.sfx !== 'default' || entity.holdSfx !== 'default'">
            <svg :x="-0.5" :y="-0.5" :width="1" :height="1" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <!--! Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. -->
                <path
                    d="M96 352l-48 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48l48 0 134.1-119.2c6.4-5.7 14.6-8.8 23.1-8.8 19.2 0 34.8 15.6 34.8 34.8l0 378.4c0 19.2-15.6 34.8-34.8 34.8-8.5 0-16.7-3.1-23.1-8.8L96 352z"
                />
            </svg>
            <text
                v-if="entity.sfx !== 'default'"
                :x="0.5"
                :y="0.3"
                font-size="0.5"
                font-weight="bold"
                text-anchor="middle"
                dominant-baseline="central"
                fill="#fff"
            >
                {{ entity.sfx === "none" ? "x" : entity.sfx === "alt2" ? "2" : entity.sfx === "alt3" ? "3" : "4" }}
            </text>
            <text
                v-if="entity.holdSfx !== 'default'"
                :x="0.5"
                :y="-0.3"
                font-size="0.5"
                font-weight="bold"
                text-anchor="middle"
                dominant-baseline="central"
                fill="#fff"
            >
                {{ entity.holdSfx === "none" ? "x" : entity.holdSfx === "alt2" ? "2" : entity.holdSfx === "alt3" ? "3" : "4" }}
            </text>
        </g>
    </g>
</template>