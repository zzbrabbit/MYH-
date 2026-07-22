/* ============================================
   MYHBeauty — Admin Panel Logic
   ============================================ */

/* ---------- State ---------- */
let currentEditId = null;
let selectedIcon = 'rf';
let selectedGradient = GRADIENT_LIBRARY[0].value;
let confirmCallback = null;
let galleryImages = [];  // array of image URLs/base64
let specRows = [];       // array of { label, value }

/* ---------- DOM Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderTable();
  initIconPicker();
  initGradientPicker();
  initImageUploader();
  initGalleryManager();
  initSpecsEditor();
  initEventListeners();
});

/* ---------- Render Stats ---------- */
function renderStats() {
  const products = Store.getProducts();
  const categories = new Set(products.map(p => p.category));
  const featured = products.filter(p => p.featured).length;

  const stats = [
    { num: products.length, label: 'Total Products', icon: '<path d="M20 7l-8-4-8 4M20 7v10l-8 4-8-4V7M20 7l-8 4M4 7l8 4m0 0v10"/>' },
    { num: categories.size, label: 'Categories', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>' },
    { num: featured, label: 'Featured', icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
    { num: products.filter(p => p.tag === 'New').length, label: 'New Arrivals', icon: '<path d="M12 2v20M2 12h20"/>' }
  ];

  $('#statsContainer').innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-card-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${s.icon}</svg>
      </div>
      <div>
        <div class="stat-card-num">${s.num}</div>
        <div class="stat-card-label">${s.label}</div>
      </div>
    </div>
  `).join('');
}

/* ---------- Render Table ---------- */
function renderTable() {
  const searchQuery = $('#searchInput').value;
  const categoryFilter = $('#filterCategory').value;

  let products = Store.getProducts();

  // Filter by category
  if (categoryFilter !== 'all') {
    products = products.filter(p => p.category === categoryFilter);
  }

  // Filter by search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Update count
  $('#resultCount').textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;

  const tbody = $('#productTableBody');
  const emptyState = $('#emptyState');
  const table = $('#productTable');

  if (products.length === 0) {
    table.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  table.style.display = '';
  emptyState.style.display = 'none';

  tbody.innerHTML = products.map(p => {
    const catLabel = CATEGORY_LIBRARY[p.category] ? CATEGORY_LIBRARY[p.category].label : p.category;
    const iconSvg = ICON_LIBRARY[p.icon] || ICON_LIBRARY.rf;
    return `
      <tr>
        <td>
          <div class="product-preview">
            <div class="product-thumb" style="background: ${p.gradient};">
              ${iconSvg}
            </div>
            <div class="product-preview-info">
              <h4>${escapeHtml(p.name)}</h4>
              <span class="pid">${p.id}</span>
            </div>
          </div>
        </td>
        <td><span class="cat-badge">${catLabel}</span></td>
        <td>${p.tag ? `<span class="tag-badge">${escapeHtml(p.tag)}</span>` : '<span style="color:var(--c-text-soft);">—</span>'}</td>
        <td><span class="featured-star ${p.featured ? '' : 'inactive'}">${p.featured ? '\u2605' : '\u2606'}</span></td>
        <td style="color:var(--c-text-soft); white-space:nowrap;">${p.createdAt || '—'}</td>
        <td>
          <div class="row-actions" style="justify-content:flex-end;">
            <button class="action-btn" onclick="openEditModal('${p.id}')" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-btn delete" onclick="confirmDelete('${p.id}')" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/* ---------- Icon Picker ---------- */
function initIconPicker() {
  const grid = $('#iconGrid');
  grid.innerHTML = Object.entries(ICON_LIBRARY).map(([key, svg]) => `
    <div class="icon-option ${key === selectedIcon ? 'selected' : ''}" data-icon="${key}" title="${key}">
      ${svg}
    </div>
  `).join('');

  grid.querySelectorAll('.icon-option').forEach(el => {
    el.addEventListener('click', () => {
      grid.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      selectedIcon = el.dataset.icon;
      updatePreview();
    });
  });
}

/* ---------- Gradient Picker ---------- */
function initGradientPicker() {
  const grid = $('#gradientGrid');
  grid.innerHTML = GRADIENT_LIBRARY.map(g => `
    <div class="gradient-option ${g.value === selectedGradient ? 'selected' : ''}" data-gradient="${escapeAttr(g.value)}" style="background: ${g.value};" title="${g.label}"></div>
  `).join('');

  grid.querySelectorAll('.gradient-option').forEach(el => {
    el.addEventListener('click', () => {
      grid.querySelectorAll('.gradient-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      selectedGradient = el.dataset.gradient;
      updatePreview();
    });
  });
}

/* ---------- Image Uploader (Main Image) ---------- */
function initImageUploader() {
  const urlInput = $('#pImage');
  const fileInput = $('#pImageFile');
  const preview = $('#mainImagePreview');
  const clearBtn = $('#btnClearMainImage');

  // URL input
  urlInput.addEventListener('input', () => {
    const url = urlInput.value.trim();
    if (url) {
      preview.innerHTML = '<img src="' + escapeAttr(url) + '" alt="Preview" onerror="this.style.display=\'none\'">';
    } else {
      resetMainImagePreview();
    }
  });

  // File upload
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image too large (max 2MB). Please use a URL instead.', 'error');
      fileInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      urlInput.value = dataUrl;
      preview.innerHTML = '<img src="' + dataUrl + '" alt="Preview">';
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
  });

  // Clear
  clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    resetMainImagePreview();
  });
}

