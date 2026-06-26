import Type, { type Static } from 'typebox'
import Value from 'typebox/value'
import { shallowRef, watch } from 'vue'
import { isCommandName, type CommandName } from './editor/commands'
import { defaultLocale } from './i18n/locale'
import { localizations } from './i18n/localizations'
import { storageGet, storageRemove, storageSet } from './storage'
import { clamp } from './utils/math'
import { FlickDirection } from './chart/note'

const KeyboardShortcut = Type.Object({
    key: Type.String(),
    ctrl: Type.Optional(Type.Boolean({ default: false })),
    shift: Type.Optional(Type.Boolean({ default: false })),
    alt: Type.Optional(Type.Boolean({ default: false }))
})

export type KeyboardShortcut = Static<typeof KeyboardShortcut>

const number = (def: number, min: number, max: number) =>
    Type.Codec(Type.Number({ default: def }))
        .Decode((value) => clamp(value, min, max))
        .Encode((value) => value)

export const NoteModifier = Type.Object({
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
        Type.Literal('alt2'),
        Type.Literal('alt3'),
        Type.Literal('alt4'),
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
    holdSfx: Type.Union([
        Type.Literal('default'),
        Type.Literal('none'),
        Type.Literal('alt2'),
        Type.Literal('alt3'),
        Type.Literal('alt4'),
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
    marker: Type.Union([
        Type.Literal('none'),
        Type.Literal('danger'),
        Type.Literal('questionable'),
        Type.Literal('info'),
    ]),
    comment: Type.Optional(Type.String())
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
})

export type NoteModifier = Static<typeof NoteModifier>

export const NoteModifierRecord = Type.Partial(Type.Object({
    noteType: Type.Partial(Type.Record(Type.Union([
        Type.Literal('default'),
        // Type.Literal('trace'),
        Type.Literal('anchor'),
        // Type.Literal('damage'),
        // Type.Literal('forceTick'),
        // Type.Literal('forceNonTick'),
    ]), KeyboardShortcut)),
    isAttached: Type.Partial(Type.Record(Type.Union([
        Type.Literal("true"),
        Type.Literal("false"),
    ]), KeyboardShortcut)),
    // size: Type.Number(),
    // isCritical: Type.Boolean(),
    flickDirection: Type.Partial(Type.Record(Type.Union([
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
    ]), KeyboardShortcut)),
    shortenEarlyWindow: Type.Partial(Type.Record(Type.Union([
        Type.Literal('none'),
        Type.Literal('perfect'),
        Type.Literal('great'),
        Type.Literal('good'),
    ]), KeyboardShortcut)),
    // isFake: Type.Boolean(),
    sfx: Type.Partial(Type.Record(Type.Union([
        Type.Literal('default'),
        Type.Literal('none'),
        Type.Literal('alt2'),
        Type.Literal('alt3'),
        Type.Literal('alt4'),
        //     Type.Literal('normalTap'),
        //     Type.Literal('criticalTap'),
        //     Type.Literal('normalFlick'),
        //     Type.Literal('criticalFlick'),
        //     Type.Literal('normalTrace'),
        //     Type.Literal('criticalTrace'),
        //     Type.Literal('normalTick'),
        //     Type.Literal('criticalTick'),
        //     Type.Literal('damage'),
    ]), KeyboardShortcut)),
    holdSfx: Type.Partial(Type.Record(Type.Union([
        Type.Literal('default'),
        Type.Literal('none'),
        Type.Literal('alt2'),
        Type.Literal('alt3'),
        Type.Literal('alt4'),
        //     Type.Literal('normalTap'),
        //     Type.Literal('criticalTap'),
        //     Type.Literal('normalFlick'),
        //     Type.Literal('criticalFlick'),
        //     Type.Literal('normalTrace'),
        //     Type.Literal('criticalTrace'),
        //     Type.Literal('normalTick'),
        //     Type.Literal('criticalTick'),
        //     Type.Literal('damage'),
    ]), KeyboardShortcut)),
    // isConnectorSeparator: Type.Boolean(),
    // connectorType: Type.Partial(Type.Record(Type.Union([Type.Literal('active'), Type.Literal('guide')]), KeyboardShortcut)),
    connectorEase: Type.Partial(Type.Record(Type.Union([
        Type.Literal('linear'),
        Type.Literal('in'),
        Type.Literal('out'),
        Type.Literal('inOut'),
        Type.Literal('outIn'),
        Type.Literal('none'),
    ]), KeyboardShortcut)),
    marker: Type.Partial(Type.Record(Type.Union([
        Type.Literal('none'),
        Type.Literal('danger'),
        Type.Literal('questionable'),
        Type.Literal('info'),
    ]), KeyboardShortcut)),
    // connectorActiveIsCritical: Type.Boolean(),
    // connectorActiveIsFake: Type.Boolean(),
    // connectorGuideColor: Type.Partial(Type.Record(Type.Union([
    //     Type.Literal('neutral'),
    //     Type.Literal('red'),
    //     Type.Literal('green'),
    //     Type.Literal('blue'),
    //     Type.Literal('yellow'),
    //     Type.Literal('purple'),
    //     Type.Literal('cyan'),
    //     Type.Literal('black'),
    // ]), KeyboardShortcut)),
    // connectorGuideAlpha: Type.Number(),
    // connectorLayer: Type.Partial(Type.Record(Type.Union([Type.Literal('top'), Type.Literal('bottom')]), KeyboardShortcut)),
}))

export type NoteModifierRecord = Static<typeof NoteModifierRecord>

const defaultNoteSlidePropertiesSchema = Type.Intersect([
    Type.Partial(NoteModifier),
    Type.Object({
        copyProperties: Type.Boolean({ default: true }),
    }),
])

export type DefaultNoteSlideProperties = Type.Static<typeof defaultNoteSlidePropertiesSchema>

export const settingsProperties = {
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
    ) as never as Type.TString,

    autoSave: Type.Boolean({ default: true }),

    autoSaveDelay: number(1, 0, 5),

    waveform: Type.Union([Type.Literal('volume'), Type.Literal('fft'), Type.Literal('off')]),

    maxScrollX: Type.Number({ minimum: 0 }),

    dragToPanY: Type.Boolean({ default: true }),

    dragToPanX: Type.Boolean(),

    autoAddGroup: Type.Boolean({ default: true }),

    showGroupName: Type.Boolean({ default: true }),

    showOtherGroups: Type.Boolean({ default: true }),

    hitboxAsSelectionBox: Type.Boolean({ default: false }),

    showLaneDivisor: Type.Boolean({ default: true }),

    toolbar: Type.Codec(
        Type.Array(
            Type.Codec(Type.Array(Type.String()))
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
                    ['snap', 'flip', 'paste', 'cut', 'copy', 'redo', 'undo'],
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
                        'waypointVisibility',
                        'bpmVisibility',
                        'timeScaleVisibility',
                        'noteVisibility',
                        'cycleVisibilities',
                    ],
                    [
                        'keepTiming',
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
                    ['markerPrev', 'markerNext']
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

    noteModifierKey: Type.Codec(
        Type.Record(Type.String(), Type.Record(Type.String(), KeyboardShortcut), {            default: {
                flickDirection: {
                    left: { alt: true, key: 'a' },
                    right: { alt: true, key: 'd' },
                    up: { alt: true, key: 'w' },
                    down: { alt: true, key: 's' }
                }
            } satisfies NoteModifierRecord,
        }),
    )
        .Decode(
            (value) => {
                console.log(1, value)
                const a = Object.fromEntries(
                    Object.entries(value)
                        .filter(([property]) => Object.keys(NoteModifierRecord.properties).includes(property))
                    // .map(([property, v]) => ([
                    //     property,
                    //     Object.fromEntries(
                    //         Object.entries(v)
                    //             .filter(([k]) =>
                    //                 // @ts-ignore
                    //                 Object.keys(NoteModifierRecord.properties[property]).includes(k)
                    //             )
                    //     )
                    // ])),
                ) as NoteModifierRecord
                console.log(a)
                return a
            },
        )
        .Encode((values) => values),

    keyboardShortcuts: Type.Codec(
        Type.Record(Type.String(), KeyboardShortcut, {
            default: {
                open: { key: 'o' },
                save: { key: 'p' },
                reset: { key: 'n' },
                utilities: { key: '.' },
                play: { key: ' ' },
                stop: { key: 'Backspace' },
                bgm: { key: 'm' },
                speedUp: { key: "'" },
                speedDown: { key: ';' },
                select: { key: 'f' },
                deselect: { key: 'Escape' },
                eraser: { key: 'g' },
                brush: { key: 'b' },
                flip: { key: 'u' },
                snap: { key: 'k' },
                cut: { key: 'x' },
                copy: { key: 'c' },
                paste: { key: 'v' },
                undo: { key: 'z' },
                redo: { key: 'y' },
                note: { key: 'a' },
                slide: { key: 's' },
                bpm: { key: 'q' },
                timeScale: { key: 'w' },
                manageGroups: { key: 'e' },
                scrollLeft: { key: 'ArrowLeft' },
                scrollRight: { key: 'ArrowRight' },
                scrollUp: { key: 'ArrowUp' },
                scrollDown: { key: 'ArrowDown' },
                scrollPageUp: { key: 'PageUp' },
                scrollPageDown: { key: 'PageDown' },
                jumpUp: { key: 'End' },
                jumpDown: { key: 'Home' },
                division1: { key: '1' },
                division2: { key: '2' },
                division3: { key: '3' },
                division4: { key: '4' },
                division6: { key: '6' },
                division8: { key: '8' },
                division12: { key: '9' },
                division16: { key: '0' },
                divisionCustom: { key: '`' },
                cycleVisibilities: { key: '/' },
                snapping: { key: 'i' },
                keepTiming: { key: 'l' },
                zoomXIn: { key: ']' },
                zoomXOut: { key: '[' },
                zoomYIn: { key: '=' },
                zoomYOut: { key: '-' },
                help: { key: 'h' },
                settings: { key: ',' },
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

const normalize = <T extends Type.TSchema>(schema: T, value: unknown) =>
    Value.Decode(schema, Value.Repair(schema, value))

export const settings = Object.defineProperties(
    {},
    Object.fromEntries(
        Object.entries(settingsProperties).map(([key, schema]) => {
            const defaultValue = Value.Create(schema)

            const prop = shallowRef(normalize(schema, storageGet(key, defaultValue)))
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
    [K in keyof typeof settingsProperties]: Type.StaticDecode<(typeof settingsProperties)[K]>
}
