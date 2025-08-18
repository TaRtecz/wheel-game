# Проект: wheel-retro (Vue 3 + TypeScript + Pinia + D3)

Ниже — минимальный, но готовый к запуску UI-скелет на Vue 3 + TypeScript. Включены основные компоненты: менеджер участников/тем, игровая панель с колесом (D3), модал раунда и Pinia-store.

> Скопируйте структуру файлов в проект (Vite), затем `npm install` и `npm run dev`.

---

```
package.json
vite.config.ts
tsconfig.json
index.html
src/main.ts
src/styles.css
src/App.vue
src/types.ts
src/stores/game.ts
src/components/ParticipantManager.vue
src/components/ThemeManager.vue
src/components/Wheel.vue
src/components/RoundModal.vue
```

---

### package.json
```json
{
  "name": "wheel-retro",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "d3": "^7.8.5",
    "pinia": "^2.0.35",
    "vue": "^3.3.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.1.0",
    "typescript": "^5.3.3",
    "vite": "^5.1.0"
  }
}
```

---

### vite.config.ts
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

---

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

---

### index.html
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wheel Retro (Vue)</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

---

### src/main.ts
```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

---

### src/styles.css
```css
:root{
  --bg: #071427;
  --surface: #0b1220;
  --muted: #98A2B3;
  --accent: #7C3AED;
  --white: #E6EEF6;
}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,system-ui,Segoe UI,Roboto,Arial;background:linear-gradient(180deg,#071427,#081324);color:var(--white);}
.app{max-width:1100px;margin:28px auto;padding:20px;display:grid;grid-template-columns:360px 1fr;gap:18px}
.card{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border-radius:12px;padding:16px;box-shadow:0 6px 20px rgba(2,6,23,0.6)}
.btn{background:var(--accent);color:#fff;padding:8px 12px;border-radius:8px;border:none;cursor:pointer}
.btn.ghost{background:transparent;border:1px solid rgba(255,255,255,0.06)}
.small{padding:6px 8px;font-size:13px}
.input{width:100%;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit}
.list{max-height:260px;overflow:auto;margin-top:8px}
.item{display:flex;align-items:center;justify-content:space-between;padding:8px;border-radius:8px;background:rgba(255,255,255,0.01);margin-bottom:8px}
.wheel-wrap{width:520px;height:520px;display:grid;place-items:center;position:relative}
.pointer{position:absolute;top:6px;left:50%;transform:translateX(-50%);z-index:5;pointer-events:none}
@media(max-width:1000px){.app{grid-template-columns:1fr}.wheel-wrap{width:360px;height:360px}}
```

---

### src/types.ts
```ts
export interface Question { id: string; text: string; isAnswered: boolean }
export interface Theme { id: string; title: string; color: string; questions: Question[] }
export interface Participant { id: string; name: string; themeId?: string }
export interface RoundHistory { participantId: string; themeId: string; questionId: string; skipped?: boolean; answeredAt?: string | null }
```

---

### src/stores/game.ts
```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Participant, Theme, RoundHistory } from '../types'

function uid(prefix='id'){return prefix + '_' + Math.random().toString(36).slice(2,9)}

export const useGameStore = defineStore('game', () => {
  const participants = ref<Participant[]>([])
  const themes = ref<Theme[]>([])
  const history = ref<RoundHistory[]>([])

  function addParticipant(name: string){ participants.value.push({id: uid('p'), name}) }
  function removeParticipant(id: string){ participants.value = participants.value.filter(p=>p.id!==id) }

  function addTheme(title: string, color: string, questionsText: string){
    const qs = questionsText.split('\n').map(l=>l.trim()).filter(Boolean).map(t=>({id: uid('q'), text: t, isAnswered:false}))
    themes.value.push({id: uid('t'), title, color, questions: qs})
  }

  function assignThemesRandom(){
    if(themes.value.length===0) return
    const shuffled = [...participants.value].sort(()=>0.5 - Math.random())
    shuffled.forEach((p,i)=> p.themeId = themes.value[i % themes.value.length].id)
    // merge back
    participants.value = participants.value.map(p=> ({...p, themeId: shuffled.find(s=>s.id===p.id)?.themeId ?? p.themeId}))
  }

  function markQuestionAnswered(themeId:string, questionId:string, participantId?:string){
    const t = themes.value.find(x=>x.id===themeId)
    if(!t) return
    const q = t.questions.find(x=>x.id===questionId)
    if(q) q.isAnswered = true
    if(participantId) participants.value = participants.value.filter(p=>p.id!==participantId)
    history.value.unshift({participantId: participantId || 'unknown', themeId, questionId, answeredAt: new Date().toISOString()})
  }

  function skipQuestion(themeId:string, questionId:string, participantId?:string){
    history.value.unshift({participantId: participantId || 'unknown', themeId, questionId, skipped:true, answeredAt: null})
  }

  function findUnansweredQuestions(themeId:string){
    const t = themes.value.find(x=>x.id===themeId)
    return t ? t.questions.filter(q=>!q.isAnswered) : []
  }

  return { participants, themes, history, addParticipant, removeParticipant, addTheme, assignThemesRandom, markQuestionAnswered, skipQuestion, findUnansweredQuestions }
})
```

---

### src/components/ParticipantManager.vue
```vue
<template>
  <div>
    <h3>Участники</h3>
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <input v-model="name" placeholder="Имя" class="input" />
      <button class="btn small" @click="add">Добавить</button>
    </div>
    <div class="list">
      <div v-if="store.participants.length===0" class="muted">Список пуст</div>
      <div v-for="p in store.participants" :key="p.id" class="item">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:34px;height:34px;border-radius:8px;background:#fff;color:#071427;display:grid;place-items:center;font-weight:700">{{ p.name.slice(0,2).toUpperCase() }}</div>
          <div>
            <div style="font-weight:700">{{ p.name }}</div>
            <div class="muted">{{ p.themeId ? (store.themes.find(t=>t.id===p.themeId)?.title || '—') : 'не назначен' }}</div>
          </div>
        </div>
        <div>
          <button class="btn ghost small" @click="remove(p.id)">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
const store = useGameStore()
const name = ref('')
function add(){ if(!name.value.trim()) return; store.addParticipant(name.value.trim()); name.value=''; }
function remove(id:string){ if(confirm('Удалить участника?')) store.removeParticipant(id) }
</script>
```

---

### src/components/ThemeManager.vue
```vue
<template>
  <div>
    <h3>Темы</h3>
    <input v-model="title" placeholder="Название темы" class="input" />
    <div style="display:flex;gap:8px;margin-top:8px;margin-bottom:8px">
      <input type="color" v-model="color" style="width:48px;height:40px;border-radius:8px;border:none;padding:0" />
      <button class="btn small" @click="add">Добавить тему</button>
    </div>
    <textarea v-model="questionsText" placeholder="Вопросы — каждая строка" class="input" style="height:90px"></textarea>

    <div class="list" style="margin-top:8px">
      <div v-if="store.themes.length===0" class="muted">Тем пока нет</div>
      <div v-for="t in store.themes" :key="t.id" class="item" style="flex-direction:column;align-items:flex-start">
        <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:18px;height:18px;border-radius:6px;background:var(--muted)" :style="{background: t.color}"></div>
            <div>
              <div style="font-weight:700">{{ t.title }}</div>
              <div class="muted">{{ t.questions.length }} вопросов</div>
            </div>
          </div>
          <div>
            <button class="btn ghost small" @click="remove(t.id)">Удалить</button>
          </div>
        </div>
        <div style="margin-top:8px;width:100%">
          <div v-for="q in t.questions.slice(0,3)" :key="q.id" style="font-size:13px">{{ q.isAnswered ? '✓ ' : '• ' }}{{ q.text }}</div>
          <div v-if="t.questions.length>3" class="muted">еще {{ t.questions.length-3 }}...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
const store = useGameStore()
const title = ref('')
const color = ref('#ff8a65')
const questionsText = ref('')
function add(){ if(!title.value.trim()) return; store.addTheme(title.value.trim(), color.value, questionsText.value); title.value=''; questionsText.value=''; }
function remove(id:string){ if(confirm('Удалить тему?')) store.themes = store.themes.filter(t=>t.id!==id); }
</script>
```

---

### src/components/Wheel.vue
```vue
<template>
  <div class="wheel-wrap">
    <div class="pointer" aria-hidden>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 2v6" stroke="#fffb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8l4-6 4 6" stroke="#fffb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="#fff0"/></svg>
    </div>
    <svg ref="svgEl" viewBox="-250 -250 500 500" role="img" aria-label="Колесо"/>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, nextTick } from 'vue'
