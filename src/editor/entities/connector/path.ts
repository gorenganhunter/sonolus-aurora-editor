import { ease } from '../../../ease'
import { lerp, unlerp } from '../../../utils/math'
import { ups } from '../../view'

export const getPathD = (
    tAttachHead: number,
    attachHeadLane: number,
    tAttachTail: number,
    attachTailLane: number,
    tHead: number,
    tTail: number,
    connectorEase: 'in' | 'out',
) => {
    const pHead = unlerp(tAttachHead, tAttachTail, tHead)
    const pTail = unlerp(tAttachHead, tAttachTail, tTail)
    const pMid = (pHead + pTail) / 2

    const qHead = ease(connectorEase, pHead)
    const qTail = ease(connectorEase, pTail)
    const qMid = connectorEase === 'in' ? pHead * pTail : 1 - (1 - pHead) * (1 - pTail)

    const lHead = lerp(attachHeadLane, attachTailLane, qHead)
    const lTail = lerp(attachHeadLane, attachTailLane, qTail)
    const lMid = lerp(attachHeadLane, attachTailLane, qMid)

    const xHead = lHead
    const yHead = tHead * ups.value

    const xTail = lTail
    const yTail = tTail * ups.value

    const xMid = lMid
    const yMid = lerp(tAttachHead, tAttachTail, pMid) * ups.value

    return `M ${xHead - 0.5} ${yHead} Q ${xMid - 0.5} ${yMid} ${xTail - 0.5} ${yTail} L ${xTail + 0.5} ${yTail} Q ${xMid + 0.5} ${yMid} ${xHead + 0.5} ${yHead} `
}
