import type { GroupId } from './groups'

export type NoteType = 'default' | 'anchor' /*| 'trace' | 'anchor' | 'damage'/* | 'forceTick' | 'forceNonTick'*/

export const FlickDirection = ["none", "left", "right", "up", "down"] as const
export type FlickDirection = typeof FlickDirection[number]
/*    | 'none'
    | 'left'
    | 'right'
    | 'up'
    | 'down'
    | 'up'
    | 'upLeft'
    | 'upRight'
    | 'down'
    | 'downLeft'
    | 'downRight'*/

export type NoteSfx =
    | 'default'
    | 'none'
    | 'alt2'
    | 'alt3'
    | 'alt4'
//     | 'normalTap'
//     | 'criticalTap'
//     | 'normalFlick'
//     | 'criticalFlick'
//     | 'normalTrace'
//     | 'criticalTrace'
//     | 'normalTick'
//     | 'criticalTick'
//     | 'damage'

// export type ConnectorType = 'active' | 'guide'

export type ConnectorEase = 'linear' | 'in' | 'out' | 'inOut' | 'outIn' | 'none'

export type ConnectorSfx =
    | 'default'
    | 'none'
    | 'alt2'
    | 'alt3'
    | 'alt4'

// export type ConnectorGuideColor =
//     | 'neutral'
//     | 'red'
//     | 'green'
//     | 'blue'
//     | 'yellow'
//     | 'purple'
//     | 'cyan'
//     | 'black'

// export type ConnectorLayer = 'top' | 'bottom'

export type ShortenEarlyWindow = 'none' | 'perfect' | 'great' | 'good'

export type NoteObject = {
    groupId: GroupId
    beat: number
    noteType: NoteType
    isAttached: boolean
    lane: number
    // spawnLane: number
    // left: number
    // size: number
    // isCritical: boolean
    flickDirection: FlickDirection
    shortenEarlyWindow: ShortenEarlyWindow
    // isFake: boolean
    sfx: NoteSfx
    holdSfx: ConnectorSfx
    // isConnectorSeparator: boolean
    // connectorType: ConnectorType
    connectorEase: ConnectorEase
    // connectorActiveIsCritical: boolean
    // connectorActiveIsFake: boolean
    // connectorGuideColor: ConnectorGuideColor
    // connectorGuideAlpha: number
    // connectorLayer: ConnectorLayer
}
