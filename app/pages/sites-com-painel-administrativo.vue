<script setup lang="ts">
import SolutionLanding from '~/components/campaign/SolutionLanding.vue'
definePageMeta({ layout: 'marketing' })
const solution = useSolutionSeo('/sites-com-painel-administrativo')
</script>
<template><SolutionLanding :solution="solution" /></template>
