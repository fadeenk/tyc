<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items: NavigationMenuItem[] = [
  {
    label: "Privacy Policy",
    to: "/privacy-policy",
  },
  {
    label: "Terms of Service",
    to: "/terms-of-service",
  },
  {
    label: "Contact Us",
    to: "/contact",
  },
];
</script>

<template>
  <USeparator icon="i-simple-icons-nuxtdotjs" class="h-px" />

  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        TYC INTAKE • © {{ new Date().getFullYear() }} All Rights Reserved
      </p>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #bottom>
      <UContainer>
        <p class="text-xs text-muted text-center">
          The information on this website is for general information purposes
          only. Nothing on this site should be taken as legal advice for any
          individual case or situation. This information is not intended to
          create, and receipt or viewing does not constitute, an attorney-client
          relationship. This website may constitute attorney advertising. Prior
          results do not guarantee a similar outcome.
        </p>
      </UContainer>
    </template>
  </UFooter>
</template>