import * as d3 from 'd3'
import type { Theme, Participant } from '../types'

const props = defineProps<{ themes: Theme[], participants: Participant[] }>()
const emits = defineEmits(['spin-finished'])

const svgEl = ref<SVGSVGElement | null>(null)
let group: SVGGElement | null = null

function buildData(){
  const data = props.themes.map(t => ({ ...t, count: props.participants.filter(p=>p.themeId===t.id).length })).filter(d=>d.count>0)
  return data
}

function draw(){
  if(!svgEl.value) return
  const svg = d3.select(svgEl.value)
  svg.selectAll('*').remove()
  const data = buildData()
  if(data.length===0){ svg.append('text').attr('y',6).attr('text-anchor','middle').attr('fill','#bfcfe0').attr('font-size',16).text('Нет назначенных участников'); return }

  const radius = 200
  group = svg.append('g').node() as SVGGElement
  let angleStart = 0
  const total = data.reduce((s,d)=>s+d.count,0)
  data.forEach((d, i)=>{
    const slice = d.count / total
    const angle = slice * 2 * Math.PI
    const a0 = angleStart
    const a1 = angleStart + angle
    const x0 = Math.cos(a0) * radius
    const y0 = Math.sin(a0) * radius
    const x1 = Math.cos(a1) * radius
    const y1 = Math.sin(a1) * radius
    const largeArc = angle > Math.PI ? 1 : 0
    const path = svg.append('path')
      .attr('d', `M 0 0 L ${x0} ${y0} A ${radius} ${radius} 0 ${largeArc} 1 ${x1} ${y1} Z`)
      .attr('fill', d.color)
      .attr('stroke', 'rgba(0,0,0,0.35)')
      .attr('data-theme-id', d.id)
    // label
    const mid = (a0 + a1) / 2
    const tx = Math.cos(mid) * (radius * 0.58)
    const ty = Math.sin(mid) * (radius * 0.58)
    svg.append('text').attr('x', tx).attr('y', ty).attr('text-anchor','middle').attr('dominant-baseline','central').attr('font-size',12).attr('fill','#071427').attr('font-weight',700).text(`${d.title} (${d.count})`).attr('transform', `rotate(${(mid*180/Math.PI) > 90 && (mid*180/Math.PI)<270 ? (mid*180/Math.PI+180) : (mid*180/Math.PI)}, ${tx}, ${ty})`)
    angleStart = a1
  })
  svg.append('circle').attr('r',36).attr('fill','rgba(255,255,255,0.03)').attr('stroke','rgba(255,255,255,0.04)')
}

