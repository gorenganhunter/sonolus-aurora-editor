<script setup lang="ts">
import { i18n } from '../../../i18n'
import MultiBeatField from '../../../modals/form/MultiBeatField.vue'
import MultiWaypointNameField from '../../../modals/form/MultiWaypointNameField.vue'
import PropertiesModal from '../../../modals/form/PropertiesModal.vue'
import { useSelectedEntitiesProperties } from '../../utils/properties'

const { entities, createModel } = useSelectedEntitiesProperties((entity) => entity.type === 'waypoint')

const beat = createModel('beat')
const name = createModel('name')
</script>

<template>
    <PropertiesModal :title="i18n.tools.waypoint.modal.title">
        <MultiWaypointNameField v-model="name" />
        <MultiBeatField v-if="entities.length === 1" v-model="beat" />
    </PropertiesModal>
</template>
