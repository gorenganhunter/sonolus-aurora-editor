<script setup lang="ts">
import { computed } from 'vue'
import { i18n } from '../../i18n'
import BaseModal from '../../modals/BaseModal.vue'
import HelpSection from './HelpSection.vue'
import { state } from '../../history'
import { beatToTime } from '../../state/integrals/bpms'

const data = computed(() => {
    const temp = {
        info: {
            level: 0,
            hp: {
                current: state.value.hp,
                recommend: 1
            }
        },
        note: {
            tap: 0,
            hold: 0,
            tick: 0,
            flick: 0,
            total: 0
        }
    }
    let firstBeat = Infinity
    let lastBeat = -Infinity
    let duration = 0
    for (const notes of state.value.store.slides.note.values()) {
        Array.from(notes).forEach((n, i, arr) => {
            // console.log(arr)
            if (n.beat < firstBeat) firstBeat = n.beat
            if (n.beat > lastBeat) lastBeat = n.beat

            if (n.noteType === "anchor") return
            temp.note.total++
            
            if (n.flickDirection !== "none") {
                temp.note.flick++
                return
            }

            if (i) temp.note.tick++
            else if (arr.length > 1) temp.note.hold++
            else temp.note.tap++
        })
    }
    if (firstBeat !== Infinity && lastBeat !== -Infinity) {
        duration = beatToTime(state.value.bpms, lastBeat) - beatToTime(state.value.bpms, firstBeat)
    }
    temp.info.hp.recommend = Math.floor(duration / 6) + 1
    const noteW = temp.note.total - temp.note.tick * 0.25
    temp.info.level = Math.round((-44 + 12.2 * Math.log(noteW / (duration / 60))) * 100) / 100
    return temp
})
</script>

<template>
    <BaseModal :title="i18n.commands.stats.modal.title">
        <HelpSection :title="i18n.commands.stats.modal.chartInfo">
            <li>{{ i18n.commands.stats.modal.level + " = " + data.info.level }}</li>
            <li>{{ i18n.commands.stats.modal.hp + " = " + data.info.hp.current + ` (Recommended = ${data.info.hp.recommend})` }}</li>
        </HelpSection>
        <HelpSection :title="i18n.commands.stats.modal.noteCounts">
            <li>{{ i18n.commands.stats.modal.taps + " = " + data.note.tap }}</li>
            <li>{{ i18n.commands.stats.modal.flicks + " = " + data.note.flick }}</li>
            <li>{{ i18n.commands.stats.modal.holdStarts + " = " + data.note.hold }}</li>
            <li>{{ i18n.commands.stats.modal.holdTicks + " = " + data.note.tick }}</li>
            <li>{{ i18n.commands.stats.modal.totalCombo + " = " + data.note.total }}</li>
        </HelpSection>
    </BaseModal>
</template>