watch(()=>[props.themes, props.participants], () => { nextTick(()=>draw()) }, {deep:true})

function spinToTheme(themeId: string){
  // compute rotation and animate using css transform on the group
  if(!svgEl.value) return
  const svg = d3.select(svgEl.value)
  const paths = svg.selectAll('path').nodes() as SVGPathElement[]
  const data = buildData()
  const idx = data.findIndex(d=>d.id===themeId)
  if(idx===-1) return
  const total = data.reduce((s,d)=>s+d.count,0)
  let acc=0
  for(let i=0;i<idx;i++) acc += data[i].count
  const slice = data[idx].count/total
  const centerFrac = acc/total + slice/2
  const centerDeg = centerFrac * 360
  const targetDeg = (270 - centerDeg + 360*6) % 360
  const finalDeg = targetDeg + (Math.random()* (slice*360/2) - (slice*360/4))
  const g = svg.select('g')
  const prev = parseFloat((g.attr('data-rot')||'0'))||0
  const to = prev + finalDeg
  g.transition().duration(4200).ease(d3.easeCubicOut).attrTween('transform', function(){
    const i = d3.interpolateNumber(prev, to)
    return (t:any)=> `rotate(${i(t)})`
  }).on('end', ()=>{
    g.attr('data-rot', String(to))
    // determine winner: which path under pointer (top) — compute by angle
    const landingAngle = (270 - (to % 360) + 360) % 360
    // find sector by angles
    let angleStart = 0
    for(const d of data){
      const frac = d.count/total
      const a0 = angleStart * 360
      const a1 = (angleStart + frac) * 360
      const mid = (a0 + a1)/2
      const normalizedMid = (mid + 360) % 360
      const low = a0 % 360
      const high = a1 % 360
      // rough check: compare landingAngle to range
      // simpler: compute sector index by accumulating
      angleStart += frac
    }
    // pick participant randomly from that theme
    const chosenTheme = data[idx]
    const participantsInTheme = props.participants.filter(p=>p.themeId===chosenTheme.id)
    const chosenParticipant = participantsInTheme[Math.floor(Math.random()*participantsInTheme.length)]
    // pick random unanswered question
    const unanswered = chosenTheme.questions.filter(q=>!q.isAnswered)
    const chosenQuestion = unanswered[Math.floor(Math.random()*unanswered.length)]
    // emit result
    emits('spin-finished', { participant: chosenParticipant, question: chosenQuestion, theme: chosenTheme })
  })
}

// expose method via custom event: parent can call by ref
const api = { spinToTheme }

// export for parent usage
defineExpose(api)

onMounted(()=> draw())
</script>
```

---

### src/components/RoundModal.vue
```vue
<template>
  <div class="card">
    <h3>Раунд</h3>
    <div v-if="!payload" class="muted">Нажмите СПИН, чтобы начать</div>
    <div v-else>
      <div class="muted">Игрок: <b>{{ payload.participant.name }}</b></div>
      <div style="margin-top:12px;font-size:18px;font-weight:700">{{ payload.question.text }}</div>
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn" @click="answered">Ответил</button>
        <button class="btn ghost" @click="skip">Пропустить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Participant, Question, Theme } from '../types'

