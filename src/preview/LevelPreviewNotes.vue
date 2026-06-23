<script setup lang="ts">
import { computed } from 'vue'
import { beats, keys, scaledTimes } from '.'
// import { colors } from '../colors'
import { bpms } from '../history/bpms'
import { cullEntities } from '../history/store'
import { timeScales } from '../history/timeScales'
import { beatToTime, timeToBeat } from '../state/integrals/bpms'
import { timeToScaledTime } from '../state/integrals/timeScales'
import { lerp, unlerp } from '../utils/math'
import { state } from "../history"
// import { rotate, resize, moveX, moveY } from './events'
import { getLane } from './lane'
import { noteDuration, approachPos, approachSize, arrows } from './note'
import { Vec } from "./Vec"
import { view } from '../editor/view'

const notes = computed(() =>
    [...cullEntities('note', keys.value.min, keys.value.max)]
        .filter(({ beat, groupId, noteType }) => {
            return (beat >= timeToBeat(bpms.value, view.cursorTime))
                && (timeToScaledTime(timeScales.value.get(groupId)!, beatToTime(bpms.value, beat)) < scaledTimes(groupId).value.max)
                && noteType !== 'anchor'
        })
        .sort((a, b) => b.beat - a.beat)
        .map(({ beat, lane, groupId, noteType, flickDirection, slideId }) => {
        // let layout = new Quad(
        //     {x: -size * (1 + 0.08 * Math.abs((lane % 1) - 0.5 - size / 2)),
        //     y: -0.02},
        //     {x: -size * (1 - 0.08 * Math.abs((lane % 1) - 0.5 - size / 2)),
        //     y: 0.02},
        //     {x: size * (1 - 0.08 * Math.abs((lane % 1) - 0.5 + size / 2)),
        //     y: 0.02},
        //     {x: size * (1 + 0.08 * Math.abs((lane % 1) - 0.5 + size / 2)),
        //         y: -0.02}
        // )
        //
            const targetTime = timeToScaledTime(timeScales.value.get(groupId)!, beatToTime(bpms.value, beat))
        //     //const z = unlerp(targetTime - noteDuration.value, targetTime, scaledTimes.value.min)
        //
        const ns = state.value.groups.get(groupId)?.forceNoteSpeed

        const s = unlerp(targetTime - (ns ? 5 / ns : noteDuration.value), targetTime, scaledTimes(groupId).value.min)

        const size = approachSize(s - 1)
        //
        // const angle = (rotate(groupId).value % 360) / 180 * Math.PI
        // const size2 = resize(groupId).value
        // const posX = moveX(groupId).value
        // const posY = moveY(groupId).value
        //
        // // console.log(s, angle, size2, posX, posY)
        //
        // const rotate2 = angle + (Math.PI / 2 * Math.floor(lane))
        // let cx = posX - size2 * s / 2 * Math.sin(-rotate2) + ((lane % 1) - 0.5) * size2 * s * Math.cos(rotate2)
        // let cy = posY - size2 * s / 2 * Math.cos(rotate2) - ((lane % 1) - 0.5) * size2 * s * Math.sin(-rotate2)
        //
        // // console.log(rotate2, cx, cy)
        //
        // const points = layout.mul(size2 / 2 * s).rotate(rotate2).translate(cx, cy).toPoints()

        const v = new Vec(0, 1).rotate(-lane * Math.PI / 12)
        const layout = new Vec(0, 0).add(v.x, v.y).mul(approachPos(s - 1))

        const slideNotes = state.value.store.slides.note.get(slideId)

        let color = flickDirection === 'left' ? "#f00" : flickDirection === 'right' ? "#f90" : flickDirection === "up" ? "#ff50cb" : flickDirection === 'down' ? "#909" : "#00f"

        if (slideNotes.length > 1 && flickDirection === 'none') color = "#0f0"

        const isTick = !(slideNotes[0].lane === lane && slideNotes[0].beat === beat && slideNotes[0].groupId === groupId) && flickDirection === "none"
        
        // const a = -lane * (Math.PI / 8) * (180 / Math.PI)

        // console.log(layout)

        return {
            cx: layout.x,
            cy: layout.y,
            s: isTick ? size * 0.8 : size,
            stroke: color,
            color: isTick ? "#00000000" : color,
            arrows: flickDirection !== 'none' ? arrows[flickDirection] : null
        }

            // return {
            //     points
            // }
        }),
)
</script>

<template>
    <g stroke="white" stroke-width="0">
        <!--polygon v-for="(polygon, index) in tapNotes" :key="index" v-bind="polygon" /-->
        <template v-for="({ cx, cy, s, stroke, color, arrows }, index) in notes" :key="index">
            <circle :cx :cy :r="0.1 * s" :stroke :fill="color" :stroke-width="0.02 * s"/>
            <svg v-if="arrows" :x="cx - 0.1 * s" :y="cy - 0.1 * s" :width="0.2 * s" :height="0.2 * s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                <path fill="#fff" :d="arrows" />
            </svg>
        </template>
    </g>
</template>
