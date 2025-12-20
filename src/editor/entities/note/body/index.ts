// import DamageBody from './DamageBody.vue'
import NoneBody from './NoneBody.vue'
// import SingleCyanBody from './SingleCyanBody.vue'
import SingleGreenBody from './SingleGreenBody.vue'
import SingleRedBody from './SingleRedBody.vue'
import SingleBlueBody from './SingleBlueBody.vue'
import SingleOrangeBody from './SingleOrangeBody.vue'
import SinglePinkBody from './SinglePinkBody.vue'
import SinglePurpleBody from './SinglePurpleBody.vue'
import TickGreenBody from './TickGreenBody.vue'
// import SingleYellowBody from './SingleYellowBody.vue'
// import TraceGreenBody from './TraceGreenBody.vue'
// import TraceRedBody from './TraceRedBody.vue'
// import TraceYellowBody from './TraceYellowBody.vue'

export const bodyComponents = {
    none: NoneBody,
    tick: TickGreenBody,
    // damage: DamageBody,
    // trace: {
    //     red: TraceRedBody,
    //     green: TraceGreenBody,
    //     yellow: TraceYellowBody,
    // },
    single: {
        red: SingleRedBody,
        green: SingleGreenBody,
        blue: SingleBlueBody,
        orange: SingleOrangeBody,
        pink: SinglePinkBody,
        purple: SinglePurpleBody
    },
}
