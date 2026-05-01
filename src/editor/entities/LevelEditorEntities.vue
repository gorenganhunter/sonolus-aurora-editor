<script lang="ts">
const layers = {
    waypoint: 0,
    timeScale: 1,
    bpm: 2,

    connector: 10,

    note: 20,
}

const getLayer = (entity: Entity) => {
    switch (entity.type) {
        case 'bpm':
        case 'timeScale':
        case 'waypoint':
        case 'note':
            return layers[entity.type]
        case 'connector':
            return layers.connector
    }
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { entityComponents } from '.'
import { beats, keys } from '..'
import { selectedEntities } from '../../history/selectedEntities'
import { cullAllEntities } from '../../history/store'
import { settings } from '../../settings'
import type { Entity } from '../../state/entities'
import { hoveredEntities, view } from '../view'

const isEntityVisible = (entity: Entity) => {
    if (view.groupId === undefined) return true

    switch (entity.type) {
        case 'bpm':
        case 'waypoint':
            return true
        case 'timeScale':
        case 'note':
            return entity.groupId === view.groupId
        case 'connector':
            return entity.head.groupId === view.groupId || entity.tail.groupId === view.groupId
    }
}

const culledEntities = computed(() => [...cullAllEntities(keys.value.min, keys.value.max)])

const visibleEntities = computed(() =>
    culledEntities.value.filter((entity) => {
        switch (entity.type) {
            case 'bpm':
            case 'timeScale':
            case 'waypoint':
            case 'note':
                return entity.beat >= beats.value.min && entity.beat <= beats.value.max
            case 'connector':
                return entity.attachHead.beat <= beats.value.max && entity.attachTail.beat >= beats.value.min
        }
    }),
)

const visibleEntityInfos = computed(() => {
    let entities = visibleEntities.value.map((entity) => ({
        entity,
        isSelected: selectedEntities.value.includes(entity),
        isHovered: hoveredEntities.value.includes(entity),
        isVisible: isEntityVisible(entity),
        layer: getLayer(entity),
    }))

    if (!settings.showOtherGroups) {
        entities = entities.filter((entity) => entity.isVisible)
    }

    return entities.sort(
        (a, b) =>
            +a.isSelected - +b.isSelected || a.layer - b.layer || b.entity.beat - a.entity.beat,
    )
})
</script>

<template>
    <component
        :is="entityComponents[entity.type]"
        v-for="{ entity, isSelected, isHovered, isVisible } in visibleEntityInfos"
        :key="entity as never"
        :entity="entity as never"
        :is-highlighted="isSelected || isHovered"
        :opacity="isVisible ? 1 : 0.25"
    />
</template>
