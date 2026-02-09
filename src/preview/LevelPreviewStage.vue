<script setup lang="ts">
import { computed } from 'vue'
import { view } from '../editor/view'
// import { rotate, resize, transparent, moveX, moveY } from './events'
import { getLane, getLaneCenter, laneLayout } from './lane'
import { transform } from './projection'
// import { stages } from '../history/stages'
import { Vec } from "./Vec"

const stages2 = computed(() =>
    [0,1,2,3,4,5,6,7,8]
    .map(lane => {
        // lane -= 4
		// let angle = (210 + 120 * lane / (9 - 1)) * Math.PI / 180;
		//       const v = new Vec(-1, 0).rotate(angle)
		//       const layout = new Vec(0, 0).add(v.x, v.y)
        lane -= 4
        const v = new Vec(0, 1).rotate(-lane * Math.PI / 12)
        const layout = new Vec(0, 0).add(v.x, v.y)
		      return {
		          cx: layout.x,
		          cy: layout.y
		      }
//            const [l, r] = getLane(lane, 1, shift.value, rotate.value)

//            const targetTime = timeToScaledTime(timeScales.value, beatToTime(bpms.value, beat))
//            const z = unlerp(targetTime - noteDuration.value, targetTime, scaledTimes.value.min)

            // const points = new Quad().rotate((rotate(id).value % 360) / 180 * Math.PI).mul(resize(id).value / 2).translate(moveX(id).value, moveY(id).value).toPoints()
            //
            // return {
            //     points,
            //     opacity: transparent(id).value
            // }
        })
)
// const lanes = computed(() =>
//     ([{
//         points: laneLayout(...getLane(0, 1, shift.value, rotate.value)),
//         centers: [...Array(4).keys()].map((i) => 
//             transform(getLaneCenter(i, 1, shift.value, rotate.value), 0)
//     )}]))

</script>

<template>
    <template v-for="({ cx, cy }, index) in stages2" :key="index">
        <circle :cx :cy :r="0.05" fill="#fff" />
        <!--polygon :points stroke="white" :stroke-opacity="opacity" /-->
    </template>
    <path :d="`M ${stages2[0]!.cx} ${stages2[0]!.cy} A 1 1 0 0 0 ${stages2[8]!.cx} ${stages2[8]!.cy}`" stroke="#fff" stroke-width="0.025" fill="none" />
    <circle :cx="0" :cy="0" :r="0.075" stroke="#ffffff44" stroke-width="0.01" />
    <svg :x="-0.075 / 2" :y="-0.075 / 2" :width="0.075" :height="0.075" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--! Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. -->
        <path
            d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7l0 72 0 264c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L448 147 192 223.8 192 432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L128 200l0-72c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"
            fill="#fff"
        />
    </svg>
    <!--template v-for="({ points, centers }, index) in lanes" :key="index">
        <polygon :points stroke="white" />
        <template v-for="({ x, y }, i) in centers" :key="i">
            <text
                :x
                :y="-y"
                text-anchor="middle"
                dominant-baseline="middle"
                transform="scale(1, -1)"
                fill="white"
                :fill-opacity="i === view.hoverLane ? 1 : 0.5"
            >
                {{ i }}
            </text>
        </template>
    </template-->
</template>
