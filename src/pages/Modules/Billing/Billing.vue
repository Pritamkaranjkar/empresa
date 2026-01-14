<template>
  <Modulelayout>
    <template #pageTitle>Billing Module</template>
    <template #pageSubtitle>Manage your company's financial records with elegance and precision.</template>

    <!-- Billing Cards -->
    <div class="billing-container">
      <div class="billing-header">
        <div>
          <h2>Invoices</h2>
          <p class="muted">All invoices for your organization</p>
        </div>
        <div class="header-actions">
          <select v-model="filterBillType" @change="fetchBillings">
            <option value="">All types</option>
            <option value="SALES">Sales</option>
            <option value="SERVICE">Service</option>
            <option value="EDUCATION">Education</option>
            <option value="HOSPITAL">Hospital</option>
            <option value="MANUFACTURING">Manufacturing</option>
            <option value="RENTAL">Rental</option>
            <option value="CUSTOM">Custom</option>
          </select>
          <button class="create-btn" @click="openCreateModal">+ New Invoice</button>
        </div>
      </div>

      <!-- Search Filters -->
      <div class="search-bar mt-5 flex flex-wrap items-center gap-3">
        <!-- Unified Text Search -->
        <input
          v-model="searchText"
          type="text"
          placeholder="Search by Invoice Number or Customer Name..."
          class="w-80 sm:w-96 border border-gray-300 rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 placeholder-gray-400"
        />

        <!-- Separate Date Picker -->
        <input
          v-model="searchDate"
          type="date"
          class="border border-gray-300 rounded-md px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
        />

        <button
          v-if="searchText || searchDate"
          @click="clearSearch"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-sm transition"
        >
          Clear
        </button>
      </div>

      
        <div v-if="loading" class="empty-state">
        <p>Loading...</p>
        </div>
        <div v-else-if="filteredBillings.length === 0" class="empty-state text-center">
          <div class="flex items-center justify-center">
            <img :src="logoUrl" alt="No invoices" class="w-48 h-auto mx-auto" />
          </div>
          <p class="mt-3 text-gray-600 text-sm">
            <span v-if="searchDate">
              <!-- No invoice was created on {{ new Date(searchDate).toLocaleDateString('en-IN') }}. -->
              No invoice was created on this day.
            </span>
            <span v-else-if="searchText">
              No invoice found matching “{{ searchText }}”.
            </span>
            <span v-else>
              No invoices yet. Start by creating your first one.
            </span>
          </p>
        </div>
        <div v-else class="billing-list">
          <div
            v-for="billing in filteredBillings"
            :key="billing._id"
            class="billing-card cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            @click="viewBilling(billing)"
          >
            <div class="invoice-header">
              <div>
                <span class="invoice-number">#{{ billing.invoiceNumber }}</span>
                <div class="muted small mt-1">
                  {{ billing.billType }} • {{ billing.customerName || '—' }}
                </div>
              </div>
              <div>
                <span :class="['status-badge', billing.paymentStatus.toLowerCase()]">
                  {{ billing.paymentStatus }}
                </span>
              </div>
            </div>

            <div class="invoice-details mt-3">
              <p class="amount text-lg font-semibold">
                {{ billing.currencyCode }} {{ formatCurrency(billing.grandTotal) }}
              </p>
              <p class="due-date text-sm text-gray-600">
                Due: {{ formatDate(billing.dueDate) }}
              </p>
              <p class="muted small">Items: {{ billing.items?.length || 0 }}</p>
              <p class="text-sm mt-1 font-medium"
                :class="{
                  'text-red-600': billing.remainingValue > 0,
                  'text-green-600': billing.remainingValue === 0,
                  'text-blue-600': billing.remainingValue < 0
                }"
              >
                {{ billing.remainingValue > 0
                  ? `Remaining: ${billing.currencyCode} ${formatCurrency(billing.remainingValue)}`
                  : billing.remainingValue < 0
                    ? `Return: ${billing.currencyCode} ${formatCurrency(Math.abs(billing.remainingValue))}`
                    : 'Paid in full' }}
              </p>
            </div>

            <div class="invoice-footer flex justify-between items-center mt-6 border-t border-gray-200 pt-4">
              <div>
                <button
                  v-if="billing.paymentStatus !== 'PAID'"
                  @click.stop="openPaymentModal(billing)"
                  class="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                >
                  + Add Payment
                </button>
              </div>

              <div class="flex items-center gap-3">
                <button
                  @click.stop="openEditModal(billing)"
                  class="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  ✎ Edit
                </button>

                <button
                  v-if="billing.paymentStatus === 'PENDING'"
                  @click.stop="markAsPaid(billing._id)"
                  class="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition"
                >
                  ✅ Mark as Paid
                </button>

                <button
                  @click.stop="confirmDelete(billing._id)"
                  class="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
    

    <!-- CREATE / EDIT MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal large">
        <h3>{{ editId ? 'Edit Invoice' : 'Create New Invoice' }}</h3>

        <form @submit.prevent="createOrUpdateBilling">
          <!-- Bill Info -->
          <div class="grid-2">
            <div class="form-group">
              <label>Bill Type</label>
              <select v-model="form.billType" required>
                <option value="SALES">Sales</option>
                <option value="SERVICE">Service</option>
                <option value="EDUCATION">Education</option>
                <option value="HOSPITAL">Hospital</option>
                <option value="MANUFACTURING">Manufacturing</option>
                <option value="RENTAL">Rental</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
            <div class="form-group">
              <label>Customer / Reference</label>
              <input v-model="form.customerName" placeholder="Customer or reference" />
            </div>
          </div>

          <!-- Multi-currency -->
          <div class="grid-2">
            <div class="form-group">
              <label>Currency Code</label>
              <input v-model="form.currencyCode" placeholder="e.g. INR, USD" />
            </div>
            <div class="form-group">
              <label>Exchange Rate</label>
              <input v-model.number="form.exchangeRate" type="number" step="0.01" min="0.1" />
            </div>
          </div>

          <!-- Items -->
          <div class="items-section space-y-6">
            <!-- Section Header -->
            <div class="flex items-center justify-between">
              <label class="text-lg font-medium text-gray-800 tracking-tight">Items</label>
              <button
                type="button"
                @click="addItem"
                class="px-3 py-1.5 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-all duration-200"
              >
                + Add Item
              </button>
            </div>

            <!-- Item Rows -->
            <div
              v-for="(item, i) in form.items"
              :key="i"
              class="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 space-y-4"
            >
              <!-- Item Inputs -->
              <div class="grid grid-cols-5 gap-4">
                <input
                  v-model="item.name"
                  placeholder="Item name"
                  class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <input
                  v-model.number="item.quantity"
                  type="number"
                  placeholder="Qty"
                  min="1"
                  class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <input
                  v-model.number="item.unitPrice"
                  type="number"
                  placeholder="Unit Price"
                  min="0"
                  class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <!-- <input
                  v-model.number="item.discountPercent"
                  type="number"
                  placeholder="%Disc"
                  class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                /> -->
              </div>

              <!-- Tax Groups -->
              <!-- <div class="mt-2 space-y-2">
                <p class="text-sm font-medium text-gray-600">Tax Groups</p>
                <div
                  v-for="(tax, t) in item.taxGroups"
                  :key="t"
                  class="flex items-center gap-3"
                >
                  <input
                    v-model="tax.name"
                    placeholder="Tax name"
                    class="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <input
                    v-model.number="tax.percent"
                    type="number"
                    placeholder="%Tax"
                    class="w-24 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <button
                    type="button"
                    @click="item.taxGroups.splice(t, 1)"
                    class="text-gray-400 hover:text-red-500 transition-colors duration-200 text-lg"
                  >
                    ✕
                  </button>
                </div>

                <button
                  type="button"
                  @click="item.taxGroups.push({ name: '', percent: 0 })"
                  class="text-sm text-gray-600 hover:text-black transition-colors duration-200"
                >
                  + Add Tax
                </button>
              </div> -->

              <!-- Remove Item -->
              <div class="flex justify-end">
                <button
                  type="button"
                  @click="removeItem(i)"
                  class="text-sm text-gray-500 hover:text-red-600 transition-all duration-200"
                >
                  ✕ Remove Item
                </button>
              </div>
            </div>
          </div>


          <!-- Invoice Discounts -->
          <div class="grid-2">
            <div class="form-group">
              <label>Total Discount %</label>
              <input v-model.number="form.discountPercent" type="number" min="0" />
            </div>
          </div>

          <!-- ✅ Common Tax Groups for the Invoice -->
          <div class="mt-6">
            <p class="text-lg font-medium text-gray-800 tracking-tight mb-2">Tax Groups</p>
            <div
              v-for="(tax, t) in form.taxGroups"
              :key="t"
              class="flex items-center gap-3 mb-2"
            >
              <input
                v-model="tax.name"
                placeholder="Tax name"
                class="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <input
                v-model.number="tax.percent"
                type="number"
                placeholder="%Tax"
                min="0"
                max="100"
                class="w-24 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button
                type="button"
                @click="form.taxGroups.splice(t, 1)"
                class="text-gray-400 hover:text-red-500 transition-colors duration-200 text-lg"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              @click="form.taxGroups.push({ name: '', percent: 0 })"
              class="text-sm text-gray-600 hover:text-black transition-colors duration-200"
            >
              + Add Tax Group
            </button>
          </div>

          <!-- Dates -->
          <div class="grid-2">
            <div class="form-group">
              <label>Due Date</label>
              <input v-model="form.dueDate" type="date" />
            </div>
            <div class="form-group">
              <label>Payment Method</label>
              <select v-model="form.paymentMethod">
                <option>CASH</option><option>CARD</option><option>UPI</option><option>BANK</option><option>CREDIT</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
            <button type="submit" class="submit-btn">{{ editId ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- PARTIAL PAYMENT MODAL -->
    <div v-if="showPaymentModal" class="modal-overlay" @click.self="closePaymentModal">
      <div class="modal small">
        <h3>Add Partial Payment</h3>
        <form @submit.prevent="addPartialPayment">
          <div class="form-group">
            <label>Amount</label>
            <input v-model.number="payment.amount" type="number" min="1" required />
          </div>
          <div class="form-group">
            <label>Method</label>
            <select v-model="payment.method">
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
              <option value="BANK">Bank</option>
            </select>
          </div>
          <div class="form-group">
            <label>Reference (optional)</label>
            <input v-model="payment.reference" placeholder="Txn / Ref ID" />
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closePaymentModal">Cancel</button>
            <button type="submit" class="submit-btn">Add</button>
          </div>
        </form>
      </div>
    </div>

    <!-- VIEW BILL MODAL -->
      <div
        v-if="showViewModal"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300"
        @click.self="closeViewModal"
      >
        <div
          class="bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.1)] w-[92%] md:w-[820px] max-h-[90vh] overflow-y-auto border border-gray-200/60 transition-all duration-300"
        >
        <!-- Header Section -->
        <div class="bg-gradient-to-b from-gray-50 to-white p-8 border-b border-gray-200">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-semibold tracking-tight text-gray-900">
                Invoice #{{ selectedBilling.invoiceNumber }}
              </h2>
              <p class="text-sm text-gray-500 mt-1">Issued on {{ formatDate(selectedBilling.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-800 text-lg">
                {{ selectedBilling.currencyCode }} {{ formatCurrency(selectedBilling.grandTotal) }}
              </p>
              <p
                class="text-xs mt-1 inline-block px-2 py-1 rounded-full"
                :class="{
                  'bg-green-100 text-green-700': selectedBilling.paymentStatus === 'PAID',
                  'bg-yellow-100 text-yellow-700': selectedBilling.paymentStatus === 'PENDING',
                  'bg-red-100 text-red-700': selectedBilling.paymentStatus === 'OVERDUE',
                }"
              >
                {{ selectedBilling.paymentStatus }}
              </p>
            </div>
          </div>
        </div>

        <!-- Invoice Body -->
        <div class="p-8">
          <!-- Customer and Billing Info -->
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">Billed To</h3>
              <div class="space-y-1 text-[15px] text-gray-700">
                <p>{{ selectedBilling.customerName || '—' }}</p>
                <p>{{ selectedBilling.customerAddress || '' }}</p>
                <p>{{ selectedBilling.customerEmail || '' }}</p>
              </div>
            </div>
            <div>
              <div class="pl-24">
              <h3 class="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">Invoice Details</h3>
              <div class="space-y-1 text-[15px] text-gray-700">
                <p><span class="text-gray-600">Bill Type:</span> {{ selectedBilling.billType }}</p>
                <p><span class="text-gray-600">Payment Method:</span> {{ selectedBilling.paymentMethod }}</p>
                <p><span class="text-gray-600">Created By:</span> {{ userName }}</p>
              </div>
            </div>
            </div>
          </div>

          <!-- Itemized Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-2xl mb-10">
            <table class="min-w-full text-sm text-gray-800">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="py-3 px-5 text-left font-medium">Item</th>
                  <th class="py-3 px-5 text-right font-medium">Qty</th>
                  <th class="py-3 px-5 text-right font-medium">Unit Price</th>
                  <th class="py-3 px-5 text-right font-medium">Discount</th>
                  <th class="py-3 px-5 text-right font-medium">Tax</th>
                  <th class="py-3 px-5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, i) in selectedBilling.items"
                  :key="i"
                  class="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                >
                  <td class="py-3 px-5 font-medium">{{ item.name }}</td>
                  <td class="py-3 px-5 text-right">{{ item.quantity }}</td>
                  <td class="py-3 px-5 text-right">{{ formatCurrency(item.unitPrice) }}</td>
                  <td class="py-3 px-5 text-right">{{ item.discountPercent || 0 }}%</td>
                  <td class="py-3 px-5 text-right">
                    <div v-if="item.taxGroups?.length" class="space-y-0.5">
                      <div v-for="(tax, t) in item.taxGroups" :key="t">{{ tax.name }} ({{ tax.percent }}%)</div>
                    </div>
                    <span v-else>—</span>
                  </td>
                  <td class="py-3 px-5 text-right font-semibold text-gray-900">
                    {{ formatCurrency(item.quantity * item.unitPrice) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totals Summary -->
          <div class="flex justify-end">
            <div class="w-full md:w-1/2 lg:w-2/5 bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div class="flex justify-between text-[15px] mb-2">
                <span class="text-gray-600">Subtotal</span>
                <span>{{ formatCurrency(selectedBilling.subTotal || 0) }}</span>
              </div>

              <!-- 👇 Added Discount -->
              <div class="flex justify-between text-[15px] mb-2">
                <span class="text-gray-600">Discount ({{ selectedBilling.discountPercent || 0 }}%)</span>
                <span>-{{ formatCurrency((selectedBilling.subTotal || 0) * (selectedBilling.discountPercent || 0) / 100) }}</span>
              </div>

              <div class="flex justify-between text-[15px] mb-2">
                <span class="text-gray-600">Taxes</span>
                <span>{{ formatCurrency(selectedBilling.taxTotal || 0) }}</span>
              </div>

              <div class="border-t border-gray-300 my-3"></div>

              <div class="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>{{ selectedBilling.currencyCode }} {{ formatCurrency(selectedBilling.grandTotal) }}</span>
              </div>
            </div>
          </div>

          <!-- 👇 Remaining / Return / Paid in full display -->
          <p
            class="text-sm mt-3 font-medium text-right"
            :class="{
              'text-red-600': selectedBilling.remainingValue > 0,
              'text-green-600': selectedBilling.remainingValue === 0,
              'text-blue-600': selectedBilling.remainingValue < 0
            }"
          >
            {{ selectedBilling.remainingValue > 0
              ? `Remaining: ${selectedBilling.currencyCode} ${formatCurrency(selectedBilling.remainingValue)}`
              : selectedBilling.remainingValue < 0
                ? `Return: ${selectedBilling.currencyCode} ${formatCurrency(Math.abs(selectedBilling.remainingValue))}`
                : 'Paid in full' }}
          </p>

          <!-- Payment Summary -->
          <div v-if="selectedBilling.payments?.length" class="mt-10">
            <h3 class="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Payments</h3>
            <div
              v-for="(p, i) in selectedBilling.payments"
              :key="i"
              class="flex justify-between items-center text-[15px] border-b border-gray-100 py-2"
            >
              <span>{{ p.method }} - {{ p.reference || 'No reference' }}</span>
              <span class="text-gray-800 font-medium">{{ formatCurrency(p.amount) }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-10 flex justify-between items-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <button
              @click="closeViewModal"
              class="px-5 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 active:scale-95 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      </div>

      <ConfirmDialog
        :visible="showDeleteConfirm"
        title="Delete Invoice"
        message="This will permanently remove the invoice. Are you sure?"
        @confirm="deleteBilling"
        @cancel="showDeleteConfirm = false"
      />
  </Modulelayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Modulelayout from '../../../layouts/ModulesLayout.vue';
import api from '../../../api/axios';
import logo from '../../../assets/noitem.png';
import { watch } from 'vue';
import { showToast } from '../../../store/toast'
import ConfirmDialog from '../../../components/common/ConfirmDialog.vue';

const userName = ref('')

const logoUrl = logo;
const billings = ref([]);
const loading = ref(false);
const showModal = ref(false);
const showPaymentModal = ref(false);
const editId = ref(null);
const filterBillType = ref('');
const submitting = ref(false);
const selectedBilling = ref(null);
const showViewModal = ref(false);
const showDeleteConfirm = ref(false)
const deleteId = ref(null)
const searchText = ref('');
const searchDate = ref('');


const confirmDelete = (id) => {
  deleteId.value = id
  showDeleteConfirm.value = true
}

const payment = ref({ amount: 0, method: 'CASH', reference: '' });

const form = ref({
  billType: 'SALES',
  customerName: '',
  items: [{ name: '', quantity: 1, unitPrice: 0 }],
  discountPercent: 0,
  taxGroups: [], // ✅ now at invoice-level
  currencyCode: 'INR',
  exchangeRate: 1,
  paymentMethod: 'CASH',
  dueDate: '',
  meta: {}
});



const fetchBillings = async () => {
  loading.value = true;
  try {
    const q = filterBillType.value ? `?billType=${filterBillType.value}` : '';
    const res = await api.get(`/billings${q}`);
    billings.value = res.data || [];
    // showToast('Bills ready!', 'success')
  } catch (err) {
    console.error(err);
    alert('Failed to fetch invoices');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  resetForm();
  showModal.value = true;
};

const currentGrandTotal = ref(0);

const openEditModal = (billing) => {
  editId.value = billing._id;
  form.value = JSON.parse(JSON.stringify(billing));
  currentGrandTotal.value = billing.grandTotal;  // ✅ update the ref properly

  calculateTotals();
  console.log("💰 Old Grand Total:", currentGrandTotal.value);
  showModal.value = true;
};




const closeModal = () => {
  showModal.value = false;
  editId.value = null;
};

const resetForm = () => {
  form.value = {
    billType: 'SALES',
    customerName: '',
    items: [{ name: '', quantity: 1, unitPrice: 0 }],
    discountPercent: 0,
    taxGroups: [], // ✅ reset invoice-level tax groups
    currencyCode: 'INR',
    exchangeRate: 1,
    paymentMethod: 'CASH',
    dueDate: '',
    meta: {}
  };
};

const addItem = () => form.value.items.push({ name: '', quantity: 1, unitPrice: 0, discountPercent: 0, taxGroups: [] });
const removeItem = (i) => form.value.items.splice(i, 1);

// const createOrUpdateBilling = async () => {
//   try {
//     submitting.value = true;
//     const payload = { ...form.value };
//     if (editId.value) {
//       await api.put(`/billings/${editId.value}`, payload);
//     } else {
//       await api.post('/billings', payload);
//     }
//     await fetchBillings();
//     closeModal();
//   } catch (err) {
//     console.error(err);
//     alert('Failed to save invoice');
//   } finally {
//     submitting.value = false;
//   }
// };


const createOrUpdateBilling = async () => {
  try {
    submitting.value = true;

    // Always recalculate before saving
    calculateTotals();

    const payload = { ...form.value };

    if (editId.value) {
      await api.put(`/billings/${editId.value}`, payload);
      showToast('Invoice updated successfully!', 'success')
    } else {
      await api.post('/billings', payload);
      showToast('Invoice created successfully!', 'success');
    }

    await fetchBillings();
    closeModal();
  } catch (err) {
    console.error(err);
    showToast('Failed to save invoice', 'error');
  } finally {
    submitting.value = false;
  }
};

const deleteBilling = async () => {
  if (!deleteId.value) return
  try {
    await api.delete(`/billings/${deleteId.value}`)
    showToast('Invoice deleted successfully!', 'success')
    await fetchBillings()
  } catch (err) {
    console.error(err)
    showToast('Failed to delete invoice', 'error')
  } finally {
    showDeleteConfirm.value = false
    deleteId.value = null
  }
}

const openPaymentModal = (billing) => {
  selectedBilling.value = billing;
  payment.value = { amount: 0, method: 'CASH', reference: '' };
  showPaymentModal.value = true;
};

const closePaymentModal = () => showPaymentModal.value = false;

const addPartialPayment = async () => {
  try {
    const id = selectedBilling.value._id;
    await api.patch(`/billings/${id}/payment`, payment.value);
    await fetchBillings();
    closePaymentModal();
    showToast('Payment added successfully!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Failed to add payment', 'error');
  }
};

const markAsPaid = async (id) => {
  await api.patch(`/billings/${id}/paid`);
  await fetchBillings();
};

const viewBilling = (billing) => {
  selectedBilling.value = billing;
  showViewModal.value = true;
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedBilling.value = null;
};
const formatCurrency = (n) => n?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0';
const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : '—');

const calculateTotals = () => {
  let subTotal = 0;

  form.value.items.forEach(item => {
    subTotal += item.quantity * item.unitPrice;
  });

  const discountAmt = (subTotal * (form.value.discountPercent || 0)) / 100;
  const afterDiscount = subTotal - discountAmt;

  let taxTotal = 0;
  if (form.value.taxGroups?.length) {
    form.value.taxGroups.forEach(tax => {
      taxTotal += (afterDiscount * (tax.percent || 0)) / 100;
    });
  }

  const newGrandTotal = afterDiscount + taxTotal;
  const difference = newGrandTotal - currentGrandTotal.value;

  form.value.subTotal = subTotal;
  form.value.taxTotal = taxTotal;
  form.value.grandTotal = newGrandTotal;
  form.value.remainingValue = difference;

};

const filteredBillings = computed(() => {
  return billings.value.filter(bill => {
    // Match invoice number or customer name
    const matchesText =
      !searchText.value ||
      bill.invoiceNumber.toString().toLowerCase().includes(searchText.value.toLowerCase()) ||
      (bill.customerName && bill.customerName.toLowerCase().includes(searchText.value.toLowerCase()));

    // Match selected date (exact date match)
    const matchesDate =
      !searchDate.value ||
      new Date(bill.createdAt).toISOString().split('T')[0] === searchDate.value;

    return matchesText && matchesDate;
  });
});

const clearSearch = () => {
  searchText.value = '';
  searchDate.value = '';
};


watch(
  () => form.value.items,
  () => calculateTotals(),
  { deep: true }
);

watch(
  () => form.value.discountPercent,
  () => calculateTotals()
);

onMounted(fetchBillings);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.name) {
    userName.value = user.name
  }
})
</script>

<style scoped>
.billing-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
.billing-header { display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-bottom: 1.25rem; }
.billing-header h2 { font-size: 1.4rem; margin: 0; font-weight: 600; }
.muted { color: #6b7280; }
.small { font-size: 0.85rem; }
.header-actions { display:flex; gap: 0.6rem; align-items:center; }
.header-actions select { padding: 6px 8px; border-radius:8px; border:1px solid #e5e7eb; background:white; }
.create-btn { background: #000; color: white; border: none; padding: 0.6rem 1rem; border-radius: 10px; cursor:pointer; }
.billing-list { display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem; }
.billing-card { background: white; border: 1px solid #eee; border-radius:12px; padding: 1rem; box-shadow: 0 6px 20px rgba(10,10,12,0.04); display:flex; flex-direction:column; justify-content:space-between; }
.invoice-header { display:flex; justify-content:space-between; align-items:flex-start; gap: 1rem; }
.invoice-number { font-weight:600; }
.status-badge { font-size:0.8rem; padding:0.25rem 0.6rem; border-radius:8px; text-transform:capitalize; }
.status-badge.paid { background:#e6ffef; color:#047857; }
.status-badge.pending { background:#fff7ed; color:#b45309; }
.status-badge.cancelled { background:#fff1f2; color:#b91c1c; }
.invoice-details { margin: 0.75rem 0; }
.amount { font-weight:700; font-size:1.1rem; }
.due-date { color:#6b7280; font-size:0.9rem; }
.invoice-footer { display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem; }
.card-actions button { background: transparent; border: none; color:#111827; cursor:pointer; font-weight:600; }
.invoice-footer button { color:#0b5fff; background:transparent; border:none; cursor:pointer; }

.empty-state { text-align:center; padding:3rem 0; color:#6b7280; }
.empty-state img { width:96px; margin-bottom: 0.8rem; }

/* Modal */
.modal-overlay { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.32); z-index: 1000; }
.modal { background:white; border-radius:12px; padding:1.5rem; width:760px; max-width:95%; box-shadow: 0 10px 40px rgba(2,6,23,0.08); }
.modal h3 { margin:0 0 1rem 0; font-size:1.1rem; font-weight:700; }
.grid-2 { display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem; }
.form-group { display:flex; flex-direction:column; margin-bottom:0.75rem; }
label { font-size:0.85rem; margin-bottom:0.35rem; color:#374151; }
input, select { border:1px solid #e6e6e6; padding:8px 10px; border-radius:8px; outline:none; }
input:focus, select:focus { border-color:#111827; box-shadow: 0 0 0 3px rgba(0,0,0,0.03); }

/* items */
.items-section { margin-top: 0.5rem; margin-bottom: 0.5rem; }
.item-row { display:grid; grid-template-columns: 1fr 80px 110px 80px 36px; gap:0.5rem; align-items:center; margin-bottom:0.5rem; }
.item-row input { padding:6px 8px; }
.add-item { background:transparent; border:1px dashed #e5e7eb; padding:8px 10px; border-radius:8px; cursor:pointer; margin-top:0.4rem; }
.remove { background:transparent; border:none; color:#ef4444; font-weight:700; cursor:pointer; }

.modal-actions { display:flex; justify-content:flex-end; gap:0.6rem; margin-top:0.8rem; }
.cancel-btn { background:#f3f4f6; border:none; padding:8px 10px; border-radius:8px; cursor:pointer; }
.submit-btn { background:#000; color:white; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; }

.tax-group { display:flex; flex-direction:column; gap:4px; margin-top:4px; }
.tax-subrow { display:flex; gap:4px; align-items:center; }
.add-tax { background:#f3f4f6; border:none; border-radius:6px; padding:4px 8px; font-size:0.8rem; cursor:pointer; margin-top:4px; }

.modal.large { width:900px; max-width:95%; }
.modal.small { width:400px; max-width:90%; }

.section-title { font-weight:600; margin-bottom:4px; }
</style>
