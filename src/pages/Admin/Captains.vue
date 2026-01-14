<template>
  <AdminLayout>
    <div class="page-header">
      <h2>Captain Management</h2>
      <el-button type="primary" @click="openCreateDialog">+ Add Captain</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="captains"
      border
      style="margin-top: 20px; width: 100%"
    >
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column label="Actions" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">Edit</el-button>
          <el-button size="small" type="danger" @click="deleteCaptain(row._id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create / Edit Captain Dialog -->
    <el-dialog
      :title="isEditing ? 'Edit Captain' : 'Create Captain'"
      v-model="showDialog"
      width="420px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="90px" @submit.prevent>
        <el-form-item label="Name" required>
          <el-input v-model="form.name" placeholder="Captain Name" />
        </el-form-item>
        <el-form-item label="Email" required>
          <el-input v-model="form.email" placeholder="Captain Email" />
        </el-form-item>
        <el-form-item v-if="!isEditing" label="Password" required>
          <el-input v-model="form.password" type="password" placeholder="Password" />
        </el-form-item>
        <el-form-item v-else label="New Password">
          <el-input v-model="form.password" type="password" placeholder="Leave blank to keep current" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button
          type="primary"
          :loading="saving"
          @click="isEditing ? updateCaptain() : createCaptain()"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </el-button>
      </template>
    </el-dialog>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import api from '../../api/axios';
import AdminLayout from '../../layouts/AdminLayout.vue';

const captains = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const saving = ref(false);
const isEditing = ref(false);
const currentCaptainId = ref(null);

const form = ref({
  name: '',
  email: '',
  password: ''
});

// ✅ Fetch all captains
const fetchCaptains = async () => {
  try {
    loading.value = true;
    const res = await api.get('/admin/captains');
    captains.value = res.data;
  } catch (err) {
    ElMessage.error(err.response?.data?.error || 'Failed to fetch captains');
  } finally {
    loading.value = false;
  }
};

// ✅ Open Create Dialog
const openCreateDialog = () => {
  isEditing.value = false;
  form.value = { name: '', email: '', password: '' };
  showDialog.value = true;
};

// ✅ Open Edit Dialog
const openEditDialog = (captain) => {
  isEditing.value = true;
  currentCaptainId.value = captain._id;
  form.value = { name: captain.name, email: captain.email, password: '' };
  showDialog.value = true;
};

// ✅ Create Captain
const createCaptain = async () => {
  try {
    saving.value = true;
    if (!form.value.name || !form.value.email || !form.value.password) {
      ElMessage.warning('All fields are required');
      return;
    }
    await api.post('/admin/captains', form.value);
    ElMessage.success('Captain created successfully');
    showDialog.value = false;
    fetchCaptains();
  } catch (err) {
    ElMessage.error(err.response?.data?.error || 'Failed to create captain');
  } finally {
    saving.value = false;
  }
};

// ✅ Update Captain
const updateCaptain = async () => {
  try {
    saving.value = true;
    if (!form.value.name || !form.value.email) {
      ElMessage.warning('Name and email are required');
      return;
    }

    await api.put(`/admin/captains/${currentCaptainId.value}`, form.value);
    ElMessage.success('Captain updated successfully');
    showDialog.value = false;
    fetchCaptains();
  } catch (err) {
    ElMessage.error(err.response?.data?.error || 'Failed to update captain');
  } finally {
    saving.value = false;
  }
};

// ✅ Delete Captain
const deleteCaptain = async (id) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this captain?', 'Warning', {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    });

    await api.delete(`/admin/captains/${id}`);
    ElMessage.success('Captain deleted');
    fetchCaptains();
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.error || 'Failed to delete captain');
    }
  }
};

onMounted(fetchCaptains);
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-dialog__body {
  padding-top: 10px;
}

.el-form-item {
  margin-bottom: 15px;
}
</style>
