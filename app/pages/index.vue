<script setup lang="ts">
import IntakeForm from "../../components/IntakeForm.vue";
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

    <UPageSection
      id="features"
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

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection
      id="steps"
      :description="page.steps.description"
      class="relative overflow-hidden"
    >
      <template #headline>
        <UColorModeImage
          light="/images/light/line-3.svg"
          dark="/images/dark/line-3.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24"
        />
      </template>
      <template #title>
        <MDC :value="page.steps.title" />
      </template>

      <template #features>
        <UPageCard
          v-for="(step, index) in page.steps.items"
          :key="index"
          class="group"
          :ui="{ container: 'p-4 sm:p-4', title: 'flex items-center gap-1' }"
        >
          <UColorModeImage
            v-if="step.image"
            :light="step.image?.light"
            :dark="step.image?.dark"
            :alt="step.title"
            class="size-full"
          />

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold">
              {{ step.title }}
            </span>
            <span class="text-sm text-muted">
              {{ step.description }}
            </span>
          </div>
        </UPageCard>
      </template>
    </UPageSection>

    <UPageSection
      id="pricing"
      class="mb-32 overflow-hidden"
      :title="page.pricing.title"
      :description="page.pricing.description"
      :plans="page.pricing.plans"
      :ui="{ title: 'text-left @container relative', description: 'text-left' }"
    >
      <template #title>
        <MDC :value="page.pricing.title" />

        <div class="hidden @min-[1120px]:block">
          <UColorModeImage
            light="/images/light/line-4.svg"
            dark="/images/dark/line-4.svg"
            class="absolute top-0 right-0 size-full transform translate-x-[60%]"
          />
        </div>
      </template>

      <UPricingPlans scale>
        <UPricingPlan
          v-for="(plan, index) in page.pricing.plans"
          :key="index"
          :title="plan.title"
          :description="plan.description"
          :price="plan.price"
          :billing-period="plan.billing_period"
          :billing-cycle="plan.billing_cycle"
          :highlight="plan.highlight"
          :scale="plan.highlight"
          variant="soft"
          :features="plan.features"
          :button="plan.button"
        />
      </UPricingPlans>
    </UPageSection>

    <UPageSection
      id="testimonials"
      :title="page.testimonials.title"
      :description="page.testimonials.description"
      :items="page.testimonials.items"
    >
      <template #headline>
        <UColorModeImage
          light="/images/light/line-5.svg"
          dark="/images/dark/line-5.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24"
        />
      </template>
      <template #title>
        <MDC :value="page.testimonials.title" />
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

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <!-- Benefits Section -->
    <UPageSection
      id="benefits"
      title="Why Choose TakeYourCase.com?"
      description="Get the legal representation you deserve with our proven process and qualified lawyer network."
      class="py-16"
    >
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- No Cost Until We Win -->
          <UCard class="p-6 text-center">
            <div
              class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UIcon
                name="i-lucide-shield-check"
                class="w-8 h-8 text-green-600 dark:text-green-400"
              />
            </div>
            <h3 class="text-xl font-semibold mb-3">No Cost Until We Win</h3>
            <p class="text-gray-600 dark:text-gray-300">
              You pay nothing upfront. Our lawyers only get paid when you win
              your case, ensuring they're motivated to get you the best result.
            </p>
          </UCard>

          <!-- Qualified Lawyers -->
          <UCard class="p-6 text-center">
            <div
              class="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UIcon
                name="i-lucide-users"
                class="w-8 h-8 text-blue-600 dark:text-blue-400"
              />
            </div>
            <h3 class="text-xl font-semibold mb-3">Qualified Lawyer Network</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Our attorneys are carefully vetted and experienced in their
              practice areas. You get access to top-tier legal representation.
            </p>
          </UCard>

          <!-- Free Consultation -->
          <UCard class="p-6 text-center">
            <div
              class="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UIcon
                name="i-lucide-phone-call"
                class="w-8 h-8 text-purple-600 dark:text-purple-400"
              />
            </div>
            <h3 class="text-xl font-semibold mb-3">Free Consultation</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Get a free initial consultation to discuss your case. No
              obligation, no pressure - just expert legal advice.
            </p>
          </UCard>

          <!-- Personal Injury Specialists -->
          <UCard class="p-6 text-center">
            <div
              class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UIcon
                name="i-lucide-heart-handshake"
                class="w-8 h-8 text-red-600 dark:text-red-400"
              />
            </div>
            <h3 class="text-xl font-semibold mb-3">
              Personal Injury Specialists
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              We handle car accidents, workplace injuries, medical malpractice,
              and other personal injury cases with proven results.
            </p>
          </UCard>

          <!-- Consumer Protection -->
          <UCard class="p-6 text-center">
            <div
              class="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UIcon
                name="i-lucide-shield-alert"
                class="w-8 h-8 text-orange-600 dark:text-orange-400"
              />
            </div>
            <h3 class="text-xl font-semibold mb-3">Consumer Protection</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Fight back against unfair business practices, defective products,
              and consumer rights violations.
            </p>
          </UCard>

          <!-- 24/7 Support -->
          <UCard class="p-6 text-center">
            <div
              class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UIcon
                name="i-lucide-clock"
                class="w-8 h-8 text-indigo-600 dark:text-indigo-400"
              />
            </div>
            <h3 class="text-xl font-semibold mb-3">24/7 Case Support</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Get updates on your case anytime. Our team is here to answer
              questions and provide support throughout your legal journey.
            </p>
          </UCard>
        </div>
      </UContainer>
    </UPageSection>

    <!-- Process Section -->
    <UPageSection
      title="How Our Process Works"
      description="From case submission to compensation, we guide you through every step"
      class="py-16 bg-gray-50 dark:bg-gray-900/50"
    >
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div
              class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span class="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Submit Your Case</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Fill out our secure intake form with details about your legal
              situation. It takes just 5 minutes and is completely confidential.
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span class="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Get Matched & Consult</h3>
            <p class="text-gray-600 dark:text-gray-300">
              We review your case and match you with a qualified lawyer. Get a
              free consultation to discuss your options and next steps.
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span class="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Win Your Case</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Your lawyer builds a strong case and fights for maximum
              compensation. You only pay when you win - no upfront costs.
            </p>
          </div>
        </div>
      </UContainer>
    </UPageSection>

    <!-- Success Statistics -->
    <UPageSection
      title="Our Success Record"
      description="Numbers that speak for themselves"
      class="py-16"
    >
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
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection id="contact" class="relative overflow-hidden">
      <IntakeForm />
    </UPageSection>
  </div>
</template>
