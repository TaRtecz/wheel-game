<template>
  <div class="wheel-wrap">
    <div class="pointer" aria-hidden>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2v6"
          stroke="#fffb"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 8l4-6 4 6"
          stroke="#fffb"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="#fff0"
        />
      </svg>
    </div>
    <svg 
      ref="svgEl" 
      viewBox="-250 -250 500 500" 
      role="img" 
      aria-label="Колесо фортуны"
    >
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, nextTick } from 'vue'
import * as d3 from 'd3'
import type { Theme, Participant } from '../types'

const props = defineProps<{ 
  themes: Theme[], 
  participants: Participant[] 
}>();

const emits = defineEmits(['spin-finished'])

const svgEl = ref<SVGSVGElement | null>(null)
let group: SVGGElement | null = null

function buildData() {
  return props.themes
    .map(t => ({ 
      ...t, 
      count: props.participants.filter(p => p.themeId === t.id).length 
    }))
    .filter(d => d.count > 0)
}

function draw() {
  if (!svgEl.value) return
  
  const svg = d3.select(svgEl.value)
  svg.selectAll('*').remove()
  
  const data = buildData()
  if (data.length === 0) { 
    svg.append('text')
      .attr('y', 6)
      .attr('text-anchor', 'middle')
      .attr('fill', '#bfcfe0')
      .attr('font-size', 16)
      .text('Нет назначенных участников')
    return 
  }

  const radius = 200
  group = svg.append('g').node() as SVGGElement
  let angleStart = 0
  const total = data.reduce((s, d) => s + d.count, 0)

  data.forEach((d, i) => {
    const slice = d.count / total
    const angle = slice * 2 * Math.PI
    const a0 = angleStart
    const a1 = angleStart + angle
    const x0 = Math.cos(a0) * radius
    const y0 = Math.sin(a0) * radius
    const x1 = Math.cos(a1) * radius
    const y1 = Math.sin(a1) * radius
    const largeArc = angle > Math.PI ? 1 : 0

    // Рисуем сектор
    svg.append('path')
      .attr('d', `M 0 0 L ${x0} ${y0} A ${radius} ${radius} 0 ${largeArc} 1 ${x1} ${y1} Z`)
      .attr('fill', d.color)
      .attr('stroke', 'rgba(0,0,0,0.35)')
      .attr('data-theme-id', d.id)

    // Добавляем текст
    const mid = (a0 + a1) / 2
    const tx = Math.cos(mid) * (radius * 0.58)
    const ty = Math.sin(mid) * (radius * 0.58)
    const rotation = (mid * 180 / Math.PI) > 90 && (mid * 180 / Math.PI) < 270 
      ? mid * 180 / Math.PI + 180 
      : mid * 180 / Math.PI

    svg.append('text')
      .attr('x', tx)
      .attr('y', ty)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 12)
      .attr('fill', '#071427')
      .attr('font-weight', 700)
      .text(`${d.title} (${d.count})`)
      .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)

    angleStart = a1
  })

  // Центральный круг
  svg.append('circle')
    .attr('r', 36)
    .attr('fill', 'rgba(255,255,255,0.03)')
    .attr('stroke', 'rgba(255,255,255,0.04)')
}

function spinToTheme(themeId: string) {
  console.log('spinToTheme');
  
  if (!svgEl.value || !group) return
  
  const svg = d3.select(svgEl.value)
  const data = buildData()
  const idx = data.findIndex(d => d.id === themeId)
  if (idx === -1) return

  const total = data.reduce((s, d) => s + d.count, 0)
  let acc = 0
  for (let i = 0; i < idx; i++) acc += data[i].count

  const slice = data[idx].count / total
  const centerFrac = acc / total + slice / 2
  const centerDeg = centerFrac * 360
  const targetDeg = (270 - centerDeg + 360 * 6) % 360
  const finalDeg = targetDeg + (Math.random() * (slice * 360 / 2) - (slice * 360 / 4))
  
  const g = svg.select('g')
  const prev = parseFloat((g.attr('data-rot') || '0')) || 0
  const to = prev + finalDeg

  g.transition()
    .duration(4200)
    .ease(d3.easeCubicOut)
    .attrTween('transform', function() {
      const i = d3.interpolateNumber(prev, to)
      return (t: number) => `rotate(${i(t)})`
    })
    .on('end', () => {
      g.attr('data-rot', String(to))
      
      const chosenTheme = data[idx]
      const participantsInTheme = props.participants.filter(p => p.themeId === chosenTheme.id)
      const chosenParticipant = participantsInTheme[Math.floor(Math.random() * participantsInTheme.length)]
      const unanswered = chosenTheme.questions.filter(q => !q.isAnswered)
      const chosenQuestion = unanswered[Math.floor(Math.random() * unanswered.length)]

      emits('spin-finished', { 
        participant: chosenParticipant, 
        question: chosenQuestion, 
        theme: chosenTheme 
      })
    })
}

watch(
  () => [props.themes, props.participants], 
  () => { nextTick(() => draw()) }, 
  { deep: true }
)

defineExpose({
  spinToTheme
})

onMounted(() => draw())
</script>

<style scoped>
.wheel-wrap {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.pointer {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>