<script setup lang="ts">
useSeoMeta({
  title: "Benefits - TakeYourCase.com",
  ogTitle: "Benefits - TakeYourCase.com",
  description:
    "Learn about the benefits of using TakeYourCase.com for your legal needs. No cost until we win, qualified lawyers, and expert representation.",
  ogDescription:
    "Learn about the benefits of using TakeYourCase.com for your legal needs. No cost until we win, qualified lawyers, and expert representation.",
});
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <UPageHero
      title="Why Choose TakeYourCase.com?"
      description="Get the legal representation you deserve with our proven process and qualified lawyer network."
      class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
    >
      <template #links>
        <UButton
          to="#intake-form"
          size="xl"
          color="primary"
          trailing-icon="i-lucide-arrow-right"
        >
          Submit Your Case
        </UButton>
        <UButton
          to="/"
          size="xl"
          color="neutral"
          variant="outline"
          icon="i-lucide-home"
        >
          Back to Home
        </UButton>
      </template>
    </UPageHero>

    <!-- Main Benefits Section -->
    <UPageSection
      title="Our Core Benefits"
      description="What makes TakeYourCase.com the right choice for your legal needs"
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

    <!-- CTA Section -->
    <UPageSection class="py-16 bg-primary text-white">
      <UContainer>
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p class="text-xl mb-8 opacity-90">
            Submit your case today and get connected with a qualified lawyer.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/#intake-form"
              size="xl"
              color="white"
              variant="solid"
              trailing-icon="i-lucide-arrow-right"
            >
              Submit Your Case
            </UButton>
            <UButton
              to="/"
              size="xl"
              color="white"
              variant="outline"
              icon="i-lucide-home"
            >
              Back to Home
            </UButton>
          </div>
        </div>
      </UContainer>
    </UPageSection>
  </div>
</template>
