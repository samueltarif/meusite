<script setup lang="ts">
const migration = useProspectMigration()
const { hasLocalData, localLeadCount, localInteractionCount, migrating, migrationDone, migrationError, migrationNotice } = migration

onMounted(() => migration.detect())
</script>

<template>
  <div v-if="hasLocalData || migrationDone || migrationError" class="mb-5">
    <!-- Success state -->
    <div v-if="migrationDone && migrationNotice" class="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <p class="text-sm text-emerald-800">✓ {{ migrationNotice }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="migrationError" role="alert" class="rounded-xl border border-rose-200 bg-rose-50 p-4">
      <p class="text-sm text-rose-800">{{ migrationError }}</p>
      <p class="mt-2 text-xs text-rose-700">Seus dados locais permanecem intactos. Tente novamente ou exporte um backup.</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button class="min-h-9 rounded-lg border border-rose-300 bg-white px-4 text-xs text-rose-800 hover:bg-rose-50" @click="migration.exportLocalBackup">Exportar backup local</button>
        <button class="min-h-9 rounded-lg bg-rose-600 px-4 text-xs text-white hover:bg-rose-700" :disabled="migrating" @click="migration.migrate">Tentar novamente</button>
      </div>
    </div>

    <!-- Pending migration -->
    <div v-else-if="hasLocalData" class="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-amber-900">Dados locais encontrados</p>
          <p class="mt-1 text-xs text-amber-800">
            {{ localLeadCount }} empresa{{ localLeadCount !== 1 ? 's' : '' }} e
            {{ localInteractionCount }} interação{{ localInteractionCount !== 1 ? 'ões' : '' }}
            salvas neste navegador ainda não foram sincronizadas com o banco.
          </p>
        </div>
        <button class="shrink-0 text-xs text-amber-700 hover:underline" @click="migration.dismiss">Dispensar</button>
      </div>
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          class="min-h-9 rounded-lg border border-amber-300 bg-white px-4 text-xs text-amber-900 hover:bg-amber-50"
          @click="migration.exportLocalBackup"
        >
          Exportar backup local primeiro
        </button>
        <button
          class="min-h-9 rounded-lg bg-amber-700 px-4 text-xs text-white hover:bg-amber-800 disabled:opacity-60"
          :disabled="migrating"
          @click="migration.migrate"
        >
          <span v-if="migrating">Importando…</span>
          <span v-else>Importar para o banco agora</span>
        </button>
      </div>
      <p class="mt-3 text-[11px] leading-5 text-amber-700">
        A operação é segura e idempotente: registros já existentes no banco serão preservados. Os dados locais não serão apagados automaticamente.
      </p>
    </div>
  </div>
</template>
