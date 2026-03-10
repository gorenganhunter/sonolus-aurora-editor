<script setup lang="ts">
import { computed } from 'vue'
import { i18n } from '../../i18n'
import BaseModal from '../../modals/BaseModal.vue'
import HelpSection from './HelpSection.vue'
import { state } from '../../history'
import { store, cullAllEntities, walkAllEntities } from '../../history/store'
import { beatToTime } from '../../state/integrals/bpms'
import { beatToKey } from '../../state/store/grid'
import { getStoreEntities } from '../../levelData/entities/serialize'
import { formatTime } from '../../utils/format'

const waypoints = [...getStoreEntities(store.value.grid.waypoint)].sort((a, b) => a.beat - b.beat)

type WaypointData = {
    name: string
    beat: number
    sec: number
    beats: number
    secs: number
    level: number
    tap: number
    hold: number
    tick: number
    flick: number
    total: number
    bpm: number
    timeScale: number
}

const data = computed(() => {
    const temp = {
        global: {
            info: {
                beats: 0,
                secs: 0,
                level: 0,
                easiest: "",
                hardest: "",
                hp: {
                    current: state.value.hp,
                    recommend: 1
                }
            },
            entities: {
                tap: 0,
                hold: 0,
                tick: 0,
                flick: 0,
                total: 0,
                bpm: 0,
                timeScale: 0,
                waypoint: 0
            }
        },
        waypoints: [] as WaypointData[]
    }

    let firstBeat = Infinity
    let lastBeat = -Infinity
    let duration = 0
    for (const notes of store.value.slides.note.values()) {
        Array.from(notes).forEach((n, i, arr) => {
            // console.log(arr)
            if (n.beat < firstBeat) firstBeat = n.beat
            if (n.beat > lastBeat) lastBeat = n.beat

            if (n.noteType === "anchor") return
            temp.global.entities.total++
            
            if (n.flickDirection !== "none") {
                temp.global.entities.flick++
                return
            }

            if (i) temp.global.entities.tick++
            else if (arr.length > 1) temp.global.entities.hold++
            else temp.global.entities.tap++
        })
    }
    temp.global.entities.bpm = store.value.grid.bpm.size
    temp.global.entities.timeScale = store.value.grid.timeScale.size
    temp.global.entities.waypoint = store.value.grid.waypoint.size
    if (firstBeat !== Infinity && lastBeat !== -Infinity) {
        temp.global.info.beats = lastBeat - firstBeat
        duration = beatToTime(state.value.bpms, lastBeat) - beatToTime(state.value.bpms, firstBeat)
        temp.global.info.secs = duration
    }
    temp.global.info.hp.recommend = Math.floor(duration / 6) + 1
    const noteW = temp.global.entities.total - temp.global.entities.tick * 0.25
    temp.global.info.level = Math.round((-44 + 12.2 * Math.log(noteW / (duration / 60))) * 100) / 100

    let easiest = Infinity
    let hardest = -Infinity

    for (const [i, wp] of Object.entries(waypoints)) {
        const wd: WaypointData = {
            name: wp.name,
            beat: wp.beat,
            sec: beatToTime(state.value.bpms, wp.beat),
            beats: 0,
            secs: 0,
            level: 0,
            tap: 0,
            hold: 0,
            tick: 0,
            flick: 0,
            total: 0,
            bpm: 0,
            timeScale: 0,
        }

        const minWp = wp
        const maxWp = waypoints[parseInt(i) + 1]

        let minBeat = minWp.beat
        let maxBeat = maxWp ? maxWp.beat : Number.NEGATIVE_INFINITY

        if (maxBeat >= 0) {
            wd.beats = maxBeat - minBeat
            wd.secs = beatToTime(state.value.bpms, maxBeat) - beatToTime(state.value.bpms, minBeat)
        } else {
            walkAllEntities((entity) => {
                if (entity.beat > maxBeat) maxBeat = entity.beat
            })
            wd.beats = maxBeat - minBeat
            wd.secs = beatToTime(state.value.bpms, maxBeat) - beatToTime(state.value.bpms, minBeat)
            maxBeat += 1
        }

        const entities = [...cullAllEntities(beatToKey(minBeat), beatToKey(maxBeat))].filter(({ beat, type }) => (beat >= minBeat && beat < maxBeat))
        for (const notes of store.value.slides.note.values()) {
            Array.from(notes).forEach((n, i, arr) => {
                // console.log(arr)
                if (n.beat < minBeat) return
                if (n.beat >= maxBeat) return

                if (n.noteType === "anchor") return
                wd.total++
                
                if (n.flickDirection !== "none") {
                    wd.flick++
                    return
                }

                if (i) wd.tick++
                else if (arr.length > 1) wd.hold++
                else wd.tap++
            })
        }
        wd.bpm = entities.filter(e => e.type === "bpm").length
        wd.timeScale = entities.filter(e => e.type === "timeScale").length
        const entitiesW = wd.total - wd.tick * 0.25
        wd.level = Math.round((-44 + 12.2 * Math.log(entitiesW / (wd.secs / 60))) * 100) / 100

        if (wd.level < easiest) {
            easiest = wd.level
            temp.global.info.easiest = `${wp.name} (${wd.level})`
        }
        if (wd.level > hardest) {
            hardest = wd.level
            temp.global.info.hardest = `${wp.name} (${wd.level})`
        }

        temp.waypoints.push(wd)
    }

    return temp
})
</script>