function resetMainImagePreview() {
  $('#mainImagePreview').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>No image</span>';
}

function setMainImage(url) {
  $('#pImage').value = url || '';
  if (url) {
    $('#mainImagePreview').innerHTML = '<img src="' + escapeAttr(url) + '" alt="Preview" onerror="this.style.display=\'none\'">';
  } else {
    resetMainImagePreview();
  }
}

/* ---------- Gallery Manager ---------- */
function initGalleryManager() {
  const urlInput = $('#galleryUrlInput');
  const fileInput = $('#galleryFileInput');
  const addBtn = $('#btnAddGallery');

  addBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (!url) {
      showToast('Please enter an image URL', 'error');
      return;
    }
    galleryImages.push(url);
    urlInput.value = '';
    renderGallery();
  });

  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBtn.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image too large (max 2MB)', 'error');
      fileInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      galleryImages.push(ev.target.result);
      renderGallery();
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
  });
}

function renderGallery() {
  const list = $('#galleryList');
  if (galleryImages.length === 0) {
    list.innerHTML = '<p style="font-size:var(--fs-xs); color:var(--c-text-soft); padding:.5rem 0;">No gallery images added yet.</p>';
    return;
  }
  list.innerHTML = galleryImages.map((url, i) => `
    <div class="gallery-item">
      <img src="${escapeAttr(url)}" alt="Gallery ${i + 1}" onerror="this.style.display='none'">
      <button type="button" class="gallery-remove" data-idx="${i}" title="Remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
  `).join('');

  list.querySelectorAll('.gallery-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      galleryImages.splice(idx, 1);
      renderGallery();
    });
  });
}

function setGallery(images) {
  galleryImages = Array.isArray(images) ? [...images] : [];
  renderGallery();
}

/* ---------- Specs Editor ---------- */
function initSpecsEditor() {
  const addBtn = $('#btnAddSpec');
  addBtn.addEventListener('click', () => {
    specRows.push({ label: '', value: '' });
    renderSpecs();
    // Focus the newly added label input
    const inputs = $$('.spec-row .spec-label-input');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });
}

function renderSpecs() {
  const list = $('#specsList');
  if (specRows.length === 0) {
    list.innerHTML = '<p style="font-size:var(--fs-xs); color:var(--c-text-soft); padding:.5rem 0;">No specifications added yet.</p>';
    return;
  }
  list.innerHTML = specRows.map((s, i) => `
    <div class="spec-row" data-idx="${i}">
      <input type="text" class="spec-label-input" placeholder="Spec name (e.g. Frequency)" value="${escapeAttr(s.label || '')}">
      <input type="text" class="spec-value-input" placeholder="Spec value (e.g. 1 MHz)" value="${escapeAttr(s.value || '')}">
      <button type="button" class="spec-remove" title="Remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
  `).join('');

  list.querySelectorAll('.spec-row').forEach((row, i) => {
    const labelInput = row.querySelector('.spec-label-input');
    const valueInput = row.querySelector('.spec-value-input');
    const removeBtn = row.querySelector('.spec-remove');

    labelInput.addEventListener('input', () => { specRows[i].label = labelInput.value; });
    valueInput.addEventListener('input', () => { specRows[i].value = valueInput.value; });
    removeBtn.addEventListener('click', () => {
      specRows.splice(i, 1);
      renderSpecs();
    });
  });
}

