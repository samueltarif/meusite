<template>
  <div class="min-h-screen flex flex-col">
    <LayoutHeader />

    <main class="flex-grow pt-16 lg:pt-0">
      <slot />
    </main>

    <LayoutFooter />
    <LayoutBottomNav />
  </div>
</template>