<template>
    <BaseModal :title="i18n.commands.stats.modal.title">
        <h1 class="text-center my-2 font-bold">{{ i18n.commands.stats.modal.global }}</h1>
        <HelpSection :title="i18n.commands.stats.modal.chartInfo">
            <li>{{ i18n.commands.stats.modal.duration + " = " + data.global.info.beats + ` (${formatTime(data.global.info.secs)})` }}</li>
            <li>{{ i18n.commands.stats.modal.hp + " = " + data.global.info.hp.current + ` (Recommended = ${data.global.info.hp.recommend})` }}</li>
            <li>{{ i18n.commands.stats.modal.level + " = " + data.global.info.level }}</li>
            <li>{{ i18n.commands.stats.modal.easiest + " = " + data.global.info.easiest }}</li>
            <li>{{ i18n.commands.stats.modal.hardest + " = " + data.global.info.hardest }}</li>
        </HelpSection>
        <HelpSection :title="i18n.commands.stats.modal.entities">
            <li>{{ i18n.commands.stats.modal.taps + " = " + data.global.entities.tap }}</li>
            <li>{{ i18n.commands.stats.modal.flicks + " = " + data.global.entities.flick }}</li>
            <li>{{ i18n.commands.stats.modal.holdStarts + " = " + data.global.entities.hold }}</li>
            <li>{{ i18n.commands.stats.modal.holdTicks + " = " + data.global.entities.tick }}</li>
            <li>{{ i18n.commands.stats.modal.totalCombo + " = " + data.global.entities.total }}</li>
            <li>{{ i18n.commands.stats.modal.bpms + " = " + data.global.entities.bpm }}</li>
            <li>{{ i18n.commands.stats.modal.timeScales + " = " + data.global.entities.timeScale }}</li>
            <li>{{ i18n.commands.stats.modal.waypoints + " = " + data.global.entities.waypoint }}</li>
        </HelpSection>
        <hr>
        <h1 class="text-center my-2 font-bold">{{ i18n.commands.stats.modal.waypoints }}</h1>
        <HelpSection v-for="({ name, beat, sec, beats, secs, level, tap, hold, tick, flick, total, bpm, timeScale }, i) in data.waypoints" :key="i" :title="name">
            <li>{{ i18n.commands.stats.modal.start + " = " + beat + ` (${formatTime(sec)})` }}</li>
            <li>{{ i18n.commands.stats.modal.duration + " = " + beats + ` (${formatTime(secs)})` }}</li>
            <li>{{ i18n.commands.stats.modal.level + " = " + level }}</li>
            <li>{{ i18n.commands.stats.modal.taps + " = " + tap }}</li>
            <li>{{ i18n.commands.stats.modal.flicks + " = " + flick }}</li>
            <li>{{ i18n.commands.stats.modal.holdStarts + " = " + hold }}</li>
            <li>{{ i18n.commands.stats.modal.holdTicks + " = " + tick }}</li>
            <li>{{ i18n.commands.stats.modal.totalCombo + " = " + total }}</li>
            <li>{{ i18n.commands.stats.modal.bpms + " = " + bpm }}</li>
            <li>{{ i18n.commands.stats.modal.timeScales + " = " + timeScale }}</li>
        </HelpSection>
    </BaseModal>
</template>
