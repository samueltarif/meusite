import type { Prospect } from '~/types/prospecting'
import { contactCounted, responseCounted } from './prospecting'
import { prospectStages } from '~/constants/prospecting'

export function outreachSummary(leads: Prospect[], target: number) {
  const contacted = leads.filter(contactCounted).length
  const responses = leads.filter(responseCounted).length
  const unanswered = leads.filter(lead => contactCounted(lead) && !responseCounted(lead)).length
  return {
    contacted, responses, unanswered,
    notContacted: leads.length - contacted,
    remaining: Math.max(0, target - responses),
    reached: responses >= target,
    progress: Math.min(100, target > 0 ? Math.round(responses / target * 100) : 0),
    stages: prospectStages.map(stage => ({ stage, count: leads.filter(lead => !lead.archived && lead.stage === stage).length })),
  }
}
