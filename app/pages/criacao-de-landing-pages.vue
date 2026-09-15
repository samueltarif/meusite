<script setup lang="ts">
import SolutionLanding from '~/components/campaign/SolutionLanding.vue'
definePageMeta({ layout: 'marketing' })
const solution = useSolutionSeo('/criacao-de-landing-pages')
</script>
<template><SolutionLanding :solution="solution" /></template>