function setSpecs(specs) {
  specRows = Array.isArray(specs) ? specs.map(s => ({ label: s.label || '', value: s.value || '' })) : [];
  renderSpecs();
}

function getValidSpecs() {
  return specRows.filter(s => s.label.trim() && s.value.trim());
}

/* ---------- Preview Update ---------- */
function updatePreview() {
  const name = $('#pName').value || 'Product Name';
  const tag = $('#pTag').value || 'No tag';
  const iconSvg = ICON_LIBRARY[selectedIcon] || ICON_LIBRARY.rf;

  $('#previewName').textContent = name;
  $('#previewTag').textContent = tag;
  const thumb = $('#previewThumb');
  thumb.style.background = selectedGradient;
  thumb.innerHTML = iconSvg;
}

/* ---------- Add Modal ---------- */
function openAddModal() {
  currentEditId = null;
  $('#modalTitle').textContent = 'Add Product';
  $('#productForm').reset();
  $('#productId').value = '';
  setRichEditor('');
  $('#pBrand').value = '';
  $('#pArea').value = '';
  $('#pPrice').value = '';
  $('#pComparePrice').value = '';
  $('#pRating').value = '';
  $('#pReviewCount').value = '';
  selectedIcon = 'rf';
  selectedGradient = GRADIENT_LIBRARY[0].value;
  $('#featuredToggle').classList.remove('active');

  // Reset image & specs
  setMainImage('');
  setGallery([]);
  setSpecs([]);

  // Reset pickers
  $$('.icon-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.icon === selectedIcon);
  });
  $$('.gradient-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.gradient === selectedGradient);
  });

  updatePreview();
  openModal('productModal');
}

/* ---------- Edit Modal ---------- */
function openEditModal(id) {
  const product = Store.getProduct(id);
  if (!product) return;

  currentEditId = id;
  $('#modalTitle').textContent = 'Edit Product';
  $('#productId').value = product.id;
  $('#pName').value = product.name;
  $('#pCategory').value = product.category;
  $('#pTag').value = product.tag || '';
  setRichEditor(product.description);
  $('#pBrand').value = product.brand || '';
  $('#pArea').value = product.area || '';
  $('#pPrice').value = product.price || '';
  $('#pComparePrice').value = product.comparePrice || '';
  $('#pRating').value = product.rating || '';
  $('#pReviewCount').value = product.reviewCount || '';
  selectedIcon = product.icon || 'rf';
  selectedGradient = product.gradient || GRADIENT_LIBRARY[0].value;
  $('#featuredToggle').classList.toggle('active', !!product.featured);

  // Load image & specs
  setMainImage(product.image || '');
  setGallery(product.gallery || []);
  setSpecs(product.specs || []);

  // Update pickers
  $$('.icon-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.icon === selectedIcon);
  });
  $$('.gradient-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.gradient === selectedGradient);
  });

  updatePreview();
  openModal('productModal');
}

/* ---------- Save Product ---------- */
function saveProduct() {
  const name = $('#pName').value.trim();
  const category = $('#pCategory').value;
  const tag = $('#pTag').value;
  const description = getRichEditorHTML().trim();
  const featured = $('#featuredToggle').classList.contains('active');
  const brand = $('#pBrand').value;
  const area = $('#pArea').value;
  const price = $('#pPrice').value ? parseFloat($('#pPrice').value) : '';
  const comparePrice = $('#pComparePrice').value ? parseFloat($('#pComparePrice').value) : '';
  const rating = $('#pRating').value ? parseFloat($('#pRating').value) : '';
  const reviewCount = $('#pReviewCount').value ? parseInt($('#pReviewCount').value, 10) : '';

  // Validation
  if (!name) {
    showToast('Please enter a product name', 'error');
    $('#pName').focus();
    return;
  }
  if (!category) {
    showToast('Please select a category', 'error');
    $('#pCategory').focus();
    return;
  }
  if (isDescriptionEmpty()) {
    showToast('Please enter a description', 'error');
    $('#pDesc').focus();
    return;
  }

  const productData = {
    name,
    category,
    tag,
    description,
    icon: selectedIcon,
    gradient: selectedGradient,
    featured,
    image: $('#pImage').value.trim(),
    gallery: [...galleryImages],
    specs: getValidSpecs(),
    brand,
    area,
    price,
    comparePrice,
    rating,
    reviewCount
  };

  if (currentEditId) {
    Store.updateProduct(currentEditId, productData);
    showToast('Product updated successfully', 'success');
  } else {
    Store.addProduct(productData);
    showToast('Product added successfully', 'success');
  }

  closeModal('productModal');
  renderStats();
  renderTable();
}

