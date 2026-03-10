<script setup lang="ts">
import { ref } from 'vue'
import { i18n } from '../../../i18n'
import type { BpmObject, FlickDirection, NoteObject, TimeScaleObject } from '../../../chart'
import FormModal from '../../../modals/form/FormModal.vue'
import MultiWaypointField from '../../../modals/form/MultiWaypointField.vue'
import MultiToggleField from '../../../modals/form/MultiToggleField.vue'
import { getInStoreGrid } from '../../../state/store/grid'
import { store, cullAllEntities, walkAllEntities } from '../../../history/store'
import { beatToKey } from '../../../state/store/grid'
import { focusViewAtBeat } from '../../view'
import { beatToTime } from '../../../state/integrals/bpms'
import { formatBeat, formatTime } from '../../../utils/format'
import { getStoreEntities } from '../../../levelData/entities/serialize'
import { pushState, replaceState, state } from '../../../history'
import { selectedEntities } from '../../../history/selectedEntities'
import type { Entity } from '../../../state/entities'
import { addBpm, removeBpm } from '../../../state/mutations/bpm'
import { addNote, removeNote } from '../../../state/mutations/slides/note'
import { addTimeScale, removeTimeScale } from '../../../state/mutations/timeScale'
import { toBpmEntity, type BpmEntity } from '../../../state/entities/bpm'
import { createSlideId } from '../../../state/entities/slides'
import { toNoteEntity, type NoteEntity } from '../../../state/entities/slides/note'
import { toTimeScaleEntity, type TimeScaleEntity } from '../../../state/entities/timeScale'
import { createTransaction, type Transaction } from '../../../state/transaction'
import { interpolate } from '../../../utils/interpolate'
import { notify } from '../../notification'

let from = ref(undefined)
let to = ref(undefined)
let flip = ref(false)

defineEmits<{
    close: []
}>()

const waypoints = [...getStoreEntities(store.value.grid.waypoint)].sort((a, b) => a.beat - b.beat)

const canRemoves: {
    [T in Entity as T['type']]?: (entity: T) => boolean
} = {
    bpm: (entity) => entity.beat > 0,
    timeScale: (entity) => entity.beat > 0
}

const removes: {
    [T in Entity as T['type']]?: (transaction: Transaction, entity: T) => void
} = {
    bpm: removeBpm,
    timeScale: removeTimeScale,

    note: removeNote
}

const canRemove = (entity: Entity) => canRemoves[entity.type]?.(entity as never) ?? true

const toMovedBpmObject = (entity: BpmEntity, beat: number): BpmObject => ({
    beat,
    bpm: entity.bpm,
})

const toMovedTimeScaleObject = (entity: TimeScaleEntity, beat: number): TimeScaleObject => ({
    group: entity.group,
    beat,
    timeScale: entity.timeScale,
})

const flippedFlickDirections: Record<FlickDirection, FlickDirection> = {
    none: 'none',
    left: 'right',
    right: 'left',
    up: 'up',
    down: 'down',
}

const toMovedNoteObject = (
    entity: NoteEntity,
    beat: number,
    flip: boolean,
): NoteObject => ({
    ...entity,
    beat,
    lane: flip
        ? -entity.lane
        : entity.lane,
    flickDirection: flip ? flippedFlickDirections[entity.flickDirection] : entity.flickDirection,
})

type Paste<T extends Entity> = (
    transaction: Transaction,
    entity: T,
    beat: number,
    flip: boolean,
) => Entity[] | undefined

const pastes: {
    [T in Entity as T['type']]?: Paste<T>
} = {
    bpm: (transaction, entity, beat) => {
        const object = toMovedBpmObject(entity, beat)

        const overlap = getInStoreGrid(transaction.store.grid, 'bpm', object.beat)?.find(
            (entity) => entity.beat === object.beat,
        )
        if (overlap) removeBpm(transaction, overlap)

        return addBpm(transaction, object)
    },
    timeScale: (transaction, entity, beat) => {
        const object = toMovedTimeScaleObject(entity, beat)

        const overlap = getInStoreGrid(transaction.store.grid, 'timeScale', object.beat)?.find(
            (entity) => entity.beat === object.beat && entity.group === object.group,
        )
        if (overlap) removeTimeScale(transaction, overlap)

        return addTimeScale(transaction, object)
    },

    note: (transaction, entity, beat, flip) => {
        const object = toMovedNoteObject(entity, beat, flip)

        return addNote(transaction, entity.slideId, object)
    },
}

