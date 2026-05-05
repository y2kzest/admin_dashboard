<template>
  <div class="flex h-full overflow-hidden" style="height: calc(100vh - 4rem);">

    <!-- ── Conversation List (left panel) ── -->
    <div class="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div class="px-5 py-4 border-b border-slate-100">
        <h2 class="text-sm font-bold text-slate-800">Buyer Support</h2>
        <p class="text-xs text-slate-400 mt-0.5">Help requests from buyers</p>
      </div>

      <!-- Loading state -->
      <div v-if="loadingConvos" class="flex-1 flex items-center justify-center">
        <svg class="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>

      <!-- Empty state -->
      <div v-else-if="conversations.length === 0 && !fetchError" class="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-slate-500">No support chats yet</p>
        <p class="text-xs text-slate-400 mt-1">Buyer messages will appear here</p>
      </div>

      <!-- Error state -->
      <div v-else-if="fetchError" class="flex-1 flex flex-col items-center justify-center text-center px-5">
        <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-sm font-semibold text-red-600 mb-1">Access error</p>
        <p class="text-xs text-slate-500 break-all">{{ fetchError }}</p>
        <button @click="fetchConversations" class="mt-3 text-xs text-indigo-600 underline">Retry</button>
      </div>

      <!-- Conversation list -->
      <div v-else class="flex-1 overflow-y-auto divide-y divide-slate-100">
        <button
          v-for="c in conversations"
          :key="c.id"
          class="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
          :class="selectedId === c.id ? 'bg-indigo-50' : 'hover:bg-slate-50'"
          @click="selectConversation(c)"
        >
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <img
              v-if="c.buyer_avatar"
              :src="c.buyer_avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div v-else class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold">
              {{ initials(c.buyer_name) }}
            </div>
            <!-- Unread badge -->
            <span
              v-if="c.unread_admin > 0"
              class="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#F9B023] text-white text-[10px] font-bold flex items-center justify-center"
            >{{ c.unread_admin }}</span>
          </div>
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ c.buyer_name || 'Buyer' }}</p>
            <p class="text-xs text-slate-400 truncate mt-0.5">{{ c.last_message || 'No messages yet' }}</p>
          </div>
          <!-- Time -->
          <span class="flex-shrink-0 text-[10px] text-slate-400 ml-1">{{ formatTime(c.last_message_time) }}</span>
        </button>
      </div>
    </div>

    <!-- ── Chat panel (right) ── -->
    <div class="flex-1 flex flex-col bg-slate-50 min-w-0">

      <!-- No conversation selected -->
      <div v-if="!selectedConvo" class="flex-1 flex flex-col items-center justify-center text-center px-8">
        <div class="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1M9 6H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l4-4h4a2 2 0 002-2V8a2 2 0 00-2-2z"/>
          </svg>
        </div>
        <p class="text-sm font-semibold text-slate-600">Select a conversation</p>
        <p class="text-xs text-slate-400 mt-1">Choose a buyer's support request from the left panel</p>
      </div>

      <template v-else>
        <!-- Chat header -->
        <div class="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-3">
          <img
            v-if="selectedConvo.buyer_avatar"
            :src="selectedConvo.buyer_avatar"
            class="w-9 h-9 rounded-full object-cover"
          />
          <div v-else class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold">
            {{ initials(selectedConvo.buyer_name) }}
          </div>
          <div>
            <p class="text-sm font-bold text-slate-800">{{ selectedConvo.buyer_name || 'Buyer' }}</p>
            <p class="text-xs text-slate-400">{{ selectedConvo.buyer_email || '' }}</p>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <div v-if="loadingMessages" class="flex justify-center py-8">
            <svg class="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.sender_id === adminId ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-xs lg:max-w-sm xl:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
              :class="msg.sender_id === adminId
                ? 'bg-[#2A4BA0] text-white rounded-br-none'
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'"
            >
              <p>{{ msg.content }}</p>
              <p
                class="text-[10px] mt-1"
                :class="msg.sender_id === adminId ? 'text-indigo-200 text-right' : 'text-slate-400'"
              >{{ formatMsgTime(msg.created_at) }}</p>
            </div>
          </div>
          <div ref="bottomAnchor"></div>
        </div>

        <!-- Input -->
        <div class="px-6 py-4 bg-white border-t border-slate-200">
          <div class="flex items-end gap-3">
            <textarea
              v-model="newMessage"
              rows="1"
              placeholder="Type your reply…"
              class="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              @keydown.enter.exact.prevent="sendMessage"
              @input="autoGrow"
              ref="textareaRef"
            ></textarea>
            <button
              :disabled="!newMessage.trim() || sending"
              class="flex-shrink-0 h-10 w-10 rounded-xl bg-[#2A4BA0] text-white flex items-center justify-center transition disabled:opacity-40 hover:bg-[#153075]"
              @click="sendMessage"
            >
              <svg v-if="!sending" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </button>
          </div>
          <p class="text-[10px] text-slate-400 mt-1.5 pl-1">Press Enter to send</p>
        </div>
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import { $fetch } from 'ofetch'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

