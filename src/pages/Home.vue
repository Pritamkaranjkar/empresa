<template>
  <div class="min-h-screen bg-[#FBFBFB] text-[#1D1D1F] font-sans antialiased selection:bg-[#007AFF]/20 overflow-x-hidden">
    <!-- Importing and adding AuthModal and PricingModal -->
    <AuthModal :is-open="isAuthOpen" @close="isAuthOpen = false" @open-register="() => { isAuthOpen = false; isRegisterOpen = true }" />
    <PricingModal :is-open="isPricingOpen" @close="isPricingOpen = false"  @open-login="isAuthOpen = true" />
    <RegisterModal :is-open="isRegisterOpen" @close="isRegisterOpen = false" @open-login="() => { isRegisterOpen = false; isAuthOpen = true }" />
    
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-[#FBFBFB]/80 backdrop-blur-xl border-b border-black/5">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <a href="#" class="text-xl font-bold tracking-tight">EMPRESA</a>
          <div class="hidden md:flex items-center gap-8 text-[13px] font-medium text-black/60">
            <a v-for="link in navLinks" :key="link" 
              href="javascript:void(0)" 
              @click="link === 'Pricing' ? (isPricingOpen = true) : scrollTo(link)"
              class="hover:text-black transition-colors"
            >
              {{ link }}
            </a>
          </div>
        </div>
        <div class="flex items-center gap-5">
          <!-- desktop only links hidden on small screens -->
          <button @click="isAuthOpen = true" class="hidden sm:block text-[13px] font-medium text-black/60 hover:text-black transition-colors">Log In</button>
          <button @click="isPricingOpen = true" class="bg-black text-white px-5 py-2 rounded-full text-[13px] font-medium hover:bg-black/80 transition-all active:scale-95 shadow-lg shadow-black/5">
            Book a Demo
          </button>
          <!-- added mobile menu toggle -->
          <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 text-black/60 hover:text-black transition-colors">
            <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- added mobile navigation menu -->
      <transition 
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="isMenuOpen" class="md:hidden bg-[#FBFBFB] border-b border-black/5 px-6 py-8 space-y-6 shadow-xl">
          <div class="flex flex-col gap-6">
            <a v-for="link in navLinks" :key="link" 
              href="javascript:void(0)" 
              @click="handleMobileLinkClick(link)"
              class="text-2xl font-medium text-black/80 hover:text-black"
            >
              {{ link }}
            </a>
          </div>
          <div class="pt-6 border-t border-black/5 flex flex-col gap-4">
            <button @click="isAuthOpen = true; isMenuOpen = false" class="text-lg font-medium text-black/60 text-left">Log In</button>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Hero Section -->
    <header class="pt-32 md:pt-48 pb-20 md:pb-32 px-6 text-center">
      <div 
        class="max-w-5xl mx-auto transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1)"
        :class="[isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95']"
      >
        <span class="inline-block px-4 py-1.5 rounded-full bg-black/5 text-[10px] md:text-[12px] font-semibold tracking-wider uppercase mb-6 md:mb-8 animate-fade-in">
          The Business Operating System
        </span>
        <!-- responsive font sizes for hero -->
        <h1 class="text-4xl sm:text-6xl md:text-[5.5rem] font-serif tracking-tight leading-[1.1] md:leading-[1.05] mb-8 md:mb-10">
          The unified foundation <br class="hidden sm:block" />
          <span class="text-black/30 italic">for</span> operational <span class="relative">
            excellence
            <span class="absolute -bottom-1 md:-bottom-2 left-0 w-full h-0.5 md:h-1 bg-[#007AFF]/20 rounded-full"></span>
          </span>
        </h1>
        <p class="text-lg md:text-2xl text-black/60 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-14 font-light">
          Empresa centralizes every critical function—from billing to operational reporting—into a single, secure cloud platform for total visibility.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          <button @click="isPricingOpen = true" class="w-full sm:w-auto bg-black text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full text-base md:text-lg font-medium hover:scale-105 transition-transform active:scale-95 shadow-2xl shadow-black/10">
            Get Started Free
          </button>
          <button class="w-full sm:w-auto flex items-center justify-center gap-3 group px-8 md:px-10 py-3.5 md:py-4 rounded-full border border-black/10 hover:bg-black/5 transition-all text-base md:text-lg">
            Watch the vision
            <div class="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-[#007AFF] group-hover:text-white transition-colors">
              <svg class="w-3 h-3 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </header>

    <!-- Unified OS Showcase (Dark Mode) -->
    <section class="py-12 md:py-20 px-4 md:px-6">
      <div class="max-w-7xl mx-auto bg-[#0a0a0a] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative">
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div class="p-8 md:p-28 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div class="reveal" v-reveal>
            <span class="text-[#007AFF] font-bold tracking-[0.2em] text-[10px] md:text-[11px] uppercase mb-4 md:mb-6 block">Visibility & Control</span>
            <h2 class="text-4xl md:text-7xl font-medium text-white leading-[1.1] mb-6 md:mb-10 tracking-tight">
              A single source <br />
              <span class="text-white/30">of truth.</span>
            </h2>
            <p class="text-lg md:text-xl text-white/50 mb-8 md:mb-12 leading-relaxed font-light max-w-md">
              Replace fragmented, brittle systems with a unified foundation. Empower your team with clearly defined responsibilities while maintaining real-time insight.
            </p>
            <div class="flex flex-wrap gap-4 md:gap-5">
              <div v-for="feature in quickFeatures" :key="feature" class="flex items-center gap-2 text-white/80 text-xs md:text-sm">
                <div class="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <svg class="w-2.5 h-2.5 md:w-3 md:h-3 text-[#007AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                {{ feature }}
              </div>
            </div>
          </div>
          
          <!-- Interactive Mockup -->
          <div class="relative group reveal" v-reveal>
            <div class="bg-[#1C1C1E] rounded-2xl md:rounded-3xl border border-white/10 p-1 shadow-3xl overflow-hidden">
              <div class="bg-[#2C2C2E] p-3 md:p-4 flex items-center justify-between border-b border-white/5">
                <div class="flex gap-1.5 md:gap-2">
                  <div class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF5F57]"></div>
                  <div class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FEB12F]"></div>
                  <div class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#28C840]"></div>
                </div>
                <div class="text-[8px] md:text-[10px] text-white/40 font-mono tracking-widest uppercase">Empresa OS</div>
              </div>
              <div class="p-4 md:p-8 space-y-6 md:space-y-8">
                <div class="grid grid-cols-3 gap-3 md:gap-6">
                  <div v-for="i in 3" :key="i" class="h-14 md:h-20 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 p-3 md:p-4 relative overflow-hidden group/card">
                    <div class="absolute inset-0 bg-[#007AFF]/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    <div class="h-1 w-1/2 bg-white/10 rounded-full mb-2 md:mb-3"></div>
                    <div class="h-3 md:h-4 w-full bg-white/20 rounded-lg"></div>
                  </div>
                </div>
                <div class="h-32 md:h-48 bg-white/[0.02] rounded-2xl md:rounded-3xl border border-white/5 p-4 md:p-6 relative overflow-hidden">
                  <div class="flex items-end gap-1.5 md:gap-2 h-full justify-around pt-6 md:pt-8">
                    <div v-for="h in [40, 70, 50, 90, 60, 80, 55]" :key="h" 
                         class="w-full bg-[#007AFF]/20 rounded-t-lg transition-all duration-1000 group-hover:bg-[#007AFF]" 
                         :style="{ height: h + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Floating element - hidden on small screens -->
            <div class="absolute -bottom-6 -left-6 bg-white text-black p-4 md:p-5 rounded-2xl shadow-2xl border border-black/5 max-w-[150px] md:max-w-[180px] hidden sm:block animate-bounce-subtle">
              <div class="text-[9px] md:text-[10px] font-bold text-black/40 uppercase mb-1 md:mb-2">Live Efficiency</div>
              <div class="text-2xl md:text-3xl font-serif">99.4%</div>
              <div class="text-[9px] md:text-[10px] text-green-500 font-bold">+12% vs last month</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modules Bento Grid -->
    <section id="platform" class="py-16 md:py-32 px-4 md:px-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 md:mb-24 reveal" v-reveal>
          <span class="text-[#007AFF] font-bold tracking-widest text-[10px] md:text-[11px] uppercase mb-3 md:mb-4 block">The Ecosystem</span>
          <h2 class="text-4xl md:text-7xl font-serif mb-6 md:mb-8 tracking-tight italic">A unified OS for your business</h2>
          <p class="text-lg md:text-xl text-black/50 max-w-2xl mx-auto font-light leading-relaxed px-4">Seven high-performance modules designed to work as one.</p>
        </div>

        <!-- responsive grid gap and padding -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
          <!-- Billing & Bookkeeping (Large) -->
          <div class="sm:col-span-2 lg:col-span-4 bg-[#F5F5F7] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden group reveal" v-reveal>
            <div class="relative z-10 h-full flex flex-col">
              <div class="mb-8 md:mb-12">
                <div class="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500">
                  <svg class="w-6 h-6 md:w-7 md:h-7 text-[#007AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 class="text-3xl md:text-4xl font-semibold mb-4 md:mb-6 tracking-tight">Billing & Accounting</h3>
                <p class="text-black/50 text-lg md:text-xl font-light leading-relaxed max-w-md">The core financial engine. From automated invoicing to GAAP-compliant ledgers and deep accounting control.</p>
              </div>
              <div class="mt-auto pt-6 flex flex-wrap gap-2 md:gap-3">
                <span v-for="tag in ['Invoicing', 'Compliance', 'Ledgers']" :key="tag" class="px-4 md:px-5 py-1.5 md:py-2 bg-white rounded-full text-[10px] md:text-[12px] font-semibold text-black/40 shadow-sm">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- Product Management (Small) -->
          <div class="sm:col-span-2 lg:col-span-2 bg-black rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden group reveal" v-reveal>
            <div class="relative z-10">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:rotate-[15deg] transition-transform">
                <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <h3 class="text-xl md:text-2xl font-semibold mb-3 md:mb-4 tracking-tight">Product Management</h3>
              <p class="text-white/40 text-base md:text-lg font-light leading-relaxed">Strategic control over your catalog, from lifecycle to profitability.</p>
            </div>
          </div>

          <!-- Inventory Management (Medium) -->
          <div class="sm:col-span-1 lg:col-span-3 bg-[#F5F5F7] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden group reveal" v-reveal>
            <div class="relative z-10">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-6 md:mb-8">
                <svg class="w-5 h-5 md:w-6 md:h-6 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h3 class="text-2xl md:text-3xl font-semibold mb-3 md:mb-4 tracking-tight">Inventory Management</h3>
              <p class="text-black/50 text-base md:text-lg font-light leading-relaxed max-w-xs">Intelligent stock tracking and multi-location logistics.</p>
            </div>
          </div>

          <!-- Analytics (Wide) -->
          <div class="sm:col-span-1 lg:col-span-3 bg-[#007AFF] text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden group reveal" v-reveal>
            <div class="relative z-10">
              <div class="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8">
                <svg class="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
              </div>
              <h3 class="text-3xl md:text-4xl font-semibold mb-4 md:mb-6 tracking-tight">Analytics (P/L)</h3>
              <p class="text-white/70 text-lg md:text-xl font-light leading-relaxed max-w-md">Real-time profitability insights. Understand your margins across every department.</p>
            </div>
          </div>

          <!-- Live-Kitchen -->
          <div class="sm:col-span-2 lg:col-span-6 bg-white border border-black/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10 md:gap-12 group reveal" v-reveal>
            <div class="lg:w-1/2">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-orange-500/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8">
                <svg class="w-5 h-5 md:w-6 md:h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.989 7.989 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
              </div>
              <h3 class="text-3xl md:text-4xl font-semibold mb-4 md:mb-6 tracking-tight">Live-Kitchen</h3>
              <p class="text-black/50 text-lg md:text-xl font-light leading-relaxed">High-velocity operational workflow designed specifically for hospitality environments.</p>
            </div>
            <div class="lg:w-1/2 bg-[#F5F5F7] rounded-2xl md:rounded-3xl h-48 md:h-64 w-full relative overflow-hidden">
              <div class="absolute inset-6 md:inset-8 space-y-3 md:space-y-4">
                <div class="flex gap-3 md:gap-4">
                  <div class="h-8 md:h-10 w-24 md:w-32 bg-white rounded-lg md:rounded-xl shadow-sm"></div>
                  <div class="h-8 md:h-10 w-16 md:w-24 bg-white rounded-lg md:rounded-xl shadow-sm"></div>
                </div>
                <div class="h-20 md:h-24 w-full bg-white rounded-xl md:rounded-2xl shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-16 md:py-28 px-4 md:px-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 md:mb-24 reveal" v-reveal>
          <h2 class="text-5xl md:text-8xl font-serif mb-8 md:mb-12 tracking-tight italic">Exquisite value.</h2>
          <p class="text-xl md:text-2xl text-black/40 max-w-2xl mx-auto font-light leading-relaxed px-4">Modern pricing built for transparency and scale.</p>
          <button @click="isPricingOpen = true" class="mt-8 md:mt-12 group flex items-center gap-3 md:gap-4 mx-auto text-lg md:text-xl font-medium">
            Explore all plans
            <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-2 transition-transform duration-500">
              <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-32 px-4 md:px-6 bg-white">
      <div class="max-w-4xl mx-auto text-center reveal" v-reveal>
        <h2 class="text-4xl md:text-7xl font-serif mb-8 md:mb-12 tracking-tight italic leading-tight px-4">Ready to take control?</h2>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-6">
          <button @click="isPricingOpen = true" class="w-full sm:w-auto bg-black text-white px-10 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl font-medium hover:scale-105 transition-transform">Get Started Now</button>
          <button class="w-full sm:w-auto text-base md:text-lg font-medium border-b border-black/20 hover:border-black transition-all py-1 px-2">Contact Enterprise Sales</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-16 md:py-32 px-6 bg-white border-t border-black/5">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
        <div class="max-w-xs">
          <a href="#" class="text-xl font-bold tracking-tight mb-6 md:mb-8 block uppercase">EMPRESA</a>
          <p class="text-sm text-black/40 leading-relaxed font-light">
            Built on enterprise-grade cloud infrastructure, Empresa adapts to different industries without adding complexity.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16 w-full md:w-auto">
          <div v-for="group in footerLinks" :key="group.title">
            <h4 class="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-black/40 mb-6 md:mb-8">{{ group.title }}</h4>
            <ul class="space-y-4 md:space-y-5">
              <li v-for="link in group.links" :key="link">
                <a href="#" class="text-[13px] md:text-[14px] text-black/60 hover:text-[#007AFF] transition-colors font-light">{{ link }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto mt-16 md:mt-24 pt-10 md:pt-12 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center text-[10px] md:text-[11px] text-black/30 font-medium tracking-wide gap-6">
        <p class="text-center sm:text-left">&copy; 2025 Empresa Inc. Designed in California. All rights reserved.</p>
        <div class="flex gap-6 md:gap-8">
          <a href="#" class="hover:text-black transition-colors uppercase">Privacy</a>
          <a href="#" class="hover:text-black transition-colors uppercase">Terms</a>
          <a href="#" class="hover:text-black transition-colors uppercase">Security</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PricingModal from '../components/Pricing.vue'
import AuthModal from '../pages/Login.vue'
import RegisterModal from '../pages/Register.vue'

const isMounted = ref(false)
const isPricingOpen = ref(false)
const isAuthOpen = ref(false)
const isRegisterOpen = ref(false)
const isMenuOpen = ref(false) // state for mobile menu

// Custom reveal directive logic
const vReveal = {
  mounted: (el) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' })
    observer.observe(el)
  }
}

const scrollTo = (id) => {
  const el = document.getElementById(id.toLowerCase())
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const handleMobileLinkClick = (link) => {
  isMenuOpen.value = false
  if (link === 'Pricing') {
    isPricingOpen.value = true
  } else {
    scrollTo(link)
  }
}

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})

const navLinks = ['Platform', 'Solutions', 'Pricing', 'Resources']
const quickFeatures = ['Real-time Reporting', 'Scalable Security', 'Unified Ledger']

const footerLinks = [
  {
    title: 'Operating System',
    links: ['Billing', 'Inventory', 'Analytics', 'Kitchen']
  },
  {
    title: 'Company',
    links: ['About', 'News', 'Contact', 'Careers']
  },
  {
    title: 'Support',
    links: ['Documentation', 'API Reference', 'Status', 'Security']
  }
]
</script>

<style>
/* Hide scrollbar but keep scroll */
html, body {
  overflow-x: hidden;
  scrollbar-width: none;       /* Firefox */
  -ms-overflow-style: none;    /* IE & Edge */
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;               /* Chrome, Safari */
}
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.revealed {
  opacity: 1;
  transform: translateY(0);
}
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-subtle {
  animation: bounce-subtle 4s infinite ease-in-out;
}
</style>