const getSlides = (entities: Entity[]) => {
    const selectedNotes = entities.filter((entity) => entity.type === 'note')
    const selectedNotesSet = new Set(selectedNotes)

    return [...new Set(selectedNotes.map((note) => note.slideId))].map((slideId) => {
        const notes = store.value.slides.note.get(slideId)
        if (!notes) throw new Error('Unexpected notes not found')

        return notes.filter((note) => selectedNotesSet.has(note))
    })
}

const copyWaypoints = () => {
    if (from.value === undefined || to.value === undefined) return

    const minWpC = waypoints[from.value]
    const maxWpC = waypoints[from.value + 1]

    let minBeatC = minWpC ? minWpC.beat : 0
    let maxBeatC = maxWpC ? maxWpC.beat : Number.NEGATIVE_INFINITY

    if (maxBeatC < 0) {
        walkAllEntities((entity) => {
            if (entity.beat > maxBeatC) maxBeatC = entity.beat
        })

        maxBeatC += 1
    }

    const entitiesC = [...cullAllEntities(beatToKey(minBeatC), beatToKey(maxBeatC))].filter(({ beat, type }) => (beat >= minBeatC && beat < maxBeatC)).filter(e => (["note", "bpm", "timeScale"].includes(e.type)))

    const minWpR = waypoints[to.value]
    const maxWpR = waypoints[to.value + 1]

    let minBeatR = minWpR ? minWpR.beat : 0
    let maxBeatR = maxWpR ? maxWpR.beat : Number.NEGATIVE_INFINITY

    if (maxBeatR < 0) {
        walkAllEntities((entity) => {
            if (entity.beat > maxBeatR) maxBeatR = entity.beat
        })

        maxBeatR += 1
    }

    const entitiesR = [...cullAllEntities(beatToKey(minBeatR), beatToKey(maxBeatR))].filter(({ beat, type }) => (beat >= minBeatR && beat < maxBeatR)).filter(e => (["note", "bpm", "timeScale"].includes(e.type))).filter(canRemove)

    const transaction = createTransaction(state.value)

    const slides = getSlides(entitiesC)
    const copied = [...entitiesC.filter(e => (e.type !== "note")), ...slides.flatMap(slide => {
        const slideId = createSlideId()
        return slide.map((note) => toNoteEntity(slideId, note))
    })]

    for (const entity of entitiesR) {
        removes[entity.type]?.(transaction, entity as never)
    }

    const beatOffset = minBeatR - minBeatC
    
    const selectedEntities: Entity[] = []
    for (const entity of copied) {
        const beat = entity.beat + beatOffset
        if (beat < 0) continue
        if (maxWpR && beat >= maxBeatR) continue

        const result = pastes[entity.type]?.(
            transaction,
            entity as never,
            beat,
            flip.value
        )
        if (!result) continue

        selectedEntities.push(...result)
    }

    pushState(
        interpolate(() => i18n.value.tools.paste.pasted, `${selectedEntities.length}`),
        transaction.commit(selectedEntities),
    )

    notify(interpolate(() => i18n.value.tools.paste.pasted, `${selectedEntities.length}`))
}

</script>

<template>
    <FormModal :title="i18n.waypoint.copy.title" @close="$emit('close')" @submit="() => { copyWaypoints(); $emit('close') }">
        <MultiWaypointField v-model="from" :label="i18n.waypoint.copy.from" />
        <MultiWaypointField v-model="to" :label="i18n.waypoint.copy.to" />
        <MultiToggleField v-model="flip" :label="i18n.waypoint.copy.flip" />
        <!--div class="flex flex-col gap-2">
            <button
                v-for="(modal, name) in tools"
                :key="name"
                class="rounded-full bg-button px-4 py-1 shadow-md transition-colors hover:shadow-accent active:bg-accent active:text-button"
                @click="changeModal(modal)"
            >
                {{ i18n.waypoint[name].title }}
            </button>
        </div-->
    </FormModal>
</template>
