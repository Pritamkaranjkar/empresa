<template>
  <AdminLayout>
    <div class="page-header">
      <h2>Manage Subscription Plans</h2>
      <el-button type="primary" @click="openCreateDialog">+ New Plan</el-button>
    </div>

    <el-table
      :data="plans"
      v-loading="loading"
      border
      style="margin-top: 20px; width: 100%"
    >
      <el-table-column prop="name" label="Name" />
      <el-table-column label="Description" width="220">
        <template #default="{ row }">
          <el-tooltip
            v-if="row.description"
            :content="row.description"
            placement="top"
          >
            <span class="truncate">
              {{ row.description }}
            </span>
          </el-tooltip>
          <span v-else class="text-muted">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="priceMonthly" label="Monthly (₹)" />
      <el-table-column prop="priceYearly" label="Yearly (₹)" />
      <el-table-column prop="staffLimit" label="Staff Limit" width="120" />
      <el-table-column label="Modules">
        <template #default="{ row }">
          <el-tag
            v-for="mod in row.moduleAccess"
            :key="mod"
            size="small"
            style="margin-right: 4px"
          >
            {{ mod }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Plan Details" min-width="260">
        <template #default="{ row }">
          <el-tag
            v-for="(detail, index) in row.planDetails"
            :key="index"
            size="small"
            type="info"
            style="margin: 2px"
          >
            {{ detail }}
          </el-tag>

          <span
            v-if="!row.planDetails || row.planDetails.length === 0"
            class="text-muted"
          >
            —
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">Edit</el-button>
          <el-button size="small" type="danger" @click="deletePlan(row._id)">Delete</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Recommended" width="130" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.featured" type="success">Yes</el-tag>
          <el-tag v-else type="info">No</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create / Edit Plan Dialog -->
    <el-dialog
      v-model="showDialog"
      :title="editingPlan ? 'Edit Plan' : 'Create New Plan'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="140px">
        <el-form-item label="Plan Name" required>
          <el-input v-model="form.name" placeholder="e.g. Basic, Pro, Enterprise" />
        </el-form-item>
        <el-form-item label="Slug" required>
          <el-input v-model="form.slug" placeholder="unique-slug" />
        </el-form-item>
        <el-form-item label="Description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
          placeholder="Short plan description"
        />
        </el-form-item>
        <el-form-item label="Plan Details">
          <div>
            <div
              v-for="(detail, index) in form.planDetails"
              :key="index"
              style="display:flex; gap:8px; margin-bottom:6px"
            >
              <el-input
                v-model="form.planDetails[index]"
                maxlength="30"
                show-word-limit
                placeholder="Max 30 characters"
              />
              <el-button
                type="danger"
                text
                @click="removeDetail(index)"
              >
                ✕
              </el-button>
            </div>

            <el-button size="small" type="primary" plain @click="addDetail">
              + Add Detail
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="Monthly Price" required>
          <el-input-number v-model="form.priceMonthly" :min="0" />
        </el-form-item>
        <el-form-item label="Yearly Price">
          <el-input-number v-model="form.priceYearly" :min="0" />
        </el-form-item>
        <el-form-item label="Recommended Plan">
          <el-switch
            v-model="form.featured"
            active-text="Yes"
            inactive-text="No"
          />
        </el-form-item>
        <el-form-item label="Staff Limit" required>
          <el-input-number v-model="form.staffLimit" :min="1" />
        </el-form-item>
        <el-form-item label="Modules">
          <el-checkbox-group v-model="form.moduleAccess">
            <el-checkbox
              v-for="m in availableModules"
              :label="m"
              :key="m"
            >
              {{ m }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" @click="savePlan">
          {{ editingPlan ? 'Update' : 'Create' }}
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

const plans = ref([]);
const loading = ref(false);
const saving = ref(false);
const showDialog = ref(false);
const editingPlan = ref(null);

const availableModules = [
  'BOOKKEEPING',
  'EXPENSE',
  'PROFIT_LOSS',
  'INVENTORY',
  'BILLING',
  'REPORTS',
  'ANALYTICS'
];

const form = ref({
  name: '',
  slug: '',
  description: '',
  planDetails: [],
  priceMonthly: 0,
  priceYearly: 0,
  staffLimit: 5,
  moduleAccess: [],
  featured: false
});

// ✅ Fetch all plans
const fetchPlans = async () => {
  try {
    loading.value = true;
    const res = await api.get('/admin/plans');
    plans.value = res.data;
  } catch (err) {
    ElMessage.error(err.response?.data?.error || 'Failed to fetch plans');
  } finally {
    loading.value = false;
  }
};

// ✅ Open Create Dialog
const openCreateDialog = () => {
  form.value = {
    name: '',
    slug: '',
    description: '',     
    planDetails: [],
    priceMonthly: 0,
    priceYearly: 0,
    staffLimit: 5,
    moduleAccess: [],
    featured: false
  };
  editingPlan.value = null;
  showDialog.value = true;
};

// ✅ Open Edit Dialog
const openEditDialog = (plan) => {
  form.value = { ...plan };
  editingPlan.value = plan._id;
  showDialog.value = true;
};

// ✅ Save (Create or Update)
const savePlan = async () => {
  try {
    if (!form.value.name || !form.value.slug) {
      ElMessage.warning('Name and slug are required');
      return;
    }
    saving.value = true;
    if (editingPlan.value) {
      // Update
      await api.put(`/admin/plans/${editingPlan.value}`, form.value);
      ElMessage.success('Plan updated successfully');
    } else {
      // Create
      await api.post('/admin/plans', form.value);
      ElMessage.success('Plan created successfully');
    }
    showDialog.value = false;
    fetchPlans();
  } catch (err) {
    ElMessage.error(err.response?.data?.error || 'Failed to save plan');
  } finally {
    saving.value = false;
  }
};

// ✅ Delete plan
const deletePlan = async (id) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this plan?', 'Warning', {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    });
    await api.delete(`/admin/plans/${id}`);
    ElMessage.success('Plan deleted successfully');
    fetchPlans();
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.error || 'Failed to delete plan');
    }
  }
};

const addDetail = () => {
  form.value.planDetails.push('');
};

const removeDetail = (index) => {
  form.value.planDetails.splice(index, 1);
};


onMounted(fetchPlans);
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-checkbox {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