definePageMeta({ layout: 'default', middleware: ['auth-admin'] })

const user = useSupabaseUser()

const adminId = computed(() => user.value?.id ?? '')

// ── Types ──────────────────────────────────────────────────────
interface Conversation {
  id: string
  buyer_id: string
  buyer_name: string
  buyer_email: string
  buyer_avatar: string | null
  last_message: string | null
  last_message_time: string | null
  unread_admin: number
}

interface Message {
  id: string
  conversation_id: string
  sender_id: string | null
  content: string
  created_at: string
  is_read: boolean
  image_url?: string | null
}

// ── State ──────────────────────────────────────────────────────
const conversations = ref<Conversation[]>([])
const selectedId = ref<string | null>(null)
const selectedConvo = computed(() => conversations.value.find(c => c.id === selectedId.value) ?? null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const sending = ref(false)
const loadingConvos = ref(true)
const loadingMessages = ref(false)
const fetchError = ref<string | null>(null)

const messagesContainer = ref<HTMLElement | null>(null)
const bottomAnchor = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

let refreshTimer: ReturnType<typeof setInterval> | null = null
let refreshInFlight = false

// ── Helpers ────────────────────────────────────────────────────
function initials(name: string | null | undefined) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatTime(ts: string | null) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function formatMsgTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  nextTick(() => {
    bottomAnchor.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

function autoGrow(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

// ── Load conversations ─────────────────────────────────────────
async function fetchConversations() {
  loadingConvos.value = true
  fetchError.value = null
  try {
    const { conversations: rows } = await $fetch<{ conversations: Conversation[] }>('/api/support/conversations')
    conversations.value = rows
  } catch (e: any) {
    fetchError.value = e?.message || String(e)
    console.error('[support] fetchConversations error:', e)
  } finally {
    loadingConvos.value = false
  }
}

// ── Select & load messages ─────────────────────────────────────
async function selectConversation(c: Conversation) {
  selectedId.value = c.id
  await fetchMessages(c.id)

  // Mark as read
  if (c.unread_admin > 0) {
    await $fetch('/api/support/read', {
      method: 'POST',
      body: { conversationId: c.id },
    })
    c.unread_admin = 0
  }
}

async function fetchMessages(conversationId: string, options: { showLoader?: boolean; autoScroll?: boolean } = {}) {
  const { showLoader = true, autoScroll = true } = options
  if (showLoader) loadingMessages.value = true
  try {
    const { messages: rows } = await $fetch<{ messages: Message[] }>('/api/support/messages', {
      query: { conversationId },
    })
    messages.value = rows
    if (autoScroll) scrollToBottom()
  } finally {
    if (showLoader) loadingMessages.value = false
  }
}

// ── Send message ───────────────────────────────────────────────
async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || !selectedId.value || sending.value) return

  sending.value = true
  const convId = selectedId.value

  try {
    const { message } = await $fetch<{ message: Message }>('/api/support/messages', {
      method: 'POST',
      body: {
        conversationId: convId,
        content: text,
      },
    })

    messages.value.push(message)
    const selected = conversations.value.find(c => c.id === convId)
    if (selected) {
      selected.last_message = text
      selected.last_message_time = message.created_at
    }
    scrollToBottom()

    newMessage.value = ''
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  } finally {
    sending.value = false
  }
}

// ── Polling ────────────────────────────────────────────────────
async function refreshSupportData() {
  if (refreshInFlight) return
  refreshInFlight = true

  try {
    const activeId = selectedId.value
    await fetchConversations()

    if (activeId) {
      const exists = conversations.value.some(c => c.id === activeId)
      if (exists) {
        await fetchMessages(activeId, { showLoader: false, autoScroll: false })
        return
      }
    }

    const firstConversation = conversations.value[0]
    if (!selectedId.value && firstConversation) {
      await selectConversation(firstConversation)
    }
  } finally {
    refreshInFlight = false
  }
}

function startPolling() {
  if (refreshTimer) clearInterval(refreshTimer)
  refreshTimer = setInterval(() => {
    refreshSupportData().catch((error) => {
      console.error('[support] polling error:', error)
    })
  }, 5000)
}

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(async () => {
  await refreshSupportData()
  startPolling()
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})
</script>
