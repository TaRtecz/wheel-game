export interface Question { id: string; text: string; isAnswered: boolean }
export interface Theme { id: string; title: string; color: string; questions: Question[] }
export interface Participant { id: string; name: string; themeId?: string }
export interface RoundHistory { participantId: string; themeId: string; questionId: string; skipped?: boolean; answeredAt?: string | null }