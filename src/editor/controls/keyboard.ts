import { onMounted, onUnmounted } from 'vue'
import { modals } from '../../modals'
import { settings, type KeyboardShortcut } from '../../settings'
import { commands, type CommandName } from '../commands'
import { currentSidebar } from '../sidebars'

const onKeydown = (event: KeyboardEvent) => {
    if (modals.length) return
    if (currentSidebar.value?.contains(document.activeElement)) return

    for (const [name, sc] of Object.entries(settings.keyboardShortcuts) as [
        CommandName,
        KeyboardShortcut,
    ][]) {
        if (sc.ctrl !== event.ctrlKey || sc.shift !== event.shiftKey || sc.alt !== event.altKey || sc.key !== event.key) continue

        void commands[name].execute()
    }
}

export const useKeyboardControl = () => {
    onMounted(() => {
        addEventListener('keydown', onKeydown)
    })

    onUnmounted(() => {
        removeEventListener('keydown', onKeydown)
    })
}
