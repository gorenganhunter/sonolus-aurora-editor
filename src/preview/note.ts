import { computed } from 'vue'
import { settings } from '../settings'
import type { VecLike } from './Vec'
import { toPoints } from './polygon'
import { transform } from './projection'
import { remap } from '../utils/math'

// const h = 0.02

export const noteDuration = computed(
    () => 5 / settings.previewNoteSpeed
    //    () => 10 / Math.pow(1.03, (settings.previewNoteSpeed - 1) / 0.1),
)

export const approachPos = (t: number) => approach(t, 0.6444, 1.6294, 1.8924)

export const approachSize = (t: number) => approach(t, 0.601, 1.4536, 1.6396)

const approach = (t: number, a: number, b: number, c: number) => a * t ** 3 + b * t ** 2 + c * t + 1

export const arrows = {
    left: "M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z",
    right: "M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z",
    up: "M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z",
    down: "M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"
} as const

// export const tapNoteLayout = (l: VecLike, r: VecLike, z: number) =>
//     toPoints(transform(l, z + h), transform(l, z - h), transform(r, z - h), transform(r, z + h))

// export const singleHoldNoteLayout = (
//     lb: VecLike,
//     rb: VecLike,
//     lt: VecLike,
//     rt: VecLike,
//     z: number,
// ) => toPoints(transform(lb, z), transform(lt, z), transform(rt, z), transform(rb, z))
//
// export const doubleHoldNoteLayout = (
//     ll: VecLike,
//     lr: VecLike,
//     rl: VecLike,
//     rr: VecLike,
//     z: number,
// ) => toPoints(transform(lr, z), transform(ll, z), transform(rr, z), transform(rl, z))
//
// export const holdConnectionLayout = (l: VecLike, r: VecLike, zMin: number, zMax: number) =>
//     toPoints(transform(l, zMin), transform(l, zMax), transform(r, zMax), transform(r, zMin))
