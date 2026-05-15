import type { Chart } from '.'

export const validateChart = (chart: Chart) => {
    if (!chart.bpms.some(({ beat }) => beat === 0))
        throw new Error('Invalid level: initial BPM not found')

    for (const [gid] of chart.groups.entries()) {
        if (!chart.timeScales.find(ts => (ts.groupId === gid && ts.beat === 0)))
            chart.timeScales.push({
                groupId: gid,
                beat: 0,
                timeScale: 1
            })
    }
}
