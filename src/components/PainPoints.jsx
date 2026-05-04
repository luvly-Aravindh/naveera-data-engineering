import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { AlertCircle, Layers, Activity, Package, ArrowRight } from 'lucide-react'
import { CtaBtn, UrgencyRow, SH, Reveal, StaggerReveal, FV } from './shared.jsx'
import LoadingBar from '../components/LoadingBar.jsx'

const CARDS = [
  { icon:AlertCircle, color:'#EE6B00', tag:'Unreliable Pipelines', title:'Pipelines Fail When It Matters', body:'Significant time and budget invested, but pipelines still fail when it matters. Teams spend more time fixing than shipping.' },
  { icon:Layers,      color:'#010C44', tag:'Vendor Fragmentation', title:'No Single Point of Accountability', body:'Multiple tools and vendors across ingestion, transformation, and warehousing, but no single point of accountability when things break.' },
  { icon:Activity,    color:'#EE6B00', tag:'Data Silos',           title:'Data Spread Across Systems',        body:'Data spread across systems with no consistency. Every new request starts with fixing the foundation instead of delivering insights.' },
  { icon:Package,     color:'#010C44', tag:'Engineering Drain',    title:'Engineers Debugging, Not Building', body:'Your best engineers are tied up debugging pipelines and coordinating fixes instead of building product and driving growth.' },
]

function PainCard({ c, i }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:48, scale:0.94 }}
      animate={inView ? { opacity:1, y:0, scale:1 } : {}}
      transition={{ duration:0.72, delay:i*0.1, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-5 }}
      className="card p-7 group"
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-card"
           style={{ background:`linear-gradient(90deg,transparent,${c.color}70,transparent)` }} />

      <div className="flex items-start justify-between mb-5">
        <div className="icon-box-sm" style={{ background:`${c.color}10`, borderColor:`${c.color}25` }}>
          <c.icon size={18} style={{ color:c.color }} />
        </div>
        <span className="chip-soft chip text-[9px]">{c.tag}</span>
      </div>

      <h3 className="f-display font-bold t-h3 text-navy mb-3 leading-snug group-hover:text-orange transition-colors duration-200">
        {c.title}
      </h3>
      <p className="f-body text-sm text-body leading-relaxed">{c.body}</p>

      {/* Bottom hover reveal */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-b-card"
           style={{ background:`linear-gradient(90deg,${c.color},${c.color}40,transparent)` }} />
    </motion.div>
  )
}

export default function PainPoints() {
  return (
    <section className="sp" style={{ background:'#F8FAFC' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="sh mb-12">
          <SH chip="The Problem"
              h2="Every CTO and Founder We Speak To"
              accent="Comes In With the Same Experience."
              sub="If any of this feels familiar, a 30-minute technical review will show you exactly what's breaking in your data stack, and what it takes to fix it." />
        </Reveal>

        <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {CARDS.map((c,i) => <PainCard key={i} c={c} i={i} />)}
        </div>

        <Reveal className="flex flex-col items-center gap-3">
          <CtaBtn   onClick={() =>
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  } size="lg">
            Show Me What's Slowing Us Down <ArrowRight size={17} />
          </CtaBtn>
          <UrgencyRow text="3 Spots Left · 30-Minute Technical Deep Dive Call" />
        </Reveal>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex justify-center sm:justify-center mt-3"
        >
            {/* <LoadingBar /> */}

        </motion.div>
      </div>
    </section>
  )
}
