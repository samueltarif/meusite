import type { Prospect } from '~/types/prospecting'
import { getLeadContactStatus } from './prospecting'
import { prospectStages } from '~/constants/prospecting'

export function outreachSummary(leads: Prospect[], target: number) {
  // Same resolver and population as the active cards. Old interactions never override their current status.
  const active = leads.filter(lead => !lead.archived)
  const statuses = active.map(getLeadContactStatus)
  const responses = statuses.filter(status => status === 'Contato realizado').length
  const noAnswer = statuses.filter(status => status === 'Não atendeu').length
  const noReply = statuses.filter(status => status === 'Não respondeu').length
  const notContacted = statuses.filter(status => status === 'Nenhum contato').length
  return {
    contacted: responses, responses, noAnswer, noReply,
    attempted: responses + noAnswer + noReply,
    unanswered: noAnswer + noReply, notContacted,
    remaining: Math.max(0, target - responses),
    reached: responses >= target,
    progress: Math.min(100, target > 0 ? Math.round(responses / target * 100) : 0),
    stages: prospectStages.map(stage => ({ stage, count: active.filter(lead => lead.stage === stage).length })),
  }
}
