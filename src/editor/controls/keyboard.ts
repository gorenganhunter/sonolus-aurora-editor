import { onMounted, onUnmounted, reactive } from 'vue'
import { modals } from '../../modals'
import { settings, type KeyboardShortcut } from '../../settings'
import { commands, type CommandName } from '../commands'
import { currentSidebar } from '../sidebars'
import { type ConnectorEase, type FlickDirection, type NoteSfx, type NoteType, type ShortenEarlyWindow } from '../../chart/note'
import { toolName } from '../tools'

type NoteModifier = {
    noteType?: NoteType
    flickDirection?: FlickDirection
    shortenEarlyWindow?: ShortenEarlyWindow
    isAttached?: boolean
    sfx?: NoteSfx
    connectorEase?: ConnectorEase
}

export const noteModifier = reactive<NoteModifier>({})

const onKeydown = (event: KeyboardEvent) => {
    if (modals.length) return
    if (currentSidebar.value?.contains(document.activeElement)) return

    if (["select", "note", "slide"].includes(toolName.value)) {
        for (const property in settings.noteModifierKey) {
            if (!settings.noteModifierKey[property]) continue
            for (const value in settings.noteModifierKey[property]) {
                const sc = settings.noteModifierKey[property][value] as KeyboardShortcut | undefined
                if (!sc) continue

                if (!!sc.ctrl !== event.ctrlKey || !!sc.shift !== event.shiftKey || !!sc.alt !== event.altKey || sc.key !== event.key) continue
                noteModifier[property] = value === "true" ? true : value === "false" ? false : value
            }
        }
        // console.log(noteModifier)
    }

    for (const [name, sc] of Object.entries(settings.keyboardShortcuts) as [
        CommandName,
        KeyboardShortcut,
    ][]) {
        if (!!sc.ctrl !== event.ctrlKey || !!sc.shift !== event.shiftKey || !!sc.alt !== event.altKey || sc.key !== event.key) continue

        void commands[name].execute()
    }
}

const onKeyup = (event: KeyboardEvent) => {
    if (modals.length) return
    if (currentSidebar.value?.contains(document.activeElement)) return

    for (const [p, v] of Object.entries(noteModifier)) {
        if (v !== undefined) {
            for (const [v2, sc] of Object.entries(settings.noteModifierKey[p]) as [typeof v, KeyboardShortcut | undefined][]) {
                if (!sc) continue
                if (v !== v2) continue
                if (!!sc.ctrl !== event.ctrlKey || !!sc.shift !== event.shiftKey || !!sc.alt !== event.altKey || sc.key !== event.key) noteModifier[p] = undefined
            }
        }
    }
}

export const useKeyboardControl = () => {
    onMounted(() => {
        addEventListener('keydown', onKeydown)
        addEventListener('keyup', onKeyup)
    })

    onUnmounted(() => {
        removeEventListener('keydown', onKeydown)
        removeEventListener('keyup', onKeyup)
    })
}
