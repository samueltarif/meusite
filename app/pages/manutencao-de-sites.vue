<script setup lang="ts">
import SolutionLanding from '~/components/campaign/SolutionLanding.vue'
definePageMeta({ layout: 'marketing' })
const solution = useSolutionSeo('/manutencao-de-sites')
</script>
<template><SolutionLanding :solution="solution" /></template>