/* ---------- Delete ---------- */
function confirmDelete(id) {
  const product = Store.getProduct(id);
  if (!product) return;

  $('#confirmTitle').textContent = 'Delete Product?';
  $('#confirmMessage').innerHTML = `Are you sure you want to delete <strong>${escapeHtml(product.name)}</strong>? This action cannot be undone.`;
  $('#btnConfirmAction').textContent = 'Delete';

  confirmCallback = () => {
    Store.deleteProduct(id);
    showToast('Product deleted', 'success');
    closeModal('confirmModal');
    renderStats();
    renderTable();
  };

  openModal('confirmModal');
}

/* ---------- Export ---------- */
function openExportModal() {
  $('#dataModalTitle').textContent = 'Export Data';
  $('#dataModalDesc').textContent = 'Copy the JSON below to backup your product data. You can import it later to restore.';
  $('#dataTextarea').value = Store.exportData();
  $('#dataTextarea').readOnly = true;
  $('#btnDataAction').textContent = 'Copy to Clipboard';
  $('#btnDataAction').onclick = copyDataToClipboard;
  openModal('dataModal');
}

/* ---------- Import ---------- */
function openImportModal() {
  $('#dataModalTitle').textContent = 'Import Data';
  $('#dataModalDesc').innerHTML = 'Paste your product JSON data below. <strong>Warning:</strong> This will replace all current products.';
  $('#dataTextarea').value = '';
  $('#dataTextarea').readOnly = false;
  $('#btnDataAction').textContent = 'Import Data';
  $('#btnDataAction').onclick = importData;
  openModal('dataModal');
}

function importData() {
  const json = $('#dataTextarea').value.trim();
  if (!json) {
    showToast('Please paste JSON data first', 'error');
    return;
  }
  const result = Store.importData(json);
  if (result.success) {
    showToast(`Imported ${result.count} products successfully`, 'success');
    closeModal('dataModal');
    renderStats();
    renderTable();
  } else {
    showToast(result.error, 'error');
  }
}

function copyDataToClipboard() {
  const textarea = $('#dataTextarea');
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('Copied to clipboard', 'success');
  } catch (e) {
    showToast('Copy failed. Please select and copy manually.', 'error');
  }
}

/* ---------- Reset ---------- */
function confirmReset() {
  $('#confirmTitle').textContent = 'Reset to Defaults?';
  $('#confirmMessage').innerHTML = 'This will replace all your products with the original 12 default products. Your custom data will be lost.';
  $('#btnConfirmAction').textContent = 'Reset';

  confirmCallback = () => {
    Store.resetToDefault();
    showToast('Products reset to defaults', 'success');
    closeModal('confirmModal');
    renderStats();
    renderTable();
  };

  openModal('confirmModal');
}

/* ---------- Modal Helpers ---------- */
function openModal(id) {
  $('#' + id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  $('#' + id).classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- Toast ---------- */
function showToast(message, type) {
  const toast = $('#toast');
  const msgEl = $('#toastMessage');
  msgEl.textContent = message;
  toast.className = 'toast ' + (type || 'success');
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ---------- Featured Toggle ---------- */
function initFeaturedToggle() {
  const toggle = $('#featuredToggle');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
  });
}

/* ---------- Event Listeners ---------- */
function initEventListeners() {
  // Add button
  $('#btnAdd').addEventListener('click', openAddModal);

  // Save button
  $('#btnSaveProduct').addEventListener('click', saveProduct);

  // Import / Export / Reset
  $('#btnImport').addEventListener('click', openImportModal);
  $('#btnExport').addEventListener('click', openExportModal);
  $('#btnReset').addEventListener('click', confirmReset);

  // Confirm action (delete / reset)
  $('#btnConfirmAction').addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
  });

  // Search
  $('#searchInput').addEventListener('input', renderTable);

  // Filter
  $('#filterCategory').addEventListener('change', renderTable);

  // Form live preview
  $('#pName').addEventListener('input', updatePreview);
  $('#pTag').addEventListener('change', updatePreview);

  // Featured toggle
  initFeaturedToggle();

  // Rich text editor toolbar
  initRichEditor();

  // Close modal on overlay click
  $$('.modal-overlay, .confirm-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $$('.modal-overlay.open, .confirm-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });

  // Enter key to save in form
  $('#productForm').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      saveProduct();
    }
  });
}

