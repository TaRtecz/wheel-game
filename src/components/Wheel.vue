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
import { onMounted, watch, ref, nextTick, computed } from 'vue'
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
  console.log('biu');
  const filtred = props.participants.filter((item) => !item.isAnswered)
  
  return filtred.map(participant => {
    const theme = props.themes.find(t => t.id === participant.themeId)
    return {
      ...participant,
      themeColor: theme?.color || '#ccc',
      themeTitle: theme?.title || 'Без темы'
    }
  })
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
      .text('Нет участников')
    return 
  }

  const radius = 200
  group = svg.append('g')
    .attr('data-rot', '0')
    .attr('transform', 'rotate(0)')
    .node() as SVGGElement
  
  const sliceAngle = (2 * Math.PI) / data.length

  data.forEach((participant, i) => {
    const a0 = i * sliceAngle
    const a1 = (i + 1) * sliceAngle
    const x0 = Math.cos(a0) * radius
    const y0 = Math.sin(a0) * radius
    const x1 = Math.cos(a1) * radius
    const y1 = Math.sin(a1) * radius

    // Рисуем сектор для участника
    group!.appendChild(svg.append('path')
      .attr('d', `M 0 0 L ${x0} ${y0} A ${radius} ${radius} 0 0 1 ${x1} ${y1} Z`)
      .attr('fill', participant.themeColor)
      .attr('stroke', 'rgba(0,0,0,0.35)')
      .attr('data-participant-id', participant.id)
      .node()!)

    // Добавляем имя участника
    const mid = (a0 + a1) / 2
    const tx = Math.cos(mid) * (radius * 0.7)
    const ty = Math.sin(mid) * (radius * 0.7)
    const rotation = (mid * 180 / Math.PI) > 90 && (mid * 180 / Math.PI) < 270 
      ? mid * 180 / Math.PI + 180 
      : mid * 180 / Math.PI

    group!.appendChild(svg.append('text')
      .attr('x', tx)
      .attr('y', ty)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 16)
      .attr('fill', '#071427')
      .attr('font-weight', 600)
      .text(participant.name)
      .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
      .node()!)
  })

  // Центральный круг
  group!.appendChild(svg.append('circle')
    .attr('r', 36)
    .attr('fill', 'rgba(255,255,255,0.03)')
    .attr('stroke', 'rgba(255,255,255,0.04)')
    .node()!)
}

function spinToTheme(themeId: string) {
  console.log('spinToTheme');
  
  if (!svgEl.value || !group) return
  
  const svg = d3.select(svgEl.value)
  const data = buildData()
  
  // Находим всех участников с указанной темой
  const participantsInTheme = data.filter(p => p.themeId === themeId)
  if (participantsInTheme.length === 0) return
  
  // Выбираем случайного участника из темы
  const chosenParticipant = participantsInTheme[Math.floor(Math.random() * participantsInTheme.length)]
  const participantIndex = data.findIndex(p => p.id === chosenParticipant.id)
  
  const sliceAngle = (2 * Math.PI) / data.length
  const centerAngle = participantIndex * sliceAngle + sliceAngle / 2
  
  // Поворачиваем колесо так, чтобы выбранный участник оказался сверху
  const targetDeg = 270 - (centerAngle * 180 / Math.PI) + 360 * 5
  
  const g = d3.select(group)
  const prev = parseFloat((g.attr('data-rot') || '0')) || 0
  const to = prev + targetDeg

  console.log('Поворот к участнику:', { 
    participant: chosenParticipant.name, 
    theme: chosenParticipant.themeTitle,
    prev, 
    targetDeg, 
    to 
  })

  g.transition()
    .duration(4200)
    .ease(d3.easeCubicOut)
    .attrTween('transform', function() {
      const i = d3.interpolateNumber(prev, to)
      return (t: number) => `rotate(${i(t)})`
    })
    .on('end', () => {
      g.attr('data-rot', String(to))
      
      const theme = props.themes.find(t => t.id === chosenParticipant.themeId)
      const unanswered = theme?.questions.filter(q => !q.isAnswered) || []
      const chosenQuestion = unanswered[Math.floor(Math.random() * unanswered.length)] || null

      emits('spin-finished', { 
        participant: chosenParticipant, 
        question: chosenQuestion, 
        theme: theme 
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
  max-width: 650px;
  margin: 0 auto;
  height: 100%;
}

.pointer {
  position: absolute;
  top: 0px;
  left: 45%;
  transform: translateX(-50%);
  transform: rotate(180deg);
  z-index: 10;
}

svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>