const props = defineProps<{ payload: { participant: Participant; question: Question; theme: Theme } | null }>()
const emit = defineEmits(['answered','skipped'])

function answered(){ if(!props.payload) return; emit('answered', { participantId: props.payload.participant.id, themeId: props.payload.theme.id, questionId: props.payload.question.id }) }
function skip(){ if(!props.payload) return; emit('skipped', { participantId: props.payload.participant.id, themeId: props.payload.theme.id, questionId: props.payload.question.id }) }
</script>
```

---

### src/App.vue
```vue
<template>
  <div class="app">
    <div class="card">
      <h2>Управление</h2>
      <ParticipantManager />
      <hr style="margin:12px 0;border:none;border-top:1px solid rgba(255,255,255,0.03)" />
      <ThemeManager />
      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn" @click="assign">Распределить темы</button>
        <button class="btn ghost" @click="reset">Сброс</button>
      </div>
    </div>

    <div class="card">
      <div style="display:flex;gap:16px;align-items:flex-start;padding:12px">
        <div style="width:520px">
          <Wheel ref="wheelRef" :themes="store.themes" :participants="store.participants" @spin-finished="onSpinFinished" />
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;gap:8px;align-items:center">
            <button class="btn" @click="spin">СПИН</button>
            <button class="btn ghost" @click="pickManual">Выбрать ручной</button>
          </div>

          <RoundModal :payload="currentPayload" @answered="onAnswered" @skipped="onSkipped" />

          <div>
            <h3>История</h3>
            <div v-if="store.history.length===0" class="muted">Пока нет истории</div>
            <div v-for="h in store.history" :key="h.questionId + h.participantId" class="item" style="margin-top:8px">
              <div>
                <div style="font-weight:700">{{ nameById(h.participantId) }} — {{ themeById(h.themeId)?.title || '—' }} <span class="muted" v-if="h.skipped">(пропущено)</span></div>
                <div class="muted">Вопрос: {{ questionTextById(h.questionId) }}</div>
              </div>
              <div class="muted">{{ h.answeredAt ? new Date(h.answeredAt).toLocaleString() : '' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ParticipantManager from './components/ParticipantManager.vue'
import ThemeManager from './components/ThemeManager.vue'
import Wheel from './components/Wheel.vue'
import RoundModal from './components/RoundModal.vue'
import { useGameStore } from './stores/game'

const store = useGameStore()
const wheelRef = ref<any>(null)
const currentPayload = ref<any | null>(null)

function assign(){ store.assignThemesRandom() }
function reset(){ if(confirm('Сбросить всё?')) { store.participants = []; store.themes = []; store.history = [] } }

function spin(){
  if(store.participants.length===0) return alert('Нет участников')
  // choose random participant
  const chosen = store.participants[Math.floor(Math.random()*store.participants.length)]
  if(!chosen.themeId){ return alert('Участнику не назначена тема. Распределите темы.') }
  // request wheel to spin to theme
  wheelRef.value?.spinToTheme(chosen.themeId)
}

function onSpinFinished(payload:any){
  currentPayload.value = payload
}

function onAnswered({ participantId, themeId, questionId }:{participantId:string, themeId:string, questionId:string}){
  store.markQuestionAnswered(themeId, questionId, participantId)
  currentPayload.value = null
}
function onSkipped({ participantId, themeId, questionId }:{participantId:string, themeId:string, questionId:string}){
  store.skipQuestion(themeId, questionId, participantId)
  currentPayload.value = null
}

function pickManual(){ const name = prompt('Имя участника (оставить пустым для случайного)'); if(!name){ spin(); return } const p = store.participants.find(x=>x.name.toLowerCase()===name.toLowerCase()); if(!p) return alert('Не найден'); wheelRef.value?.spinToTheme(p.themeId)
}

function nameById(id:string){ return store.participants.find(p=>p.id===id)?.name || '(удалён)' }
function themeById(id:string | undefined){ return store.themes.find(t=>t.id===id) }
function questionTextById(qid:string){ for(const t of store.themes){ const q = t.questions.find(q=>q.id===qid); if(q) return q.text } return '(вопрос)' }
</script>
```

---

## Как запустить
1. `npm install`
2. `npm run dev`
3. Открыть http://localhost:5173

---

## Что дальше
- Я могу дополнить скелет: таймер ответа, drag-n-drop для ручного перераспределения, экспорт PDF, интеграция Socket.IO.
- Могу перевести стили на Tailwind/Tokens (на основе Figma doc), или сделать компонентную библиотеку.

Если нужно, расширю любой из компонентов и подготовлю коммиты/patch.