/* ---------- Utility ---------- */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ---------- Rich Text Editor (Description) ---------- */
function getRichEditorHTML() {
  const el = $('#pDesc');
  if (!el) return '';
  return el.innerHTML;
}
function setRichEditor(html) {
  const el = $('#pDesc');
  if (!el) return;
  el.innerHTML = html || '';
}
function isDescriptionEmpty() {
  const el = $('#pDesc');
  if (!el) return true;
  const text = (el.textContent || '').trim();
  return text === '' && !el.querySelector('img');
}
function initRichEditor() {
  const toolbar = $('#richToolbar');
  if (!toolbar) return;
  // mousedown so the editor keeps its selection/focus
  toolbar.addEventListener('mousedown', (e) => {
    const btn = e.target.closest('button[data-cmd]');
    if (!btn) return;
    e.preventDefault();
    const cmd = btn.dataset.cmd;
    const value = btn.dataset.value;
    $('#pDesc').focus();
    if (cmd === 'createLink') {
      const url = window.prompt('Enter link URL (https://...):', 'https://');
      if (url) document.execCommand('createLink', false, url);
    } else if (value) {
      document.execCommand(cmd, false, value);
    } else {
      document.execCommand(cmd, false, null);
    }
    // refresh live preview
    if (typeof updatePreview === 'function') updatePreview();
  });
  // update preview while typing in the editor
  const editor = $('#pDesc');
  if (editor) {
    editor.addEventListener('input', () => {
      if (typeof updatePreview === 'function') updatePreview();
    });
  }
}

/* ---------- Expose for inline onclick ---------- */
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.confirmDelete = confirmDelete;
window.closeModal = closeModal;

/* ============================================
   Page Content Management (CMS)
   ============================================ */

/* ---------- Tab Switching ---------- */
(function initTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const contents = document.querySelectorAll('.admin-tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab' + target.charAt(0).toUpperCase() + target.slice(1));
      if (panel) panel.classList.add('active');
      // Load content editor when switching to content tab
      if (target === 'content') {
        loadContentEditor();
      }
    });
  });
})();

/* ---------- Content Editor ---------- */
let currentContentPage = 'index';

function loadContentEditor() {
  const select = document.getElementById('contentPageSelect');
  const editorArea = document.getElementById('contentEditorArea');
  const hintEl = document.getElementById('contentPageHint');
  if (!select || !editorArea) return;

  // Set initial page from select
  currentContentPage = select.value || 'index';

  // If first load, populate hint
  updateContentHint(currentContentPage, hintEl);

  // Render the editor for the current page
  renderContentEditor(currentContentPage, editorArea);

  // Handle page selection change
  select.onchange = function() {
    currentContentPage = this.value;
    updateContentHint(currentContentPage, hintEl);
    renderContentEditor(currentContentPage, editorArea);
  };

  // Save button
  const saveBtn = document.getElementById('btnContentSave');
  if (saveBtn) {
    saveBtn.onclick = saveContentChanges;
  }

  // Reset button
  const resetBtn = document.getElementById('btnContentReset');
  if (resetBtn) {
    resetBtn.onclick = resetContentPage;
  }
}

function updateContentHint(page, hintEl) {
  if (!hintEl || !Content) return;
  const overrides = Content.getPage(page);
  const count = Object.keys(overrides).length;
  const schema = Content.getSchema()[page];
  const total = schema ? schema.groups.reduce((sum, g) => sum + g.items.length, 0) : 0;
  hintEl.textContent = count > 0
    ? count + ' of ' + total + ' fields customized'
    : total + ' editable fields available';
}

