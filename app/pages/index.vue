<script setup lang="ts">
import IntakeForm from "../../components/IntakeForm.vue";
import StickyCTA from "../components/StickyCTA.vue";
const { data: page, pending } = await useAsyncData("index", () =>
  queryCollection("content").first(),
);

// Watch for page data and set SEO meta when available
watchEffect(() => {
  if (page.value) {
    useSeoMeta({
      title: page.value.seo?.title || page.value.title,
      ogTitle: page.value.seo?.title || page.value.title,
      description: page.value.seo?.description || page.value.description,
      ogDescription: page.value.seo?.description || page.value.description,
    });
  }
});

// Handle 404 if no page data
if (!page.value && !pending.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}
</script>

<template>
  <div v-if="pending" class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"
      />
      <p class="mt-4 text-muted">Loading...</p>
    </div>
  </div>

  <div v-else-if="page" class="relative">
    <div class="hidden lg:block">
      <UColorModeImage
        light="/images/light/line-1.svg"
        dark="/images/dark/line-1.svg"
        class="absolute pointer-events-none pb-10 left-0 top-0 object-cover h-[650px]"
      />
    </div>

    <UPageHero
      :description="page.description"
      :links="page.hero.links"
      :ui="{
        container: 'md:pt-18 lg:pt-20',
        title: 'max-w-3xl mx-auto',
      }"
    >
      <template #top>
        <HeroBackground />
      </template>

      <template #title>
        <MDC :value="page.title" unwrap="p" />
      </template>
    </UPageHero>

    <UPageSection
      id="section"
      :description="page.section.description"
      :features="page.section.features"
      orientation="horizontal"
      :ui="{
        container: 'lg:px-0 2xl:px-20 mx-0 max-w-none md:mr-10',
        features: 'gap-0',
      }"
      reverse
    >
      <template #title>
        <MDC :value="page.section.title" class="sm:*:leading-11" />
      </template>
      <img
        :src="page.section.images.desktop"
        :alt="page.section.title"
        class="hidden lg:block 2xl:hidden left-0 w-full max-w-2xl"
      />
      <img
        :src="page.section.images.mobile"
        :alt="page.section.title"
        class="block lg:hidden 2xl:block 2xl:w-full 2xl:max-w-2xl"
      />
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <!-- Intake Form Section - Moved up for better conversion -->
    <UPageSection
      id="intake-form"
      :title="page.intakeForm.title"
      :description="page.intakeForm.description"
      class="relative overflow-hidden"
    >
      <template #headline>
        <UColorModeImage
          light="/images/light/line-5.svg"
          dark="/images/dark/line-5.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24"
        />
      </template>
      <template #title>
        <MDC :value="page.intakeForm.title" />
      </template>
      <template #description>
        <MDC :value="page.intakeForm.description" />
        <div
          class="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium"
        >
          <UIcon name="i-lucide-zap" class="w-4 h-4" />
          Most cases reviewed within 24 hours
        </div>
      </template>
      <IntakeForm />
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <!-- Benefits Section from content.yml -->
    <UPageSection
      id="benefits"
      :description="page.features.description"
      :features="page.features.features"
      :ui="{
        title: 'text-left @container relative flex',
        description: 'text-left',
      }"
      class="relative overflow-hidden"
    >
      <div
        class="absolute rounded-full -left-10 top-10 size-[300px] z-10 bg-primary opacity-30 blur-[200px]"
      />
      <div
        class="absolute rounded-full -right-10 -bottom-10 size-[300px] z-10 bg-primary opacity-30 blur-[200px]"
      />
      <template #title>
        <MDC :value="page.features.title" class="*:leading-9" />
        <div class="hidden @min-[1020px]:block">
          <UColorModeImage
            light="/images/light/line-2.svg"
            dark="/images/dark/line-2.svg"
            class="absolute top-0 right-0 size-full transform scale-95 translate-x-[70%]"
          />
        </div>
      </template>
    </UPageSection>

    <!-- CTA after Benefits -->
    <UContainer class="py-8">
      <div class="text-center">
        <UButton
          to="#intake-form"
          size="xl"
          color="primary"
          variant="outline"
          class="px-8"
        >
          <template #leading>
            <UIcon name="i-lucide-phone-call" />
          </template>
          Get Your Free Consultation
        </UButton>
      </div>
    </UContainer>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <!-- Success Statistics - Moved up after form -->
    <UPageSection
      :title="page.successRecord.title"
      :description="page.successRecord.description"
      class="py-6"
    >
      <template #headline>
        <UColorModeImage
          light="/images/light/line-5.svg"
          dark="/images/dark/line-5.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24"
        />
      </template>

      <template #title>
        <MDC :value="page.successRecord.title" />
      </template>
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-primary mb-2">$50M+</div>
            <div class="text-gray-600 dark:text-gray-300">
              Total Compensation Recovered
            </div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary mb-2">2,500+</div>
            <div class="text-gray-600 dark:text-gray-300">
              Cases Successfully Resolved
            </div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary mb-2">95%</div>
            <div class="text-gray-600 dark:text-gray-300">
              Client Satisfaction Rate
            </div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary mb-2">24/7</div>
            <div class="text-gray-600 dark:text-gray-300">
              Client Support Available
            </div>
          </div>
        </div>
      </UContainer>
      <!-- CTA after Success Stats -->
      <UContainer>
        <div class="text-center">
          <UButton to="#intake-form" size="xl" color="primary" class="px-8">
            <template #leading>
              <UIcon name="i-lucide-arrow-right" />
            </template>
            Submit Your Case Now
          </UButton>
        </div>
      </UContainer>
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <!-- Testimonials Section from content.yml -->
    <UPageSection
      id="testimonials"
      :title="page.testimonials.title"
      :description="page.testimonials.description"
      :items="page.testimonials.items"
      :ui="{
        title: 'text-left @container relative flex',
        description: 'text-left',
      }"
    >
      <template #title>
        <MDC :value="page.testimonials.title" />
        <div class="hidden @min-[1020px]:block">
          <UColorModeImage
            light="/images/light/line-2.svg"
            dark="/images/dark/line-2.svg"
            class="absolute top-0 right-0 size-full transform scale-95 translate-x-[70%]"
          />
        </div>
      </template>

      <UContainer>
        <UPageColumns class="xl:columns-3">
          <UPageCard
            v-for="(testimonial, index) in page.testimonials.items"
            :key="index"
            variant="subtle"
            :description="testimonial.quote"
            :ui="{
              description:
                'before:content-[open-quote] after:content-[close-quote]',
            }"
          >
            <template #footer>
              <UUser v-bind="testimonial.user" size="xl" />
            </template>
          </UPageCard>
        </UPageColumns>
      </UContainer>
    </UPageSection>

    <USeparator />

    <!-- Final CTA Section from content.yml -->
    <UPageCTA
      v-bind="page.cta"
      variant="naked"
      class="overflow-hidden @container"
    >
      <template #title>
        <MDC :value="page.cta.title" />

        <div class="@max-[1280px]:hidden">
          <UColorModeImage
            light="/images/light/line-6.svg"
            dark="/images/dark/line-6.svg"
            class="absolute left-10 -top-10 sm:top-0 h-full"
          />
          <UColorModeImage
            light="/images/light/line-7.svg"
            dark="/images/dark/line-7.svg"
            class="absolute right-0 bottom-0 h-full"
          />
        </div>
      </template>

      <LazyStarsBg />
    </UPageCTA>

    <!-- Sticky CTA -->
    <StickyCTA />
  </div>
</template>
