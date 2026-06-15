import { Type, type Static, type StaticDecode, type TSchema, type TString } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { shallowRef, watch } from 'vue'
import { isCommandName, type CommandName } from './editor/commands'
import { defaultLocale } from './i18n/locale'
import { localizations } from './i18n/localizations'
import { storageGet, storageRemove, storageSet } from './storage'
import { clamp } from './utils/math'

export type KeyboardShortcut = {
    key: string,
    ctrl: boolean,
    shift: boolean,
    alt: boolean
}

const number = (def: number, min: number, max: number) =>
    Type.Transform(Type.Number({ default: def }))
        .Decode((value) => clamp(value, min, max))
        .Encode((value) => value)

const defaultNoteSlidePropertiesSchema = Type.Intersect([
    Type.Partial(
        Type.Object({
            noteType: Type.Union([
                Type.Literal('default'),
                // Type.Literal('trace'),
                Type.Literal('anchor'),
                // Type.Literal('damage'),
                // Type.Literal('forceTick'),
                // Type.Literal('forceNonTick'),
            ]),
            isAttached: Type.Boolean(),
            // size: Type.Number(),
            // isCritical: Type.Boolean(),
            flickDirection: Type.Union([
                Type.Literal('none'),
                Type.Literal('left'),
                Type.Literal('right'),
                Type.Literal('up'),
                Type.Literal('down')
                // Type.Literal('up'),
                // Type.Literal('upLeft'),
                // Type.Literal('upRight'),
                // Type.Literal('down'),
                // Type.Literal('downLeft'),
                // Type.Literal('downRight'),
            ]),
            shortenEarlyWindow: Type.Union([
                Type.Literal('none'),
                Type.Literal('perfect'),
                Type.Literal('great'),
                Type.Literal('good'),
            ]),
            // isFake: Type.Boolean(),
            sfx: Type.Union([
                Type.Literal('default'),
                Type.Literal('none'),
                //     Type.Literal('normalTap'),
                //     Type.Literal('criticalTap'),
                //     Type.Literal('normalFlick'),
                //     Type.Literal('criticalFlick'),
                //     Type.Literal('normalTrace'),
                //     Type.Literal('criticalTrace'),
                //     Type.Literal('normalTick'),
                //     Type.Literal('criticalTick'),
                //     Type.Literal('damage'),
            ]),
            // isConnectorSeparator: Type.Boolean(),
            // connectorType: Type.Union([Type.Literal('active'), Type.Literal('guide')]),
            connectorEase: Type.Union([
                Type.Literal('linear'),
                Type.Literal('in'),
                Type.Literal('out'),
                Type.Literal('inOut'),
                Type.Literal('outIn'),
                Type.Literal('none'),
            ]),
            // connectorActiveIsCritical: Type.Boolean(),
            // connectorActiveIsFake: Type.Boolean(),
            // connectorGuideColor: Type.Union([
            //     Type.Literal('neutral'),
            //     Type.Literal('red'),
            //     Type.Literal('green'),
            //     Type.Literal('blue'),
            //     Type.Literal('yellow'),
            //     Type.Literal('purple'),
            //     Type.Literal('cyan'),
            //     Type.Literal('black'),
            // ]),
            // connectorGuideAlpha: Type.Number(),
            // connectorLayer: Type.Union([Type.Literal('top'), Type.Literal('bottom')]),
        }),
    ),
    Type.Object({
        copyProperties: Type.Boolean({ default: true }),
    }),
])

export type DefaultNoteSlideProperties = Static<typeof defaultNoteSlidePropertiesSchema>