function renderContentEditor(page, container) {
  if (!Content || !container) return;
  const schema = Content.getSchema()[page];
  if (!schema) {
    container.innerHTML = '<div class="content-empty"><p>No editable content for this page.</p></div>';
    return;
  }

  const overrides = Content.getPage(page);
  let html = '';

  schema.groups.forEach(group => {
    html += '<div class="content-group">';
    html += '<div class="content-group-header">';
    html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>';
    html += escapeHtml(group.name) + '</div>';
    html += '<div class="content-group-body">';

    group.items.forEach(item => {
      const savedValue = overrides[item.id];
      const hasOverride = savedValue !== undefined;
      const fieldType = item.type === 'html' ? 'html' : item.type === 'image' ? 'image' : 'text';
      const typeLabel = item.type === 'html' ? 'HTML' : item.type === 'image' ? 'Image' : 'Text';

      html += '<div class="content-field">';
      html += '<label>' + escapeHtml(item.label) + ' <span class="field-type">' + typeLabel + '</span>';
      if (hasOverride) html += ' <span class="field-type" style="color:var(--c-accent); background:rgba(102,0,153,.1);">Modified</span>';
      html += '</label>';

      if (item.type === 'image') {
        const imgSrc = hasOverride ? savedValue : '';
        html += '<div class="content-field-image">';
        html += '<img src="' + (imgSrc || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23f5f5f5%22/%3E%3Ctext x=%2230%22 y=%2235%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2210%22%3ENo img%3C/text%3E%3C/svg%3E') + '" alt="Preview">';
        html += '<div class="image-controls">';
        html += '<input type="text" class="content-input" data-cms-id="' + item.id + '" placeholder="Image URL or upload..." value="' + escapeAttr(imgSrc) + '">';
        html += '<label class="btn-upload-img">Upload Image<input type="file" accept="image/*" style="display:none;" data-cms-upload="' + item.id + '"></label>';
        html += '</div>';
        html += '</div>';
      } else if (item.type === 'html') {
        html += '<textarea class="content-input html-field" data-cms-id="' + item.id + '" placeholder="Enter HTML content...">' + escapeHtml(savedValue || '') + '</textarea>';
      } else {
        // For text, check if the saved value is long
        const val = savedValue || '';
        if (val.length > 80) {
          html += '<textarea class="content-input" data-cms-id="' + item.id + '" placeholder="Enter text...">' + escapeHtml(val) + '</textarea>';
        } else {
          html += '<input type="text" class="content-input" data-cms-id="' + item.id + '" placeholder="Enter text..." value="' + escapeAttr(val) + '">';
        }
      }
      html += '</div>';
    });

    html += '</div></div>';
  });

  container.innerHTML = html;

  // Handle image uploads
  container.querySelectorAll('[data-cms-upload]').forEach(input => {
    input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const itemId = this.dataset.cmsUpload;
      const reader = new FileReader();
      reader.onload = function(ev) {
        const textInput = container.querySelector('input[data-cms-id="' + itemId + '"]');
        if (textInput) {
          textInput.value = ev.target.result;
          const img = textInput.closest('.content-field-image').querySelector('img');
          if (img) img.src = ev.target.result;
        }
      };
      reader.readAsDataURL(file);
    });
  });
}

function saveContentChanges() {
  if (!Content || !currentContentPage) return;
  const inputs = document.querySelectorAll('#contentEditorArea .content-input');
  const values = {};
  let changedCount = 0;

  inputs.forEach(input => {
    const itemId = input.dataset.cmsId;
    const val = input.value.trim();
    if (val) {
      values[itemId] = val;
      changedCount++;
    }
  });

  Content.savePage(currentContentPage, values);
  showToast(changedCount + ' fields saved for ' + Content.getSchema()[currentContentPage].label);
  updateContentHint(currentContentPage, document.getElementById('contentPageHint'));
}

function resetContentPage() {
  if (!Content || !currentContentPage) return;
  if (!confirm('Reset all content changes for ' + Content.getSchema()[currentContentPage].label + '? This will restore the original text and images.')) {
    return;
  }
  Content.resetPage(currentContentPage);
  showToast('Page content reset to defaults');
  renderContentEditor(currentContentPage, document.getElementById('contentEditorArea'));
  updateContentHint(currentContentPage, document.getElementById('contentPageHint'));
}
