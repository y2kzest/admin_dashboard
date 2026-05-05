<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">

    <!-- Mobile sidebar backdrop -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen && isMobile"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar: always visible on desktop, slide-in on mobile -->
    <Transition name="sidebar">
      <div
        v-show="sidebarOpen || !isMobile"
        class="fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto flex-shrink-0"
        :class="isMobile && !sidebarOpen ? 'hidden' : 'flex'"
      >
        <AdminSidebar />
      </div>
    </Transition>

    <!-- Main content area -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <AdminHeader />
      <main class="flex-1 overflow-y-auto px-8 py-7">
        <slot />
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const sidebarOpen = useState<boolean>('sidebarOpen', () => true);
const isMobile = ref(false);

function checkMobile() {
  isMobile.value = window.innerWidth < 1024;
  if (isMobile.value) sidebarOpen.value = false;
  else sidebarOpen.value = true;
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>