const settingsProperties = {
    showSidebar: Type.Boolean({ default: true }),

    sidebarWidth: Type.Number(),

    previewPosition: Type.Union([Type.Literal('auto'), Type.Literal('top'), Type.Literal('left')]),

    showPreview: Type.Boolean({ default: true }),

    previewNoteSpeed: number(9, 1, 20),

    previewWidth: Type.Number(),

    previewHeight: Type.Number(),

    width: number(14, 10, 20),

    pps: number(1000, 100, 10000),

    locale: Type.Union(
        Object.keys(localizations).map((locale) => Type.Literal(locale)),
        { default: defaultLocale },
    ) as never as TString,

    autoSave: Type.Boolean({ default: true }),

    autoSaveDelay: number(1, 0, 5),

    waveform: Type.Union([Type.Literal('volume'), Type.Literal('fft'), Type.Literal('off')]),

    lockScrollX: Type.Boolean({ default: true }),

    dragToPanY: Type.Boolean({ default: true }),

    dragToPanX: Type.Boolean(),

    autoAddGroup: Type.Boolean({ default: true }),

    showGroupName: Type.Boolean({ default: true }),

    showOtherGroups: Type.Boolean({ default: true }),

    hitboxAsSelectionBox: Type.Boolean({ default: false }),

    toolbar: Type.Transform(
        Type.Array(
            Type.Transform(Type.Array(Type.String()))
                .Decode((values) => values.filter(isCommandName))
                .Encode((values) => values),
            {
                default: [
                    ['stats', 'utilities', 'reset', 'save', 'open'],
                    [
                        'offset',
                        'bgm',
                        'toggleSfxVolume',
                        'toggleBgmVolume',
                        'speedUp',
                        'speedDown',
                        'stop',
                        'play',
                    ],
                    ['flip', 'paste', 'cut', 'copy', 'redo', 'undo'],
                    ['brush', 'eraser', 'deselect', 'select'],
                    ['note4', 'note3', 'note2', 'note1', 'note0', 'note'],
                    ['slide4', 'slide3', 'slide2', 'slide1', 'slide0', 'slide'],
                    ['timeScale', 'bpm'],
                    ['groupPrev', 'groupNext', 'groupAll', 'manageGroups'],
                    ['hp'],
                    [
                        'scrollLeft',
                        'scrollRight',
                        'jumpUp',
                        'scrollPageUp',
                        'scrollUp',
                        'scrollDown',
                        'scrollPageDown',
                        'jumpDown',
                        'waypoint',
                    ],
                    [
                        'snapping',
                        'divisionCustom',
                        'division16',
                        'division12',
                        'division8',
                        'division6',
                        'division4',
                        'division3',
                        'division2',
                        'division1',
                    ],
                    ['zoomXIn', 'zoomXOut', 'zoomYIn', 'zoomYOut'],
                ] satisfies CommandName[][],
            },
        ),
    )
        .Decode((values) => values.filter((value) => value.length))
        .Encode((values) => values),

    playBgmVolume: number(100, 0, 100),

    playSfxVolume: number(100, 0, 100),

    playStartPosition: Type.Union([Type.Literal('view'), Type.Literal('cursor')]),

    playFollow: Type.Boolean({ default: true }),

    playFollowPosition: number(25, 0, 100),

    playPreviewDuration: number(500, 0, 1000),

    mouseSecondaryTool: Type.Union([Type.Literal('eraser'), Type.Literal('select')]),

    mouseSmoothScrolling: Type.Boolean({ default: true }),

    touchQuickScrollZone: number(25, 0, 50),

    touchScrollInertia: Type.Boolean({ default: true }),

    keyboardShortcuts: Type.Transform(
        Type.Record(Type.String(), Type.Object({ key: Type.String(), ctrl: Type.Boolean({ default: false }), shift: Type.Boolean({ default: false }), alt: Type.Boolean({ default: false }) }), {
            default: {
                open: { ctrl: false, shift: false, alt: false, key: 'o' },
                save: { ctrl: false, shift: false, alt: false, key: 'p' },
                reset: { ctrl: false, shift: false, alt: false, key: 'n' },
                utilities: { ctrl: false, shift: false, alt: false, key: '.' },
                play: { ctrl: false, shift: false, alt: false, key: ' ' },
                stop: { ctrl: false, shift: false, alt: false, key: 'Backspace' },
                bgm: { ctrl: false, shift: false, alt: false, key: 'm' },
                speedUp: { ctrl: false, shift: false, alt: false, key: "'" },
                speedDown: { ctrl: false, shift: false, alt: false, key: ';' },
                select: { ctrl: false, shift: false, alt: false, key: 'f' },
                deselect: { ctrl: false, shift: false, alt: false, key: 'Escape' },
                eraser: { ctrl: false, shift: false, alt: false, key: 'g' },
                brush: { ctrl: false, shift: false, alt: false, key: 'b' },
                flip: { ctrl: false, shift: false, alt: false, key: 'u' },
                cut: { ctrl: false, shift: false, alt: false, key: 'x' },
                copy: { ctrl: false, shift: false, alt: false, key: 'c' },
                paste: { ctrl: false, shift: false, alt: false, key: 'v' },
                undo: { ctrl: false, shift: false, alt: false, key: 'z' },
                redo: { ctrl: false, shift: false, alt: false, key: 'y' },
                note: { ctrl: false, shift: false, alt: false, key: 'a' },
                slide: { ctrl: false, shift: false, alt: false, key: 's' },
                bpm: { ctrl: false, shift: false, alt: false, key: 'q' },
                timeScale: { ctrl: false, shift: false, alt: false, key: 'w' },
                manageGroups: { ctrl: false, shift: false, alt: false, key: 'e' },
                scrollLeft: { ctrl: false, shift: false, alt: false, key: 'ArrowLeft' },
                scrollRight: { ctrl: false, shift: false, alt: false, key: 'ArrowRight' },
                scrollUp: { ctrl: false, shift: false, alt: false, key: 'ArrowUp' },
                scrollDown: { ctrl: false, shift: false, alt: false, key: 'ArrowDown' },
                scrollPageUp: { ctrl: false, shift: false, alt: false, key: 'PageUp' },
                scrollPageDown: { ctrl: false, shift: false, alt: false, key: 'PageDown' },
                jumpUp: { ctrl: false, shift: false, alt: false, key: 'End' },
                jumpDown: { ctrl: false, shift: false, alt: false, key: 'Home' },
                division1: { ctrl: false, shift: false, alt: false, key: '1' },
                division2: { ctrl: false, shift: false, alt: false, key: '2' },
                division3: { ctrl: false, shift: false, alt: false, key: '3' },
                division4: { ctrl: false, shift: false, alt: false, key: '4' },
                division6: { ctrl: false, shift: false, alt: false, key: '6' },
                division8: { ctrl: false, shift: false, alt: false, key: '8' },
                division12: { ctrl: false, shift: false, alt: false, key: '9' },
                division16: { ctrl: false, shift: false, alt: false, key: '0' },
                divisionCustom: { ctrl: false, shift: false, alt: false, key: '`' },
                snapping: { ctrl: false, shift: false, alt: false, key: 'i' },
                zoomXIn: { ctrl: false, shift: false, alt: false, key: ']' },
                zoomXOut: { ctrl: false, shift: false, alt: false, key: '[' },
                zoomYIn: { ctrl: false, shift: false, alt: false, key: '=' },
                zoomYOut: { ctrl: false, shift: false, alt: false, key: '-' },
                help: { ctrl: false, shift: false, alt: false, key: 'h' },
                settings: { ctrl: false, shift: false, alt: false, key: ',' },
            } satisfies Partial<Record<CommandName, KeyboardShortcut>>,
        }),
    )
        .Decode(
            (value) =>
                Object.fromEntries(
                    Object.entries(value).filter(([key]) => isCommandName(key)),
                ) as Partial<Record<CommandName, KeyboardShortcut>>,
        )
        .Encode((values) => values),

    defaultNotePropertiesPresets: Type.Array(defaultNoteSlidePropertiesSchema, {
        minItems: 5,
        maxItems: 5,
        default: [
            {
                copyProperties: true,
            },
            {
                flickDirection: 'left',
                copyProperties: true,
            },
            {
                flickDirection: 'right',
                copyProperties: true,
            },
            {
                flickDirection: 'up',
                copyProperties: true,
            },
            {
                flickDirection: 'down',
                copyProperties: true,
            },
        ] satisfies DefaultNoteSlideProperties[],
    }),

    defaultSlidePropertiesPresets: Type.Array(defaultNoteSlidePropertiesSchema, {
        minItems: 5,
        maxItems: 5,
        default: [
            {
                copyProperties: true,
            },
            {
                isAttached: true,
                copyProperties: true
            },
            {
                flickDirection: 'left',
                copyProperties: true,
            },
            {
                flickDirection: 'right',
                copyProperties: true,
            },
            {
                noteType: "anchor",
                copyProperties: true
            }
        ] satisfies DefaultNoteSlideProperties[],
    }),
}

const normalize = <T extends TSchema>(schema: T, value: unknown) =>
    Value.Decode(schema, Value.Cast(schema, value))

export const settings = Object.defineProperties(
    {},
    Object.fromEntries(
        Object.entries(settingsProperties).map(([key, schema]) => {
            const defaultValue = Value.Create(schema)

            const prop = shallowRef(normalize(schema, storageGet(key)))
            watch(prop, (value) => {
                if (Value.Equal(value, defaultValue)) {
                    storageRemove(key)
                } else {
                    storageSet(key, value)
                }
            })

            return [
                key,
                {
                    enumerable: true,
                    get: () => prop.value,
                    set: (value: unknown) => (prop.value = normalize(schema, value)),
                },
            ]
        }),
    ),
) as {
        [K in keyof typeof settingsProperties]: StaticDecode<(typeof settingsProperties)[K]>
    }
