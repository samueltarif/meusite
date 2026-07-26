<template>
  <div class="min-h-screen flex flex-col bg-[#FCFCFC]">
    <LayoutHeader />

    <main class="flex-grow w-full">
      <slot />
    </main>

    <LayoutFooter />
    <LayoutBottomNav />
  </div>
</template>
