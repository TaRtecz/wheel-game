import { defineStore } from "pinia"
import { ref } from "vue"
import type { Participant, Theme, RoundHistory } from "../types"

function uid(prefix = "id") {
  return prefix + "_" + Math.random().toString(36).slice(2, 9)
}

export const useGameStore = defineStore("game", () => {
  const participants = ref<Participant[]>([
    {
        "id": "p_n0027vs",
        "name": "Андрей",
        "themeId": "t_0m5wepx"
    },
    {
        "id": "p_vhtq9q5",
        "name": "Иван",
        "themeId": "t_qf8isaq"
    },
    {
        "id": "p_y2dic6y",
        "name": "Ника",
        "themeId": "t_qf8isaq"
    },
    {
        "id": "p_2a3n235",
        "name": "Женя",
        "themeId": "t_0m5wepx"
    },
    {
        "id": "p_8k4m9x2",
        "name": "Маша",
        "themeId": "t_movies"
    },
    {
        "id": "p_7h2n5v8",
        "name": "Дима",
        "themeId": "t_sports"
    },
    {
        "id": "p_3q9w1e4",
        "name": "Аня",
        "themeId": "t_music"
    },
    {
        "id": "p_6r4t7y2",
        "name": "Сергей",
        "themeId": "t_food"
    },
    {
        "id": "p_1u8i3o6",
        "name": "Катя",
        "themeId": "t_travel"
    },
    {
        "id": "p_5p9a2s4",
        "name": "Миша",
        "themeId": "t_tech"
    }
])
  const themes = ref<Theme[]>([
    {
        "id": "t_qf8isaq",
        "title": "Игры",
        "color": "#f93a00ff",
        "questions": [
            {
                "id": "q_0r1qbfr",
                "text": "ГТА или Ведьмак?",
                "isAnswered": false
            },
            {
                "id": "q_0r1tbfr",
                "text": "Консоль или ПК для игр?",
                "isAnswered": false
            },
            {
                "id": "q_0r4qbfr",
                "text": "Лучшая игра 2024 года?",
                "isAnswered": false
            },
            {
                "id": "q_2k8m4n7",
                "text": "Мобильные игры - за или против?",
                "isAnswered": false
            }
        ]
    },
    {
        "id": "t_0m5wepx",
        "title": "Вкусы",
        "color": "#ff8a65",
        "questions": [
            {
                "id": "q_p0txdrv",
                "text": "Сладкое или соленое?",
                "isAnswered": false
            },
            {
                "id": "q_p7txdrv",
                "text": "Кофе или чай?",
                "isAnswered": false
            },
            {
                "id": "q_p9txdrv",
                "text": "Лучшая кухня мира?",
                "isAnswered": false
            },
            {
                "id": "q_1n6b8v3",
                "text": "Пицца с ананасом - да или нет?",
                "isAnswered": false
            }
        ]
    },
    {
        "id": "t_movies",
        "title": "Фильмы",
        "color": "#9c27b0",
        "questions": [
            {
                "id": "q_m1v2e3s",
                "text": "Комедия или драма?",
                "isAnswered": false
            },
            {
                "id": "q_m4v5e6s",
                "text": "Лучший фильм всех времен?",
                "isAnswered": false
            },
            {
                "id": "q_m7v8e9s",
                "text": "Сериалы или фильмы?",
                "isAnswered": false
            },
            {
                "id": "q_m0v1e2s",
                "text": "Ремейки - нужны ли они?",
                "isAnswered": false
            }
        ]
    },
    {
        "id": "t_sports",
        "title": "Спорт",
        "color": "#4caf50",
        "questions": [
            {
                "id": "q_s1p2o3r",
                "text": "Футбол или баскетбол?",
                "isAnswered": false
            },
            {
                "id": "q_s4p5o6r",
                "text": "Смотреть спорт или заниматься?",
                "isAnswered": false
            },
            {
                "id": "q_s7p8o9r",
                "text": "Лучший спортсмен современности?",
                "isAnswered": false
            },
            {
                "id": "q_s0p1o2r",
                "text": "Экстремальные виды спорта - за?",
                "isAnswered": false
            }
        ]
    },
    {
        "id": "t_music",
        "title": "Музыка",
        "color": "#2196f3",
        "questions": [
            {
                "id": "q_m1u2s3i",
                "text": "Поп или рок?",
                "isAnswered": false
            },
            {
                "id": "q_m4u5s6i",
                "text": "Лучший исполнитель 2024?",
                "isAnswered": false
            },
            {
                "id": "q_m7u8s9i",
                "text": "Концерты или студийные записи?",
                "isAnswered": false
            },
            {
                "id": "q_m0u1s2i",
                "text": "Авторская песня - искусство?",
                "isAnswered": false
            }
        ]
    },
    {
        "id": "t_food",
        "title": "Еда",
        "color": "#ff9800",
        "questions": [
            {
                "id": "q_f1o2o3d",
                "text": "Домашняя или ресторанная еда?",
                "isAnswered": false
            },
            {
                "id": "q_f4o5o6d",
                "text": "Лучшее блюдо для праздника?",
                "isAnswered": false
            },
            {
                "id": "q_f7o8o9d",
                "text": "Веганство - мода или образ жизни?",
                "isAnswered": false
            },
            {
                "id": "q_f0o1o2d",
                "text": "Устрицы - деликатес или нет?",
                "isAnswered": false
            }
        ]
    },
    {
        "id": "t_travel",
        "title": "Путешествия",
        "color": "#00bcd4",
        "questions": [
            {
                "id": "q_t1r2a3v",
                "text": "Горы или море?",
                "isAnswered": false
            },
            {
                "id": "q_t4r5a6v",
                "text": "Лучшая страна для отдыха?",
                "isAnswered": false
            },
            {
                "id": "q_t7r8a9v",
                "text": "Отель или хостел?",
                "isAnswered": false
            },
            {
                "id": "q_t0r1a2v",
                "text": "Путешествовать в одиночку?",
                "isAnswered": false
            }
        ]
    },
    {
        "id": "t_tech",
        "title": "Технологии",
        "color": "#607d8b",
        "questions": [
            {
                "id": "q_t1e2c3h",
                "text": "Android или iOS?",
                "isAnswered": false
            },
            {
                "id": "q_t4e5c6h",
                "text": "ИИ - угроза или помощник?",
                "isAnswered": false
            },
            {
                "id": "q_t7e8c9h",
                "text": "Социальные сети - польза или вред?",
                "isAnswered": false
            },
            {
                "id": "q_t0e1c2h",
                "text": "Криптовалюты - будущее финансов?",
                "isAnswered": false
            }
        ]
    }
  ])
  const history = ref<RoundHistory[]>([])

  function addParticipant(name: string) {
    participants.value.push({ id: uid("p"), name })
  }
  function removeParticipant(id: string) {
    participants.value = participants.value.filter((p) => p.id !== id)
  }

  function addTheme(title: string, color: string, questionsText: string) {
    const qs = questionsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((t) => ({ id: uid("q"), text: t, isAnswered: false }))
    themes.value.push({ id: uid("t"), title, color, questions: qs })
  }

  function assignThemesRandom() {
    if (themes.value.length === 0) return
    const shuffled = [...participants.value].sort(() => 0.5 - Math.random())
    shuffled.forEach(
      (p, i) => (p.themeId = themes.value[i % themes.value.length].id)
    )
    // merge back
    participants.value = participants.value.map((p) => ({
      ...p,
      themeId: shuffled.find((s) => s.id === p.id)?.themeId ?? p.themeId,
    }))
  }

  function markQuestionAnswered(
    themeId: string,
    questionId: string,
    participantId?: string
  ) {
    const t = themes.value.find((x) => x.id === themeId)
    if (!t) return
    const q = t.questions.find((x) => x.id === questionId)
    if (q) q.isAnswered = true
    if (participantId)
      participants.value = participants.value.filter(
        (p) => p.id !== participantId
      )
    history.value.unshift({
      participantId: participantId || "unknown",
      themeId,
      questionId,
      answeredAt: new Date().toISOString(),
    })
  }

  function skipQuestion(
    themeId: string,
    questionId: string,
    participantId?: string
  ) {
    history.value.unshift({
      participantId: participantId || "unknown",
      themeId,
      questionId,
      skipped: true,
      answeredAt: null,
    })
  }

  function findUnansweredQuestions(themeId: string) {
    const t = themes.value.find((x) => x.id === themeId)
    return t ? t.questions.filter((q) => !q.isAnswered) : []
  }

  return {
    participants,
    themes,
    history,
    addParticipant,
    removeParticipant,
    addTheme,
    assignThemesRandom,
    markQuestionAnswered,
    skipQuestion,
    findUnansweredQuestions,
  }
})
