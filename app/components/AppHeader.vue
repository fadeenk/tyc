<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { activeHeadings, updateHeadings } = useScrollspy();

const items = computed(() => [
  {
    label: "Process",
    to: "#section",
    active: activeHeadings.value.includes("section"),
  },
  {
    label: "Benefits",
    to: "#benefits",
    active: activeHeadings.value.includes("benefits"),
  },
  {
    label: "Testimonials",
    to: "#testimonials",
    active: activeHeadings.value.includes("testimonials"),
  },
]);

nuxtApp.hooks.hookOnce("page:finish", () => {
  updateHeadings(
    [
      document.querySelector("#section"),
      document.querySelector("#benefits"),
      document.querySelector("#testimonials"),
    ].filter(Boolean) as Element[],
  );
});
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <template #right>
      <UNavigationMenu :items="items" variant="link" class="hidden lg:block" />

      <UButton
        to="#intake-form"
        label="Submit Case"
        color="primary"
        class="hidden lg:block"
      />

      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      <UButton
        to="#intake-form"
        class="mt-4"
        label="Submit Case"
        color="primary"
        block
      />
    </template>
  </UHeader>
</template>
