<script setup lang="ts">
const isVisible = ref(false)

onMounted(() => {
  const handleScroll = () => {
    const heroHeight = 600 // Approximate hero section height
    isVisible.value = window.scrollY > heroHeight
  }

  window.addEventListener('scroll', handleScroll)

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-6 right-6 z-50"
    >
      <UButton
        to="#intake-form"
        size="lg"
        color="primary"
        class="shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        :ui="{
          rounded: 'rounded-full',
          padding: 'px-6 py-3'
        }"
      >
        <template #leading>
          <UIcon name="i-lucide-arrow-right" />
        </template>
        Submit Case
      </UButton>
    </div>
  </Transition>
</template>
