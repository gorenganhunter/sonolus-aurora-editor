// import type { TimeScaleEase } from '../chart'

import type { KeyboardShortcut } from "../settings"

export const formatIntegerTime = (time: number) =>
    `${`${Math.floor(time / 60)}`.padStart(2, '0')}:${`${time % 60}`.padStart(2, '0')}`

export const formatTime = (time: number) =>
    `${`${Math.floor(time / 60)}`.padStart(2, '0')}:${(time % 60).toFixed(3).padStart(6, '0')}`

export const formatIntegerBeat = (beat: number) => `${beat}`

export const formatBeat = (beat: number) => beat.toFixed(3)

export const formatBpm = (value: number) => `${value}`

export const formatTimeScale = (value: number/*, skip: number, ease: TimeScaleEase*/) => {
    let text = `${value}x`
    //
    // if (skip) {
    //     if (skip > 0) text += '+'
    //     text += `${skip}`
    // }
    //
    // if (ease === 'linear') {
    //     text += '^'
    // }

    return text
}

export const formatShortcut = (shortcut: KeyboardShortcut | undefined) => {
    if (!shortcut) return shortcut
    let key = shortcut.key === ' ' ? 'Space' : shortcut.key

    return (shortcut.ctrl && key !== "Control" ? "Ctrl and " : "") + (shortcut.shift && key !== "Shift" ? "Shift and " : "") + (shortcut.alt && key !== "Alt" ? "Alt and " : "") + key
}
