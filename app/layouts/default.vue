<template>
  <div class="min-h-screen flex flex-col bg-[#050212]">
    <LayoutHeader />

    <main class="flex-grow w-full">
      <slot />
    </main>

    <LayoutFooter />
    <LayoutBottomNav />
  </div>
</template>
