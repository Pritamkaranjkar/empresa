<template>
  <OwnerLayout>

    <!-- 🔥 TOP LOADER -->
    <div
      v-if="pageLoading"
      class="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden"
    >
    >
      <div class="h-full w-full bg-black animate-loader"></div>
    </div>

    <!-- ⏳ FULL PAGE BLOCK -->
    <div
      v-if="pageLoading"
      class="min-h-screen flex items-center justify-center bg-white"
    >
      <div class="flex flex-col items-center gap-4">
        <span
          class="h-10 w-10 rounded-full border-2 border-black/20 border-t-black animate-spin"
        ></span>
        <p class="text-sm text-gray-400 tracking-wide">
          Loading team…
        </p>
      </div>
    </div>

    <!-- ✅ ACTUAL PAGE -->
    <div v-else class="px-4 sm:px-8 py-8 sm:py-10 max-w-7xl mx-auto">
      <!-- ✅ YOUR EXISTING TEMPLATE (UNCHANGED BELOW) -->

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
         <!-- Header -->
      <div class="dashboard-header">
        <h1 class="welcome">
          {{ greeting }}, <span class="username">{{ username }}</span>
        </h1>

        <h2>Consortium - Team Management</h2>

        <p class="subtitle">
          Your team details at a glance — beautifully simplified.
        </p>
      </div>

        <button
          :disabled="staff.length >= staffLimit"
          @click="openAddDialog"
          class="w-full sm:w-auto rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/90 active:scale-95 transition disabled:opacity-40"
        >
          + Add Staff
        </button>
      </div>

      <!-- Staff Limit -->
      <div
        v-if="staffLimit > 0"
        class="mb-6 rounded-2xl border border-black/10 bg-[#F5F5F7] px-4 sm:px-5 py-3 text-sm text-black/60"
      >
        You are using
        <span class="font-medium text-black">
          {{ staff.length }}/{{ staffLimit }}
        </span>
        staff slots
      </div>

      <!-- Desktop Table -->
      <el-table
        :data="staff"
        v-loading="loading"
        class="hidden md:block rounded-3xl overflow-hidden border border-black/10"
        header-row-class-name="bg-[#F5F5F7]"
      >
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="email" label="Email" />

        <el-table-column label="Modules">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="m in row.modulesAssigned"
                :key="m"
                class="px-3 py-1 rounded-full bg-black/5 text-[11px] font-medium text-black/70"
              >
                {{ m }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="160">
          <template #default="{ row }">
            <div class="flex gap-4">
              <button
                @click="editStaff(row)"
                class="text-sm font-medium text-black/60 hover:text-black"
              >
                Edit
              </button>
              <button
                @click="deleteStaff(row._id)"
                class="text-sm font-medium text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Mobile Cards -->
      <div class="md:hidden space-y-4">
        <div
          v-for="row in staff"
          :key="row._id"
          class="rounded-2xl border border-black/10 bg-white p-4"
        >
          <div class="mb-2">
            <p class="text-sm font-semibold text-black">{{ row.name }}</p>
            <p class="text-xs text-black/50">{{ row.email }}</p>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="m in row.modulesAssigned"
              :key="m"
              class="px-3 py-1 rounded-full bg-black/5 text-[11px] font-medium text-black/70"
            >
              {{ m }}
            </span>
          </div>

          <div class="flex gap-4">
            <button
              @click="editStaff(row)"
              class="text-sm font-medium text-black/60 hover:text-black"
            >
              Edit
            </button>
            <button
              @click="deleteStaff(row._id)"
              class="text-sm font-medium text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Add / Edit Dialog -->
      <el-dialog
        v-model="showDialog"
        align-center
        destroy-on-close
        :fullscreen="true"
        :close-on-click-modal="true"
        class="rounded-none sm:rounded-[24px] !p-0 border border-black/10"
      >
        <!-- Header (Fixed) -->
        <div class="px-5 sm:px-8 pt-6 sm:pt-8 pb-6 border-b border-black/5">
          <h3 class="text-xl sm:text-2xl font-semibold tracking-tight text-black">
            {{ editingStaff ? 'Edit Staff' : 'Add Staff' }}
          </h3>
          <p class="text-sm text-black/50 mt-1">
            Assign modules and manage access permissions.
          </p>
        </div>

        <!-- Scrollable Body -->
        <div
          class="px-5 sm:px-8 py-6 sm:py-8 overflow-y-auto"
          style="max-height: calc(100vh - 220px);"
        >
          <el-form :model="form" label-position="top" class="space-y-6">
            <el-form-item label="Name">
              <el-input v-model="form.name" placeholder="Full name" />
            </el-form-item>

            <el-form-item label="Email">
              <el-input v-model="form.email" placeholder="Email address" />
            </el-form-item>

            <el-form-item v-if="!editingStaff" label="Password">
              <el-input
                v-model="form.password"
                type="password"
                show-password
                placeholder="Temporary password"
              />
            </el-form-item>

            <el-form-item label="Modules">
              <el-checkbox-group v-model="form.modulesAssigned">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <el-checkbox
                    v-for="m in availableModules"
                    :key="m"
                    :label="m"
                  >
                    {{ m }}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>

        <!-- Footer (Fixed) -->
        <div
          class="px-5 sm:px-8 pb-6 sm:pb-8 border-t border-black/5 flex flex-col sm:flex-row justify-end gap-3"
        >
          <button
            @click="showDialog = false"
            class="w-full sm:w-auto rounded-full px-5 py-2.5 text-sm font-medium text-black/60 hover:text-black"
          >
            Cancel
          </button>
          <button
            @click="saveStaff"
            class="w-full sm:w-auto rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-black/90 active:scale-95"
          >
            {{ editingStaff ? 'Update Staff' : 'Create Staff' }}
          </button>
        </div>
      </el-dialog>
    </div>
  </OwnerLayout>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../../api/axios'
import OwnerLayout from '../../layouts/OwnerLayout.vue'
import { useAuthStore } from '../../store/auth'

const auth = useAuthStore()

/* -----------------------
   PAGE STATE
----------------------- */
const pageLoading = ref(true)   // 🔥 PAGE-LEVEL LOADER
const loading = ref(false)      // TABLE-LEVEL LOADER

const staff = ref([])
const showDialog = ref(false)
const editingStaff = ref(null)

const form = ref({
  name: '',
  email: '',
  password: '',
  modulesAssigned: []
})

const availableModules = ref([])
const staffLimit = ref(0)

/* -----------------------
   COMPUTED
----------------------- */
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const username = computed(() => auth.user?.name || 'there')

/* -----------------------
   API
----------------------- */
const fetchStaff = async () => {
  loading.value = true
  try {
    const res = await api.get('/owner/staff')
    staff.value = res.data || []
  } catch {
    ElMessage.error('Failed to load staff list')
  } finally {
    loading.value = false
  }
}

const fetchOwnerDetails = async () => {
  const res = await api.get('/owner/details')
  const plan = res.data?.subscription?.plan
  availableModules.value = plan?.moduleAccess || []
  staffLimit.value = plan?.staffLimit || 0
}

/* -----------------------
   CRUD
----------------------- */
const openAddDialog = () => {
  editingStaff.value = null
  form.value = { name: '', email: '', password: '', modulesAssigned: [] }
  showDialog.value = true
}

const editStaff = (staffObj) => {
  editingStaff.value = staffObj._id
  form.value = {
    name: staffObj.name,
    email: staffObj.email,
    modulesAssigned: staffObj.modulesAssigned || []
  }
  showDialog.value = true
}

const saveStaff = async () => {
  try {
    if (editingStaff.value) {
      await api.put(`/owner/staff/${editingStaff.value}`, form.value)
      ElMessage.success('Staff updated successfully')
    } else {
      await api.post('/owner/staff', form.value)
      ElMessage.success('Staff created successfully')
    }
    showDialog.value = false
    fetchStaff()
  } catch (err) {
    ElMessage.error(err.response?.data?.error || 'Failed to save staff')
  }
}

const deleteStaff = async (id) => {
  try {
    await ElMessageBox.confirm('Delete this staff member?', 'Confirm', {
      type: 'warning'
    })
    await api.delete(`/owner/staff/${id}`)
    ElMessage.success('Staff deleted successfully')
    fetchStaff()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('Failed to delete staff')
  }
}

/* -----------------------
   LIFECYCLE
----------------------- */
onMounted(async () => {
  pageLoading.value = true
  try {
    // 🚀 PARALLEL = faster
    await Promise.all([
      fetchStaff(),
      fetchOwnerDetails()
    ])
  } catch {
    ElMessage.error('Failed to load staff page')
  } finally {
    pageLoading.value = false
  }
})
</script>

<style scoped>
.welcome {
  /* font-size: 0.95rem; */
  /* font-weight: 500; */
  color: #6b7280;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}

.username {
  color: #111827;
  font-weight: 600;
}
@media (max-width: 768px) {
  .welcome {
    font-size: 0.85rem;
  }
  .dashboard-header h2 {
    font-size: 1.5rem;
  }
}
.dashboard-header {
  margin-bottom: 40px;
}

.dashboard-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.02em;
}

.staff-page {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
@keyframes loader {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}

.animate-loader {
  animation: loader 1.1s ease-in-out infinite;
}

</style>
