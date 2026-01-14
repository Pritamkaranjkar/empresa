<template>
  <AdminLayout>
    <div class="page-header">
      <h2>Business Owners</h2>
      <el-button type="primary" @click="openCreateDialog">+ Add Business Owner</el-button>
    </div>

    <!-- Owners Table -->
    <el-table
      v-loading="loading"
      :data="owners"
      border
      style="margin-top: 20px; width: 100%"
    >
      <!-- Expand Row for Full Details -->
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="expanded-content">
            <h4>Organization Details</h4>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="Organization Name">{{ row.organization?.name || '—' }}</el-descriptions-item>
              <el-descriptions-item label="Business Type">{{ row.organization?.businessType || '—' }}</el-descriptions-item>
              <el-descriptions-item label="GST Number">{{ row.organization?.gstNumber || '—' }}</el-descriptions-item>
              <el-descriptions-item label="Contact">{{ row.organization?.contactNumber || '—' }}</el-descriptions-item>
              <el-descriptions-item label="Address" :span="2">{{ row.organization?.address || '—' }}</el-descriptions-item>
              <el-descriptions-item label="Modules" :span="2">
                <el-tag
                  v-for="m in row.organization?.modules || []"
                  :key="m"
                  style="margin: 2px"
                >{{ m }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>

            <h4 style="margin-top: 20px">Subscription Details</h4>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="Plan Name">{{ row.organization?.plan?.name || '—' }}</el-descriptions-item>
              <el-descriptions-item label="Status">
                <el-tag
                  :type="row.organization?.planStatus === 'ACTIVE'
                    ? 'success'
                    : row.organization?.planStatus === 'EXPIRED'
                    ? 'danger'
                    : row.organization?.planStatus === 'info'"
                >
                  {{ row.organization?.planStatus || 'N/A' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="Start Date">{{ formatDate(row.organization?.planStart) }}</el-descriptions-item>
              <el-descriptions-item label="Renewal Date">{{ formatDate(row.organization?.planEnd) }}</el-descriptions-item>
              <el-descriptions-item label="Monthly Price">₹{{ row.organization?.plan?.priceMonthly || 0 }}</el-descriptions-item>
              <el-descriptions-item label="Staff Limit">{{ row.organization?.plan?.staffLimit || 0 }}</el-descriptions-item>
            </el-descriptions>

            <h4 style="margin-top: 20px">Staff Members ({{ row.staff?.length || 0 }})</h4>
            <el-table
              v-if="row.staff?.length"
              :data="row.staff"
              style="width: 100%; margin-top: 10px"
              border
              size="small"
            >
              <el-table-column prop="name" label="Name" />
              <el-table-column prop="email" label="Email" />
            </el-table>
            <div v-else>No staff assigned.</div>
          </div>
        </template>
      </el-table-column>

      <!-- Compact Owner Info -->
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column label="Organization" :formatter="(r) => r.organization?.name || '-'" />
      <el-table-column label="Subscription Plan" :formatter="(r) => r.subscription?.plan?.name || '-'" />
      <el-table-column label="Status" width="120">
        <template #default="{ row }">
          <el-tag
            :type="row.organization?.planStatus === 'ACTIVE'
              ? 'success'
              : row.organization?.planStatus === 'EXPIRED'
              ? 'danger'
              : 'info'"
          >
            {{ row.organization?.planStatus || 'N/A' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">Edit</el-button>
          <el-button size="small" type="danger" @click="deleteOwner(row._id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create / Edit Owner Dialog -->
    <el-dialog
      :title="isEditing ? 'Edit Business Owner' : 'Add Business Owner'"
      v-model="showDialog"
      width="450px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="130px">
        <el-form-item label="Name" required>
          <el-input v-model="form.name" placeholder="Owner Name" />
        </el-form-item>

        <el-form-item label="Email" required>
          <el-input v-model="form.email" placeholder="Owner Email" />
        </el-form-item>

        <el-form-item v-if="!isEditing" label="Password" required>
          <el-input v-model="form.password" type="password" placeholder="Password" />
        </el-form-item>

        <el-form-item v-else label="New Password">
          <el-input v-model="form.password" type="password" placeholder="Leave blank to keep current" />
        </el-form-item>

        <el-form-item label="Organization Name" required>
          <el-input v-model="form.orgName" placeholder="Business Name" />
        </el-form-item>

        <el-form-item label="Subscription Plan">
          <el-select v-model="form.planId" placeholder="Select Plan" style="width: 100%">
            <el-option
              v-for="plan in plans"
              :key="plan._id"
              :label="plan.name"
              :value="plan._id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Plan Start">
          <el-date-picker v-model="form.planStart" type="date" placeholder="Start Date" style="width: 100%" />
        </el-form-item>

        <el-form-item label="Plan End">
          <el-date-picker v-model="form.planEnd" type="date" placeholder="End Date" style="width: 100%" />
        </el-form-item>

        <el-form-item v-if="isEditing" label="Status">
          <el-select v-model="form.status" placeholder="Select Status" style="width: 100%">
            <el-option label="ACTIVE" value="ACTIVE" />
            <el-option label="INACTIVE" value="INACTIVE" />
            <el-option label="CANCELLED" value="CANCELLED" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" @click="isEditing ? updateOwner() : createOwner()">
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

const owners = ref([]);
const plans = ref([]);
const loading = ref(false);
const saving = ref(false);
const showDialog = ref(false);
const isEditing = ref(false);
const currentOwnerId = ref(null);

const form = ref({
  name: '',
  email: '',
  password: '',
  planId: '',
  orgName: '',
  status: 'INACTIVE'
});

// ✅ Format date helper
const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

// ✅ Fetch all owners with full details
const fetchOwners = async () => {
  try {
    loading.value = true;
    const res = await api.get('/owners');
    owners.value = res.data;
  } catch (err) {
    ElMessage.error(err.response?.data?.error || 'Failed to fetch business owners');
  } finally {
    loading.value = false;
  }
};

// ✅ Fetch subscription plans
const fetchPlans = async () => {
  try {
    const res = await api.get('/public/plans');
    plans.value = res.data;
  } catch {
    ElMessage.error('Failed to load plans');
  }
};

// ✅ Open create dialog
const openCreateDialog = () => {
  isEditing.value = false;
  currentOwnerId.value = null;
  form.value = {
    name: '',
    email: '',
    password: '',
    planId: '',
    orgName: '',
    status: 'INACTIVE'
  };
  showDialog.value = true;
};

// ✅ Open edit dialog
const openEditDialog = (owner) => {
  isEditing.value = true;
  currentOwnerId.value = owner._id;
  form.value = {
    name: owner.name,
    email: owner.email,
    password: '',
    orgName: owner.organizationId?.name || '', // ✅ match backend
  };
  showDialog.value = true;
};


// ✅ Create new owner
const createOwner = async () => {
  try {
    saving.value = true;
    if (!form.value.name || !form.value.email || !form.value.password) {
      ElMessage.warning('Name, Email, and Password are required');
      return;
    }

    await api.post('/owners', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      orgName: form.value.orgName,
      acceptedTerms: true, // ✅ required by backend
    });
    ElMessage.success('Business owner created successfully');
    showDialog.value = false;
    fetchOwners();
  } catch (err) {
    ElMessage.error(err.response?.data?.error || 'Failed to create owner');
  } finally {
    saving.value = false;
  }
};

// ✅ Update existing owner
const updateOwner = async () => {
  try {
    saving.value = true;
    if (!form.value.name || !form.value.email) {
      ElMessage.warning('Name and Email are required');
      return;
    }

    await api.put(`/owners/${currentOwnerId.value}`, {
      name: form.value.name,
      email: form.value.email,
      orgName: form.value.orgName,
      planId: form.value.planId,  
      planStart: form.value.planStart,
      planEnd: form.value.planEnd,
    });
    ElMessage.success('Business owner updated successfully');
    showDialog.value = false;
    fetchOwners();
  } catch (err) {
    ElMessage.error(err.response?.data?.error || 'Failed to update owner');
  } finally {
    saving.value = false;
  }
};

// ✅ Delete owner
const deleteOwner = async (id) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this business owner?', 'Warning', {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    });

    await api.delete(`/owners/${id}`);
    ElMessage.success('Business owner deleted');
    fetchOwners();
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.error || 'Failed to delete owner');
    }
  }
};

onMounted(() => {
  fetchOwners();
  fetchPlans();
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.expanded-content {
  padding: 15px 25px;
  background: #fafafa;
  border-radius: 6px;
}
.expanded-content h4 {
  margin-bottom: 10px;
  color: var(--el-text-color-primary);
}
.el-descriptions {
  margin-bottom: 15px;
}
.el-tag {
  font-size: 12px;
}
</style>
