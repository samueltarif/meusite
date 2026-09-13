import { ref, computed } from 'vue'
import type { ProspectData } from '~/types/prospecting'
import { loadProspecting, downloadProspecting } from '~/services/prospecting'
import { apiImport } from '~/services/prospecting-api'
import { prospectStorageKey } from '~/constants/prospecting'

/**
 * Detects local data from localStorage and handles migration to Supabase.
 * Call this composable from Workspace after confirming the user is a CRM member.
 */
export function useProspectMigration() {
  const localData = ref<ProspectData | null>(null)
  const migrating = ref(false)
  const migrationDone = ref(false)
  const migrationError = ref('')
  const migrationNotice = ref('')

  function detect() {
    try {
      const raw = localStorage.getItem(prospectStorageKey)
      if (!raw) return
      const parsed = loadProspecting()
      if (parsed.leads.length > 0) {
        localData.value = parsed
      }
    } catch {
      // localStorage not available or data corrupted — skip silently
    }
  }

  const hasLocalData = computed(() => (localData.value?.leads.length ?? 0) > 0)
  const localLeadCount = computed(() => localData.value?.leads.length ?? 0)
  const localInteractionCount = computed(() =>
    localData.value?.leads.reduce((sum, lead) => sum + (lead.history?.length ?? 0), 0) ?? 0
  )

  function exportLocalBackup() {
    if (localData.value) {
      downloadProspecting(localData.value)
    }
  }

  async function migrate(): Promise<boolean> {
    if (!localData.value) return false
    migrating.value = true
    migrationError.value = ''

    try {
      const result = await apiImport(localData.value)
      migrationNotice.value = `Migração concluída: ${result.imported_leads} empresa(s) e ${result.imported_interactions} interação(ões) importadas. Os dados locais foram preservados no navegador como backup.`
      migrationDone.value = true
      localData.value = null
      return true
    } catch (err: any) {
      migrationError.value = err?.data?.statusMessage || err?.message || 'Erro durante a migração. Seus dados locais estão intactos.'
      return false
    } finally {
      migrating.value = false
    }
  }

  function dismiss() {
    localData.value = null
  }

  return {
    localData, hasLocalData, localLeadCount, localInteractionCount,
    migrating, migrationDone, migrationError, migrationNotice,
    detect, exportLocalBackup, migrate, dismiss,
  }
}
