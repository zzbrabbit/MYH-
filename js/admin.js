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
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize storage before any reads/writes
  if (typeof Store !== 'undefined') await Store.init();
  if (typeof Content !== 'undefined') await Content.init();
  if (typeof Banners !== 'undefined') await Banners.init();

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

  updateStorageIndicator();
}

/* ---------- Storage Indicator ---------- */
async function updateStorageIndicator() {
  const el = $('#storageIndicator');
  if (!el) return;
  const info = await Store.getStorageInfo();
  const warnClass = info.percent > 80 ? 'storage-warn' : '';
  el.className = 'storage-bar ' + warnClass;
  el.innerHTML = '<span class="storage-label">Storage: ' + info.usedKB + 'KB / ' + info.quotaKB + 'KB (' + info.percent + '%) · ' + escapeHtml(info.source) + '</span><div class="storage-track"><div class="storage-fill" style="width:' + info.percent + '%"></div></div>';
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

  // File upload — auto-compress before storing
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image too large (max 10MB). Please use a smaller image.', 'error');
      fileInput.value = '';
      return;
    }
    try {
      showToast('Compressing image...', 'success');
      const result = await compressImage(file, 800, 0.7);
      urlInput.value = result.dataUrl;
      preview.innerHTML = '<img src="' + result.dataUrl + '" alt="Preview">';
      showToast('Image ready (' + result.sizeKB + 'KB)', 'success');
    } catch (err) {
      showToast('Failed to process image: ' + err.message, 'error');
    }
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

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image too large (max 10MB)', 'error');
      fileInput.value = '';
      return;
    }
    try {
      showToast('Compressing image...', 'success');
      const result = await compressImage(file, 800, 0.7);
      galleryImages.push(result.dataUrl);
      renderGallery();
      showToast('Image added (' + result.sizeKB + 'KB)', 'success');
    } catch (err) {
      showToast('Failed to process image: ' + err.message, 'error');
    }
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
async function saveProduct() {
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
    const result = await Store.updateProduct(currentEditId, productData);
    if (!result) {
      const info = await Store.getStorageInfo();
      showToast('Save failed! Storage ' + info.percent + '% full (' + info.usedKB + 'KB/' + info.quotaKB + 'KB). Use smaller images or delete unused products.', 'error');
      return;
    }
    showToast('Product updated successfully', 'success');
  } else {
    const result = await Store.addProduct(productData);
    if (!result) {
      const info = await Store.getStorageInfo();
      showToast('Save failed! Storage ' + info.percent + '% full (' + info.usedKB + 'KB/' + info.quotaKB + 'KB). Use smaller images or delete unused products.', 'error');
      return;
    }
    showToast('Product added successfully', 'success');
  }

  closeModal('productModal');
  renderStats();
  renderTable();
  await updateStorageIndicator();
}

/* ---------- Delete ---------- */
function confirmDelete(id) {
  const product = Store.getProduct(id);
  if (!product) return;

  $('#confirmTitle').textContent = 'Delete Product?';
  $('#confirmMessage').innerHTML = `Are you sure you want to delete <strong>${escapeHtml(product.name)}</strong>? This action cannot be undone.`;
  $('#btnConfirmAction').textContent = 'Delete';

  confirmCallback = async () => {
    const result = await Store.deleteProduct(id);
    if (result) {
      showToast('Product deleted', 'success');
      closeModal('confirmModal');
      renderStats();
      renderTable();
      await updateStorageIndicator();
    } else {
      showToast('Delete failed! Please try again.', 'error');
    }
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

/* ---------- Publish Bundle (data.js) ----------
   Exports ALL site data (products, blog posts, page content, banners,
   category icons — images included as dataURLs) as a website/data.js file.
   Drop the downloaded data.js into the website root and redeploy; new
   visitors will then see exactly this content. */
async function buildPublishBundle() {
  await Promise.all([Store.init(), Content.init(), Banners.init(), CatNav.init(), Posts.init(), Social.init()]);
  let fwdEmail = '';
  try {
    if (typeof Messages !== 'undefined') { await Messages.init(); fwdEmail = await Messages.getForwardEmail(); }
  } catch (e) { /* ignore */ }
  const bundle = {
    version: 1,
    publishedAt: new Date().toISOString(),
    products: JSON.parse(JSON.stringify(Store._cache || [])),
    posts: JSON.parse(JSON.stringify(Posts.getAll())),
    content: JSON.parse(JSON.stringify(await Content.getAll())),
    banners: JSON.parse(JSON.stringify(Banners.getAll())),
    catnav: JSON.parse(JSON.stringify(CatNav.getAll())),
    social: JSON.parse(JSON.stringify(Social.getAll())),
    msgForwardEmail: fwdEmail || undefined
  };
  return bundle;
}

async function exportPublishBundle() {
  try {
    const bundle = await buildPublishBundle();
    const js = '/* MYHBeauty published data — generated by the admin panel.\n'
      + '   Replace website/data.js with this file and redeploy the site. */\n'
      + 'window.MYH_PUBLISHED_DATA = ' + JSON.stringify(bundle) + ';\n';
    const blob = new Blob([js], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    const kb = Math.round(blob.size / 1024);
    showToast(`Publish bundle downloaded (data.js, ${kb} KB). Put it in the website root and redeploy.`, 'success');
  } catch (e) {
    showToast('Export failed: ' + e.message, 'error');
  }
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

async function importData() {
  const json = $('#dataTextarea').value.trim();
  if (!json) {
    showToast('Please paste JSON data first', 'error');
    return;
  }
  const result = await Store.importData(json);
  if (result.success) {
    showToast(`Imported ${result.count} products successfully`, 'success');
    closeModal('dataModal');
    renderStats();
    renderTable();
    await updateStorageIndicator();
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

  confirmCallback = async () => {
    await Store.resetToDefault();
    showToast('Products reset to defaults', 'success');
    closeModal('confirmModal');
    renderStats();
    renderTable();
    await updateStorageIndicator();
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

  // Import / Export / Reset / Publish
  $('#btnImport').addEventListener('click', openImportModal);
  $('#btnExport').addEventListener('click', openExportModal);
  $('#btnReset').addEventListener('click', confirmReset);
  const publishBtn = $('#btnPublishData');
  if (publishBtn) publishBtn.addEventListener('click', exportPublishBundle);

  // Sync to GitHub
  const githubBtn = $('#btnGithubSync');
  if (githubBtn) githubBtn.addEventListener('click', openGithubModal);
  const ghPushBtn = $('#btnGithubPush');
  if (ghPushBtn) ghPushBtn.addEventListener('click', pushToGithub);
  const ghTestBtn = $('#btnGithubTest');
  if (ghTestBtn) ghTestBtn.addEventListener('click', testGithubConnection);
  const ghSiteBtn = $('#btnGithubPushSite');
  if (ghSiteBtn) ghSiteBtn.addEventListener('click', pushWholeSiteToGithub);
  const ghFilesBtn = $('#btnGithubPushFiles');
  if (ghFilesBtn) ghFilesBtn.addEventListener('click', pushAsFilesToGithub);

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
      // Load banner manager when switching to banners tab
      if (target === 'banners') {
        loadBannerManager();
      }
      // Load category icon manager when switching to catnav tab
      if (target === 'catnav') {
        loadCatNavManager();
      }
      // Load blog article manager when switching to blog tab
      if (target === 'blog') {
        loadBlogManager();
      }
      // Load social link manager when switching to social tab
      if (target === 'social') {
        loadSocialManager();
      }
      // Load messages manager when switching to messages tab
      if (target === 'messages') {
        loadMessagesManager();
      }
    });
  });
})();

/* ---------- Content Editor ---------- */
let currentContentPage = 'index';

async function loadContentEditor() {
  const select = document.getElementById('contentPageSelect');
  const editorArea = document.getElementById('contentEditorArea');
  const hintEl = document.getElementById('contentPageHint');
  if (!select || !editorArea) return;

  // Set initial page from select
  currentContentPage = select.value || 'index';

  // If first load, populate hint
  await updateContentHint(currentContentPage, hintEl);

  // Render the editor for the current page
  await renderContentEditor(currentContentPage, editorArea);

  // Handle page selection change
  select.onchange = async function() {
    currentContentPage = this.value;
    await updateContentHint(currentContentPage, hintEl);
    await renderContentEditor(currentContentPage, editorArea);
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

async function updateContentHint(page, hintEl) {
  if (!hintEl || !Content) return;
  const overrides = await Content.getPage(page);
  const count = Object.keys(overrides).length;
  const schema = Content.getSchema()[page];
  const total = schema ? schema.groups.reduce((sum, g) => sum + g.items.length, 0) : 0;
  hintEl.textContent = count > 0
    ? count + ' of ' + total + ' fields customized'
    : total + ' editable fields available';
}

async function renderContentEditor(page, container) {
  if (!Content || !container) return;
  const schema = Content.getSchema()[page];
  if (!schema) {
    container.innerHTML = '<div class="content-empty"><p>No editable content for this page.</p></div>';
    return;
  }

  const overrides = await Content.getPage(page);
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
      if (hasOverride) html += ' <span class="field-type" style="color:var(--c-accent); background:rgba(24,119,242,.1);">Modified</span>';
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

  // Handle image uploads — with compression
  container.querySelectorAll('[data-cms-upload]').forEach(input => {
    input.addEventListener('change', async function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const itemId = this.dataset.cmsUpload;
      try {
        showToast('Compressing image...', 'success');
        const result = await compressImage(file, 800, 0.7);
        const textInput = container.querySelector('input[data-cms-id="' + itemId + '"]');
        if (textInput) {
          textInput.value = result.dataUrl;
          const img = textInput.closest('.content-field-image').querySelector('img');
          if (img) img.src = result.dataUrl;
        }
        showToast('Image ready (' + result.sizeKB + 'KB)', 'success');
      } catch (err) {
        showToast('Failed to process image: ' + err.message, 'error');
      }
      this.value = '';
    });
  });
}

async function saveContentChanges() {
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

  const ok = await Content.savePage(currentContentPage, values);
  if (!ok) {
    showToast('Failed to save page content. Storage may be full.', 'error');
    return;
  }
  showToast(changedCount + ' fields saved for ' + Content.getSchema()[currentContentPage].label);
  await updateContentHint(currentContentPage, document.getElementById('contentPageHint'));
}

async function resetContentPage() {
  if (!Content || !currentContentPage) return;
  if (!confirm('Reset all content changes for ' + Content.getSchema()[currentContentPage].label + '? This will restore the original text and images.')) {
    return;
  }
  await Content.resetPage(currentContentPage);
  showToast('Page content reset to defaults');
  await renderContentEditor(currentContentPage, document.getElementById('contentEditorArea'));
  await updateContentHint(currentContentPage, document.getElementById('contentPageHint'));
}

/* ============================================
   Home Banner (Poster Carousel) Management
   ============================================ */
let bannerEditData = [];
let bannerDirty = false;

async function loadBannerManager() {
  const area = $('#bannerManagerArea');
  if (!area || typeof Banners === 'undefined') return;

  // Reload saved banners only when there are no unsaved edits
  if (!bannerDirty) {
    bannerEditData = Banners.getAll();
  }
  renderBannerManager();

  const saveBtn = $('#btnBannerSave');
  if (saveBtn) saveBtn.onclick = saveBanners;
  const resetBtn = $('#btnBannerReset');
  if (resetBtn) resetBtn.onclick = confirmResetBanners;
}

function renderBannerManager() {
  const area = $('#bannerManagerArea');
  if (!area) return;

  if (!bannerEditData.length) {
    area.innerHTML = `
      <div class="banner-admin-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 16l-5-5L5 22"/></svg>
        <h3>No Home Banners</h3>
        <p>The homepage slider is currently hidden. Add your first poster below.</p>
      </div>
      <button class="btn-admin btn-admin-primary" id="btnAddBannerSlide">+ Add Banner Slide</button>`;
    bindBannerAreaEvents(area);
    return;
  }

  const cardsHtml = bannerEditData.map((b, i) => {
    const img = b.image
      ? `<img src="${escapeAttr(b.image)}" alt="Banner ${i + 1}" onerror="this.style.display='none';">`
      : '';
    const placeholder = b.image ? '' : '<span class="banner-thumb-ph">No image</span>';
    const canUp = i > 0;
    const canDown = i < bannerEditData.length - 1;
    return `
      <div class="banner-admin-card" data-idx="${i}">
        <div class="banner-admin-order">${i + 1}</div>
        <div class="banner-admin-preview">
          <div class="banner-thumb">${img}${placeholder}</div>
        </div>
        <div class="banner-admin-body">
          <div class="banner-admin-row">
            <label>Poster Image <span>1920 &times; 650 recommended &middot; landscape</span></label>
            <div class="banner-admin-imgline">
              <input type="text" class="banner-admin-input banner-img" data-field="image" data-idx="${i}" placeholder="https://... or upload a file" value="${escapeAttr(b.image || '')}">
              <span class="rt-divider">or</span>
              <label class="btn-upload">
                <input type="file" accept="image/*" data-upload="${i}" hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                Upload
              </label>
            </div>
          </div>
          <div class="banner-admin-row">
            <label>Link URL <span>optional &middot; where this poster leads</span></label>
            <input type="text" class="banner-admin-input" data-field="link" data-idx="${i}" placeholder="products.html?cat=rf  or  https://example.com/page" value="${escapeAttr(b.link || '')}">
          </div>
          <div class="banner-admin-row">
            <label>Alt Text <span>optional &middot; for accessibility</span></label>
            <input type="text" class="banner-admin-input" data-field="alt" data-idx="${i}" placeholder="Describe this poster" value="${escapeAttr(b.alt || '')}">
          </div>
        </div>
        <div class="banner-admin-actions">
          <button type="button" class="banner-act-btn" data-act="up" data-idx="${i}" ${canUp ? '' : 'disabled'} title="Move up">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
          </button>
          <button type="button" class="banner-act-btn" data-act="down" data-idx="${i}" ${canDown ? '' : 'disabled'} title="Move down">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <button type="button" class="banner-act-btn danger" data-act="remove" data-idx="${i}" title="Delete banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </div>`;
  }).join('');

  area.innerHTML = `
    <div class="banner-admin-count">${bannerEditData.length} poster${bannerEditData.length === 1 ? '' : 's'} &middot; homepage auto-scrolls every 5s</div>
    <div class="banner-admin-list">${cardsHtml}</div>
    <button class="btn-admin btn-admin-outline" id="btnAddBannerSlide">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      Add Banner Slide
    </button>`;

  bindBannerAreaEvents(area);
}

function bindBannerAreaEvents(area) {
  // Text inputs keep the working copy in sync
  area.querySelectorAll('[data-field]').forEach(input => {
    input.addEventListener('input', () => {
      const banner = bannerEditData[+input.dataset.idx];
      if (!banner) return;
      banner[input.dataset.field] = input.value;
      bannerDirty = true;
      if (input.dataset.field === 'image') {
        updateBannerThumb(+input.dataset.idx, input.value);
      }
    });
  });

  // Action buttons (up / down / remove)
  area.querySelectorAll('[data-act]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.idx;
      const act = btn.dataset.act;
      if (act === 'up') moveBanner(i, -1);
      else if (act === 'down') moveBanner(i, 1);
      else if (act === 'remove') confirmDeleteBanner(i);
    });
  });

  // File upload with auto-compression
  area.querySelectorAll('input[type="file"][data-upload]').forEach(fileInput => {
    fileInput.addEventListener('change', async function() {
      const i = +this.dataset.upload;
      const file = this.files[0];
      this.value = '';
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image too large (max 10MB)', 'error');
        return;
      }
      try {
        showToast('Compressing image...', 'success');
        const result = await compressImage(file, 1920, 0.72, 320);
        const banner = bannerEditData[i];
        if (!banner) return;
        banner.image = result.dataUrl;
        bannerDirty = true;
        renderBannerManager();
        showToast('Image ready (' + result.sizeKB + 'KB) — click Save Banners', 'success');
      } catch (err) {
        showToast('Failed to process image: ' + err.message, 'error');
      }
    });
  });

  // Add slide
  const addBtn = area.querySelector('#btnAddBannerSlide');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      bannerEditData.push({ id: '', image: '', link: '', alt: '' });
      bannerDirty = true;
      renderBannerManager();
    });
  }
}

function updateBannerThumb(idx, url) {
  const card = document.querySelector('.banner-admin-card[data-idx="' + idx + '"]');
  if (!card) return;
  const thumb = card.querySelector('.banner-thumb');
  if (!thumb) return;
  if (url && url.trim()) {
    thumb.innerHTML = '<img src="' + escapeAttr(url.trim()) + '" alt="Banner preview" onerror="this.style.display=\'none\';">';
  } else {
    thumb.innerHTML = '<span class="banner-thumb-ph">No image</span>';
  }
}

function moveBanner(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= bannerEditData.length) return;
  const tmp = bannerEditData[i];
  bannerEditData[i] = bannerEditData[j];
  bannerEditData[j] = tmp;
  bannerDirty = true;
  renderBannerManager();
}

function confirmDeleteBanner(i) {
  const banner = bannerEditData[i];
  if (!banner) return;
  $('#confirmTitle').textContent = 'Delete Banner?';
  $('#confirmMessage').innerHTML = 'Remove this poster from the homepage carousel? You can add it again later.';
  $('#btnConfirmAction').textContent = 'Delete';
  confirmCallback = () => {
    bannerEditData.splice(i, 1);
    bannerDirty = true;
    closeModal('confirmModal');
    renderBannerManager();
    showToast('Banner removed — remember to save', 'success');
  };
  openModal('confirmModal');
}

async function saveBanners() {
  if (typeof Banners === 'undefined') return;
  if (!bannerEditData.length) {
    showToast('No banners to save. Add at least one poster or press Cancel.', 'error');
    return;
  }
  const ok = await Banners.saveAll(bannerEditData);
  if (!ok) {
    showToast('Failed to save banners. Storage may be full.', 'error');
    return;
  }
  bannerDirty = false;
  showToast('Home banners saved (' + bannerEditData.length + ' slide' + (bannerEditData.length === 1 ? '' : 's') + ')', 'success');
  await updateStorageIndicator();
}

function confirmResetBanners() {
  $('#confirmTitle').textContent = 'Reset Home Banners?';
  $('#confirmMessage').innerHTML = 'Restore the default five posters? Your current banner list will be replaced.';
  $('#btnConfirmAction').textContent = 'Reset';
  confirmCallback = async () => {
    const result = await Banners.resetToDefault();
    if (!result) {
      showToast('Reset failed. Please try again.', 'error');
      return;
    }
    bannerEditData = result;
    bannerDirty = false;
    closeModal('confirmModal');
    renderBannerManager();
    showToast('Home banners reset to defaults', 'success');
    await updateStorageIndicator();
  };
  openModal('confirmModal');
}

/* ============================================
   Category Icon Manager (homepage quick-nav)
   8 fixed tiles; each may carry a custom image
   ============================================ */
let catNavEditData = [];
let catNavDirty = false;

async function loadCatNavManager() {
  const area = $('#catNavManagerArea');
  if (!area || typeof CatNav === 'undefined') return;

  if (!catNavDirty) {
    try { await CatNav.init(); } catch (e) { /* ignore */ }
    catNavEditData = CatNav.getAll();
  }
  renderCatNavManager();

  const saveBtn = $('#btnCatNavSave');
  if (saveBtn) saveBtn.onclick = saveCatNav;
  const resetBtn = $('#btnCatNavReset');
  if (resetBtn) resetBtn.onclick = confirmResetCatNav;
}

function renderCatNavManager() {
  const area = $('#catNavManagerArea');
  if (!area) return;
  const metaOf = (cat) => (typeof CATEGORY_LIBRARY !== 'undefined' && CATEGORY_LIBRARY[cat]) ? CATEGORY_LIBRARY[cat] : { label: cat };

  const cardsHtml = catNavEditData.map((t, i) => {
    const meta = metaOf(t.cat);
    const iconSvg = (typeof ICON_LIBRARY !== 'undefined' && ICON_LIBRARY[meta.icon]) ? ICON_LIBRARY[meta.icon] : '';
    const preview = t.image
      ? '<img src="' + escapeAttr(t.image) + '" alt="' + escapeAttr(meta.label) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'\';">'
      : '';
    const fallback = '<span class="catnav-thumb-icon"' + (t.image ? ' style="display:none;"' : '') + '>' + iconSvg + '</span>';
    return `
      <div class="banner-admin-card catnav-admin-card" data-idx="${i}">
        <div class="banner-admin-order">${i + 1}</div>
        <div class="banner-admin-preview">
          <div class="banner-thumb catnav-thumb">${preview}${fallback}</div>
        </div>
        <div class="banner-admin-body">
          <div class="banner-admin-row">
            <label>${meta.label} <span>custom image &middot; leave empty to use the default icon</span></label>
            <div class="banner-admin-imgline">
              <input type="text" class="banner-admin-input catnav-img" data-field="image" data-idx="${i}" placeholder="https://... or upload a file" value="${escapeAttr(t.image || '')}">
              <span class="rt-divider">or</span>
              <label class="btn-upload">
                <input type="file" accept="image/*" data-upload="${i}" hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                Upload
              </label>
              <button type="button" class="banner-act-btn danger" data-act="clear" data-idx="${i}" title="Use default icon" ${t.image ? '' : 'disabled'}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
          <div class="banner-admin-row">
            <label>Alt Text <span>optional &middot; for accessibility</span></label>
            <input type="text" class="banner-admin-input" data-field="alt" data-idx="${i}" placeholder="Describe this image" value="${escapeAttr(t.alt || '')}">
          </div>
        </div>
      </div>`;
  }).join('');

  area.innerHTML = `
    <div class="banner-admin-count">${catNavEditData.length} category tiles &middot; shown under the homepage poster carousel</div>
    <div class="banner-admin-list">${cardsHtml}</div>`;

  bindCatNavAreaEvents(area);
}

function bindCatNavAreaEvents(area) {
  area.querySelectorAll('[data-field]').forEach(input => {
    input.addEventListener('input', () => {
      const item = catNavEditData[+input.dataset.idx];
      if (!item) return;
      item[input.dataset.field] = input.value;
      catNavDirty = true;
      if (input.dataset.field === 'image') {
        updateCatNavThumb(+input.dataset.idx, input.value);
      }
    });
  });

  area.querySelectorAll('[data-act="clear"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.idx;
      const item = catNavEditData[i];
      if (!item) return;
      item.image = '';
      catNavDirty = true;
      const input = area.querySelector('.catnav-img[data-idx="' + i + '"]');
      if (input) input.value = '';
      updateCatNavThumb(i, '');
    });
  });

  area.querySelectorAll('input[type="file"][data-upload]').forEach(fileInput => {
    fileInput.addEventListener('change', async function() {
      const i = +this.dataset.upload;
      const file = this.files && this.files[0];
      if (!file || !catNavEditData[i]) return;
      if (!file.type.startsWith('image/')) {
        showToast('Please choose an image file', 'error');
        return;
      }
      try {
        showToast('Compressing image...', 'success');
        const result = await compressImage(file, 300, 0.85, 80);
        catNavEditData[i].image = result.dataUrl;
        catNavDirty = true;
        const input = area.querySelector('.catnav-img[data-idx="' + i + '"]');
        if (input) input.value = result.dataUrl;
        updateCatNavThumb(i, result.dataUrl);
        showToast('Image ready (' + result.sizeKB + 'KB). Click "Save Icons" to apply.', 'success');
      } catch (err) {
        showToast('Failed to process image: ' + err.message, 'error');
      }
      this.value = '';
    });
  });
}

function updateCatNavThumb(i, imageSrc) {
  const area = $('#catNavManagerArea');
  if (!area) return;
  const card = area.querySelector('.catnav-admin-card[data-idx="' + i + '"]');
  if (!card) return;
  const thumb = card.querySelector('.catnav-thumb');
  if (!thumb) return;
  const clearBtn = card.querySelector('[data-act="clear"]');
  if (clearBtn) clearBtn.disabled = !imageSrc;
  let img = thumb.querySelector('img');
  const iconSpan = thumb.querySelector('.catnav-thumb-icon');
  if (imageSrc) {
    if (!img) {
      img = document.createElement('img');
      img.alt = '';
      thumb.insertBefore(img, thumb.firstChild);
    }
    img.style.display = '';
    img.src = imageSrc;
    if (iconSpan) iconSpan.style.display = 'none';
  } else {
    if (img) img.style.display = 'none';
    if (iconSpan) iconSpan.style.display = '';
  }
}

async function saveCatNav() {
  if (typeof CatNav === 'undefined') return;
  const ok = await CatNav.saveAll(catNavEditData);
  if (!ok) {
    showToast('Failed to save category icons. Storage may be full.', 'error');
    return;
  }
  catNavDirty = false;
  showToast('Category icons saved', 'success');
  await updateStorageIndicator();
}

function confirmResetCatNav() {
  $('#confirmTitle').textContent = 'Reset Category Icons?';
  $('#confirmMessage').innerHTML = 'Remove all custom images and restore the built-in blue line icons?';
  $('#btnConfirmAction').textContent = 'Reset';
  confirmCallback = async () => {
    const result = await CatNav.resetToDefault();
    if (!result) {
      showToast('Reset failed. Please try again.', 'error');
      return;
    }
    catNavEditData = result;
    catNavDirty = false;
    closeModal('confirmModal');
    renderCatNavManager();
    showToast('Category icons reset to defaults', 'success');
    await updateStorageIndicator();
  };
  openModal('confirmModal');
}

/* ============================================
   Blog Article Manager (admin)
   Add / edit / delete the articles rendered
   on blog.html and the homepage blog preview.
   ============================================ */
let blogEditList = [];
const BLOG_POST_GRADIENT = 'linear-gradient(145deg, #4E9EF6, #1877F2)';

async function loadBlogManager() {
  const area = $('#blogAdminArea');
  if (!area || typeof Posts === 'undefined') return;
  try { await Posts.init(); } catch (e) { /* ignore */ }
  blogEditList = Posts.getAll();
  populateBlogCategories();
  renderBlogAdmin();
}

/* Fill the category datalist: standard blog categories + any custom ones already in use */
function populateBlogCategories() {
  const dl = $('#blogCategoryOptions');
  if (!dl) return;
  const seen = {};
  const cats = [];
  (typeof BLOG_CATEGORIES !== 'undefined' ? BLOG_CATEGORIES : []).forEach(c => { if (!seen[c]) { seen[c] = 1; cats.push(c); } });
  blogEditList.forEach(p => { if (p.category && !seen[p.category]) { seen[p.category] = 1; cats.push(p.category); } });
  dl.innerHTML = cats.map(c => '<option value="' + escapeAttr(c) + '">').join('');
}

function renderBlogAdmin() {
  const area = $('#blogAdminArea');
  if (!area) return;
  const q = ($('#blogSearchInput') ? $('#blogSearchInput').value : '').toLowerCase().trim();
  let list = blogEditList.slice();
  if (q) {
    list = list.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.author || '').toLowerCase().includes(q)
    );
  }
  const countEl = $('#blogResultCount');
  if (countEl) countEl.textContent = list.length + ' article' + (list.length !== 1 ? 's' : '');

  if (list.length === 0) {
    area.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M4 4h16v12H5.17L4 17.17V4z"/><path d="M8 10h8M8 7h8M8 13h5"/></svg>
        <h3>No Articles Found</h3>
        <p>${q ? 'Try a different search keyword.' : 'Start by writing your first article.'}</p>
      </div>`;
    return;
  }

  const rows = list.map(p => {
    const thumbImg = p.image
      ? '<img src="' + escapeAttr(p.image) + '" alt="" onerror="this.style.display=\'none\';">'
      : '';
    const excerpt = (p.excerpt || '').length > 110 ? p.excerpt.slice(0, 110) + '\u2026' : (p.excerpt || '');
    return `
      <tr>
        <td>
          <div class="product-preview">
            <div class="product-thumb" style="background:${BLOG_POST_GRADIENT};">
              ${thumbImg}
            </div>
            <div class="product-preview-info">
              <h4>${escapeHtml(p.title) || '(Untitled)'}</h4>
              <span class="pid">${p.id} · ${escapeHtml(p.author || 'MYHBeauty Team')} · ${escapeHtml(p.readTime || '')}</span>
            </div>
          </div>
        </td>
        <td><span class="cat-badge">${escapeHtml(p.category)}</span></td>
        <td class="blog-admin-excerpt">${escapeHtml(excerpt)}</td>
        <td><span class="featured-star ${p.featured ? '' : 'inactive'}">${p.featured ? '\u2605' : '\u2606'}</span></td>
        <td style="color:var(--c-text-soft); white-space:nowrap;">${escapeHtml(p.date || '\u2014')}</td>
        <td>
          <div class="row-actions" style="justify-content:flex-end;">
            <button class="action-btn" onclick="openEditPostModal('${p.id}')" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-btn delete" onclick="confirmDeletePost('${p.id}')" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');

  area.innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table" id="blogTable">
        <thead>
          <tr>
            <th>Article</th>
            <th>Category</th>
            <th>Excerpt</th>
            <th>Featured</th>
            <th>Date</th>
            <th style="width:90px;"></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/* ---------- Add / Edit ---------- */
function resetBlogPostForm() {
  currentEditPostId = null;
  $('#blogPostModalTitle').textContent = 'Add Article';
  $('#blogPostId').value = '';
  $('#blogTitle').value = '';
  $('#blogCategory').value = '';
  $('#blogAuthor').value = '';
  $('#blogDate').value = new Date().toISOString().split('T')[0];
  $('#blogReadTime').value = '';
  $('#blogTags').value = '';
  $('#blogExcerpt').value = '';
  $('#blogImage').value = '';
  updateBlogImagePreview();
  const toggle = $('#blogFeaturedToggle');
  if (toggle) toggle.classList.remove('active');
  const content = $('#blogContent');
  if (content) content.innerHTML = '';
}

function openAddPostModal() {
  resetBlogPostForm();
  openModal('blogPostModal');
  setTimeout(() => { const el = $('#blogTitle'); if (el) el.focus(); }, 60);
}

function openEditPostModal(id) {
  const post = Posts.getPost(id);
  if (!post) return;
  currentEditPostId = id;
  $('#blogPostModalTitle').textContent = 'Edit Article';
  $('#blogPostId').value = id;
  $('#blogTitle').value = post.title || '';
  $('#blogCategory').value = post.category || '';
  $('#blogAuthor').value = post.author || '';
  $('#blogDate').value = post.date || '';
  $('#blogReadTime').value = post.readTime || '';
  $('#blogTags').value = (post.tags || []).join(', ');
  $('#blogExcerpt').value = post.excerpt || '';
  $('#blogImage').value = post.image || '';
  updateBlogImagePreview();
  const toggle = $('#blogFeaturedToggle');
  if (toggle) toggle.classList.toggle('active', !!post.featured);
  const content = $('#blogContent');
  if (content) content.innerHTML = post.content || '';
  openModal('blogPostModal');
}

async function savePost() {
  const title = $('#blogTitle').value.trim();
  const category = $('#blogCategory').value.trim();
  const content = $('#blogContent');
  const hasContent = content && content.textContent.trim().length > 0;

  if (!title) { showToast('Please enter an article title', 'error'); $('#blogTitle').focus(); return; }
  if (!category) { showToast('Please enter a category', 'error'); $('#blogCategory').focus(); return; }
  if (!hasContent) { showToast('Please write the article content', 'error'); if (content) content.focus(); return; }

  const postData = {
    title: title,
    category: category,
    excerpt: $('#blogExcerpt').value.trim(),
    author: $('#blogAuthor').value.trim() || 'MYHBeauty Team',
    date: $('#blogDate').value || new Date().toISOString().split('T')[0],
    readTime: $('#blogReadTime').value.trim() || '5 min',
    image: $('#blogImage').value.trim(),
    featured: $('#blogFeaturedToggle').classList.contains('active'),
    tags: $('#blogTags').value.split(',').map(t => t.trim()).filter(Boolean),
    content: content ? content.innerHTML : ''
  };

  let ok = false;
  if (currentEditPostId) {
    const result = await Posts.updatePost(currentEditPostId, postData);
    ok = !!result;
  } else {
    const result = await Posts.addPost(postData);
    ok = !!result;
  }
  if (!ok) {
    showToast('Failed to save article. Storage may be full.', 'error');
    return;
  }
  showToast(currentEditPostId ? 'Article updated successfully' : 'Article added successfully', 'success');
  closeModal('blogPostModal');
  blogEditList = Posts.getAll();
  renderBlogAdmin();
  await updateStorageIndicator();
}

function confirmDeletePost(id) {
  const post = Posts.getPost(id);
  $('#confirmTitle').textContent = 'Delete Article?';
  $('#confirmMessage').textContent = post
    ? 'The article "' + post.title + '" will be permanently removed.'
    : 'This article will be permanently removed.';
  $('#btnConfirmAction').textContent = 'Delete';
  confirmCallback = async () => {
    const result = await Posts.deletePost(id);
    if (!result) {
      showToast('Delete failed. Please try again.', 'error');
      return;
    }
    closeModal('confirmModal');
    blogEditList = Posts.getAll();
    renderBlogAdmin();
    showToast('Article deleted', 'success');
    await updateStorageIndicator();
  };
  openModal('confirmModal');
}

function confirmResetPosts() {
  $('#confirmTitle').textContent = 'Restore Sample Articles?';
  $('#confirmMessage').textContent = 'This will replace all current articles with the original sample set, including the glowing-skin guide template.';
  $('#btnConfirmAction').textContent = 'Restore';
  confirmCallback = async () => {
    const result = await Posts.resetToDefault();
    if (!result) {
      showToast('Restore failed. Please try again.', 'error');
      return;
    }
    closeModal('confirmModal');
    blogEditList = Posts.getAll();
    populateBlogCategories();
    renderBlogAdmin();
    showToast('Sample articles restored', 'success');
    await updateStorageIndicator();
  };
  openModal('confirmModal');
}

/* ---------- Blog modal helpers ---------- */
function updateBlogImagePreview() {
  const preview = $('#blogImagePreview');
  const input = $('#blogImage');
  if (!preview) return;
  const val = input.value.trim();
  if (val) {
    preview.innerHTML = '<img src="' + escapeAttr(val) + '" alt="Cover preview" onerror="this.innerHTML=\'<span>Image error</span>\';">';
  } else {
    preview.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>No image</span>';
  }
}

function initBlogRichEditor() {
  const toolbar = $('#blogRichToolbar');
  if (!toolbar) return;
  toolbar.addEventListener('mousedown', (e) => {
    const btn = e.target.closest('button[data-cmd]');
    if (!btn) return;
    e.preventDefault();
    const cmd = btn.dataset.cmd;
    const value = btn.dataset.value;
    const editor = $('#blogContent');
    if (editor) editor.focus();
    if (cmd === 'createLink') {
      const url = window.prompt('Enter link URL (https://...):', 'https://');
      if (url) document.execCommand('createLink', false, url);
    } else if (value) {
      document.execCommand(cmd, false, value);
    } else {
      document.execCommand(cmd, false, null);
    }
  });
}

/* Bind static blog-post modal controls once (after DOM ready) */
document.addEventListener('DOMContentLoaded', () => {
  if (!$('#blogPostModal')) return;
  initBlogRichEditor();

  const toggle = $('#blogFeaturedToggle');
  if (toggle) toggle.addEventListener('click', () => toggle.classList.toggle('active'));

  const imageInput = $('#blogImage');
  if (imageInput) imageInput.addEventListener('input', updateBlogImagePreview);

  const clearBtn = $('#btnClearBlogImage');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    $('#blogImage').value = '';
    $('#blogImageFile').value = '';
    updateBlogImagePreview();
  });

  const fileInput = $('#blogImageFile');
  if (fileInput) fileInput.addEventListener('change', async function () {
    const file = this.files && this.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file', 'error');
      return;
    }
    try {
      showToast('Compressing image...', 'success');
      const result = await compressImage(file, 1200, 0.72, 320);
      $('#blogImage').value = result.dataUrl;
      updateBlogImagePreview();
      showToast('Cover image ready (' + result.sizeKB + 'KB). Click "Save Article" to apply.', 'success');
    } catch (err) {
      showToast('Failed to process image: ' + err.message, 'error');
    }
    this.value = '';
  });

  const saveBtn = $('#btnSavePost');
  if (saveBtn) saveBtn.addEventListener('click', savePost);

  const addBtn = $('#btnAddPost');
  if (addBtn) addBtn.addEventListener('click', openAddPostModal);

  const resetBtn = $('#btnPostReset');
  if (resetBtn) resetBtn.addEventListener('click', confirmResetPosts);

  const search = $('#blogSearchInput');
  if (search) search.addEventListener('input', renderBlogAdmin);

  const blogContent = $('#blogContent');
  if (blogContent) {
    blogContent.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); savePost(); }
    });
  }
});

/* ============================================
   Social Media Links Manager
   Add / edit / delete the social icons shown in
   the site footer and on the Contact page.
   ============================================ */
let socialEditList = [];

async function loadSocialManager() {
  const area = $('#socialAdminArea');
  if (!area || typeof Social === 'undefined') return;
  /* Paint right away (defaults / cached list), then refresh with the
     persisted list once IndexedDB has finished loading. */
  socialEditList = Social.getAll();
  populateSocialPlatforms();
  renderSocialAdmin();
  try { await Social.init(); } catch (e) { /* ignore */ }
  socialEditList = Social.getAll();
  renderSocialAdmin();
}

/* Fill the platform <select> in the add/edit modal */
function populateSocialPlatforms() {
  const sel = $('#socialPlatform');
  if (!sel || typeof Social === 'undefined') return;
  sel.innerHTML = Social.getPlatforms()
    .map(p => '<option value="' + escapeAttr(p.id) + '">' + escapeAttr(p.label) + '</option>')
    .join('');
}

function renderSocialAdmin() {
  const area = $('#socialAdminArea');
  if (!area) return;
  if (!socialEditList.length) {
    area.innerHTML = '<div class="admin-empty">No social links yet. Click "Add Social Link" to create one.</div>';
    return;
  }
  area.innerHTML = socialEditList.map(s => {
    const label = (typeof SOCIAL_PLATFORMS !== 'undefined' && SOCIAL_PLATFORMS[s.platform])
      ? SOCIAL_PLATFORMS[s.platform].label : s.platform;
    const icon = Social.getIcon(s.platform);
    const isEmpty = !s.url;
    return `<div class="social-admin-row${isEmpty ? ' is-empty' : ''}">
      <div class="social-admin-icon">${icon}</div>
      <div class="social-admin-main">
        <span class="social-admin-name">${escapeAttr(label)}</span>
        <input type="text" class="social-admin-url" data-id="${escapeAttr(s.id)}" value="${escapeAttr(s.url)}" placeholder="https://..." spellcheck="false">
      </div>
      <div class="social-admin-actions">
        <button class="action-btn save" onclick="saveSocialRow('${escapeAttr(s.id)}')" title="Save">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 6L9 17l-5-5"/></svg>
        </button>
        <button class="action-btn" onclick="openEditSocialModal('${escapeAttr(s.id)}')" title="Edit platform">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4v16h16v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="action-btn delete" onclick="confirmDeleteSocial('${escapeAttr(s.id)}')" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  // Enter inside a URL field saves that row
  area.querySelectorAll('.social-admin-url').forEach(inp => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); saveSocialRow(inp.dataset.id); }
    });
  });
}

/* Save a single row's URL (from the inline input) */
async function saveSocialRow(id) {
  const inp = document.querySelector('.social-admin-url[data-id="' + id + '"]');
  if (!inp) return;
  const row = socialEditList.find(s => s.id === id);
  if (!row) return;
  const updated = await Social.updateItem(id, { url: inp.value.trim() });
  if (updated) {
    showToast('Link saved', 'success');
    loadSocialManager();
  } else {
    showToast('Save failed! Please try again.', 'error');
  }
}

function openAddSocialModal() {
  $('#socialModalTitle').textContent = 'Add Social Link';
  $('#socialId').value = '';
  $('#socialPlatform').disabled = false;
  $('#socialPlatform').value = 'instagram';
  $('#socialUrl').value = '';
  updateSocialPreview();
  openModal('socialModal');
}

function openEditSocialModal(id) {
  const item = socialEditList.find(s => s.id === id);
  if (!item) return;
  $('#socialModalTitle').textContent = 'Edit Social Link';
  $('#socialId').value = item.id;
  $('#socialPlatform').value = item.platform;
  $('#socialUrl').value = item.url || '';
  updateSocialPreview();
  openModal('socialModal');
}

/* Live icon preview inside the modal */
function updateSocialPreview() {
  const box = $('#socialPreview');
  if (!box || typeof Social === 'undefined') return;
  const platform = $('#socialPlatform').value || 'instagram';
  const label = (typeof SOCIAL_PLATFORMS !== 'undefined' && SOCIAL_PLATFORMS[platform])
    ? SOCIAL_PLATFORMS[platform].label : platform;
  box.innerHTML = '<span class="social-preview-icon">' + Social.getIcon(platform) + '</span>'
    + '<span class="social-preview-label">' + escapeAttr(label) + '</span>';
}

async function saveSocial(id, platform, url) {
  const platformVal = platform || $('#socialPlatform').value;
  const urlVal = (typeof url === 'string' ? url : $('#socialUrl').value).trim();
  const editId = id !== undefined ? id : $('#socialId').value;
  let result = null;
  if (editId) {
    result = await Social.updateItem(editId, { platform: platformVal, url: urlVal });
  } else {
    result = await Social.addItem({ platform: platformVal, url: urlVal });
  }
  if (result) {
    showToast(editId ? 'Link updated' : 'Link added', 'success');
    closeModal('socialModal');
    loadSocialManager();
  } else {
    showToast('Save failed! Please try again.', 'error');
  }
}

/* Save handler bound to the modal's footer button */
function saveSocialFromModal() {
  saveSocial();
}

function confirmDeleteSocial(id) {
  const item = socialEditList.find(s => s.id === id);
  const label = item && typeof SOCIAL_PLATFORMS !== 'undefined' && SOCIAL_PLATFORMS[item.platform]
    ? SOCIAL_PLATFORMS[item.platform].label : 'this link';
  $('#confirmTitle').textContent = 'Delete Social Link';
  $('#confirmMessage').innerHTML = 'Remove the <strong>' + escapeAttr(label) + '</strong> icon from the website footer and Contact page?';
  confirmCallback = async () => {
    const res = await Social.deleteItem(id);
    closeModal('confirmModal');
    if (res) {
      showToast('Link deleted', 'success');
      loadSocialManager();
    } else {
      showToast('Delete failed! Please try again.', 'error');
    }
  };
  openModal('confirmModal');
}

function confirmResetSocial() {
  $('#confirmTitle').textContent = 'Restore Default Icons';
  $('#confirmMessage').innerHTML = 'Restore the built-in four icons (Instagram / Facebook / LinkedIn / YouTube) and clear all saved URLs?';
  confirmCallback = async () => {
    const res = await Social.resetToDefault();
    closeModal('confirmModal');
    if (res) {
      showToast('Default icons restored', 'success');
      loadSocialManager();
    } else {
      showToast('Restore failed! Please try again.', 'error');
    }
  };
  openModal('confirmModal');
}

/* Bind the social-link manager controls once (after DOM ready) */
document.addEventListener('DOMContentLoaded', () => {
  if (!$('#socialModal')) return;
  const addSocialBtn = $('#btnAddSocial');
  if (addSocialBtn) addSocialBtn.addEventListener('click', openAddSocialModal);

  const saveSocialBtn = $('#btnSaveSocial');
  if (saveSocialBtn) saveSocialBtn.addEventListener('click', () => saveSocial());

  const resetSocialBtn = $('#btnSocialReset');
  if (resetSocialBtn) resetSocialBtn.addEventListener('click', confirmResetSocial);
});

/* ============================================
   Customer Messages Manager
   Read / reply to / delete the messages that
   customers submit from the Contact page.

   New messages from the live website are also FORWARDED to the
   owner's email inbox (FormSubmit, configured below).
   ============================================ */
let msgFilter = 'all';
let msgSearch = '';
let currentMsgId = null;

/* ---------- Status text under the Forward To Email bar ---------- */
function setMsgSyncStatus(text, isWarning) {
  const el = $('#msgSyncStatus');
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('warn', !!isWarning);
}

/* ---------- Local message helpers ---------- */

/* All local messages, newest first */
function getMergedMessages() {
  return (typeof Messages !== 'undefined') ? Messages.getAll() : [];
}

function countUnreadMerged() {
  return (typeof Messages !== 'undefined') ? Messages.countUnread() : 0;
}

/* Find a message by id */
function findMessageAny(id) {
  return (typeof Messages !== 'undefined') ? Messages.getItem(id) : null;
}

async function loadMessagesManager() {
  const area = $('#msgAdminArea');
  if (!area || typeof Messages === 'undefined') return;
  try { await Messages.init(); } catch (e) { /* ignore */ }

  // Bind the Forward To Email input once
  const fwdInput = $('#msgFwdInput');
  if (fwdInput && !fwdInput.dataset.bound) {
    fwdInput.dataset.bound = '1';
    try { fwdInput.value = await Messages.getForwardEmail(); } catch (e) { /* ignore */ }
    const btn = $('#btnMsgFwdSave');
    if (btn) btn.addEventListener('click', saveMsgForwardEmail);
    const tbtn = $('#btnMsgFwdTest');
    if (tbtn) tbtn.addEventListener('click', testMsgForwarding);
    fwdInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveMsgForwardEmail(); } });
  }
  const fwd = fwdInput && fwdInput.value.trim();
  setMsgSyncStatus(fwd ? 'Forwarding to ' + fwd : 'Not set — messages stay in this browser only', !fwd);

  updateMsgTabBadge();
  renderMessagesAdmin();
}

/* Save the forwarding email typed by the admin */
async function saveMsgForwardEmail() {
  const fwdInput = $('#msgFwdInput');
  const email = fwdInput ? fwdInput.value.trim() : '';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  const ok = typeof Messages !== 'undefined' ? await Messages.setForwardEmail(email) : false;
  if (ok) {
    showToast(email
      ? 'Saved — new live-site messages will be forwarded to ' + email
      : 'Forwarding cleared', 'success');
    setMsgSyncStatus(email ? 'Forwarding to ' + email : 'Not set — messages stay in this browser only', !email);
  } else {
    showToast('Save failed! Please try again.', 'error');
  }
}

/* Send a test message through FormSubmit and report the exact result.
   Handles: not activated yet, file:// preview, network failure. */
async function testMsgForwarding() {
  const fwdInput = $('#msgFwdInput');
  const email = fwdInput ? fwdInput.value.trim() : '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Enter and Save a valid forwarding email first', 'error');
    return;
  }
  if (location.protocol === 'file:') {
    showToast('A file:// preview cannot send email. Open the site through http(s) — e.g. the local server link — and test again.', 'error');
    setMsgSyncStatus('Not sent — file:// preview is not supported', true);
    return;
  }
  setMsgSyncStatus('Sending test…', false);
  try {
    const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(email), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: 'MYHBeauty Test',
        email: email,
        message: 'This is a test message sent from your website admin panel. If you received it, message forwarding works.',
        _subject: 'MYHBeauty — forwarding test',
        _template: 'table',
        _captcha: 'false'
      })
    });
    const data = await res.json().catch(() => null);
    const msg = (data && data.message) ? String(data.message) : '';
    if (data && String(data.success) === 'true') {
      showToast('Test sent — check the inbox (and spam) of ' + email, 'success');
      setMsgSyncStatus('Forwarding to ' + email, false);
    } else if (/activat/i.test(msg)) {
      showToast('Activation email sent to ' + email + ' — open it, click "Activate", then press Send Test again.', 'error');
      setMsgSyncStatus('Waiting for activation — check ' + email, true);
    } else {
      showToast('Test failed: ' + (msg || ('HTTP ' + res.status)), 'error');
      setMsgSyncStatus('Test failed — ' + (msg || ('HTTP ' + res.status)), true);
    }
  } catch (e) {
    showToast('Cannot reach the email service — check your internet connection', 'error');
    setMsgSyncStatus('Not reachable — check your connection', true);
  }
}

/* Show the unread count on the "Messages" tab button */
function updateMsgTabBadge() {
  const badge = $('#msgTabBadge');
  if (!badge || typeof Messages === 'undefined') return;
  const n = countUnreadMerged();
  badge.hidden = n === 0;
  badge.textContent = n > 99 ? '99+' : String(n);
}

function renderMessagesAdmin() {
  const area = $('#msgAdminArea');
  if (!area || typeof Messages === 'undefined') return;

  // Bind the search box and filter buttons once
  const searchInput = $('#msgSearchInput');
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = '1';
    searchInput.addEventListener('input', () => {
      msgSearch = searchInput.value.trim().toLowerCase();
      renderMessagesAdmin();
    });
  }
  document.querySelectorAll('#msgFilters .msg-filter').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === msgFilter);
    if (!b.dataset.bound) {
      b.dataset.bound = '1';
      b.addEventListener('click', () => {
        msgFilter = b.dataset.filter;
        renderMessagesAdmin();
      });
    }
  });

  let list = getMergedMessages();
  if (msgFilter !== 'all') list = list.filter(m => m.status === msgFilter);
  if (msgSearch) {
    list = list.filter(m => (
      m.firstName + ' ' + m.lastName + ' ' + m.email + ' ' + m.phone + ' ' +
      m.company + ' ' + m.message + ' ' + msgSubjectLabel(m.subject)
    ).toLowerCase().includes(msgSearch));
  }

  if (!list.length) {
    const filtered = msgFilter !== 'all' || msgSearch;
    area.innerHTML = '<div class="admin-empty">' + (filtered
      ? 'No messages match the current filter.'
      : 'No customer messages yet. Messages submitted from the Contact page will appear here.') + '</div>';
    return;
  }

  area.innerHTML = list.map(m => {
    const name = ((m.firstName + ' ' + m.lastName).trim()) || m.email || 'Unknown';
    const initial = escapeAttr(name.charAt(0).toUpperCase());
    const unread = m.status === 'new';
    const chip = m.status === 'replied'
      ? '<span class="msg-status-chip replied">Replied</span>'
      : m.status === 'read'
        ? '<span class="msg-status-chip read">Read</span>'
        : '<span class="msg-status-chip new">New</span>';
    const snippet = m.message.length > 110 ? m.message.slice(0, 110) + '…' : m.message;
    return `<div class="msg-admin-row${unread ? ' is-unread' : ''}" onclick="openMsgModal('${escapeAttr(m.id)}')">
      <div class="msg-avatar">${initial}</div>
      <div class="msg-main">
        <div class="msg-row-top">
          <span class="msg-name">${escapeAttr(name)}</span>
          <span class="msg-subject">${escapeAttr(msgSubjectLabel(m.subject))}</span>
          ${chip}
        </div>
        <div class="msg-snippet">${escapeAttr(snippet)}</div>
        <div class="msg-row-bottom">
          <span class="msg-email">${escapeAttr(m.email)}</span>
          <span class="msg-date">${escapeAttr(fmtMsgDate(m.submittedAt))}</span>
        </div>
      </div>
      <div class="msg-row-actions" onclick="event.stopPropagation();">
        <button class="action-btn" onclick="openMsgModal('${escapeAttr(m.id)}')" title="Open">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="action-btn delete" onclick="confirmDeleteMsg('${escapeAttr(m.id)}')" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');
}

/* Format an ISO timestamp as a readable local date */
function fmtMsgDate(iso) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso || '';
    return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return iso || '';
  }
}

/* Open the detail modal for one message (marks it as read) */
function openMsgModal(id) {
  if (typeof Messages === 'undefined') return;
  const m = findMessageAny(id);
  if (!m) return;
  currentMsgId = id;

  if (m.status === 'new') {
    markMessageRead(m);
  }

  const name = ((m.firstName + ' ' + m.lastName).trim()) || m.email || 'Unknown';
  $('#msgModalTitle').textContent = 'Message from ' + name;

  const rows = [
    ['Name', escapeAttr(name)],
    ['Email', '<a href="mailto:' + escapeAttr(m.email) + '">' + escapeAttr(m.email) + '</a>'],
    m.phone ? ['Phone', escapeAttr(m.phone)] : null,
    m.company ? ['Company', escapeAttr(m.company)] : null,
    ['Subject', escapeAttr(msgSubjectLabel(m.subject))],
    ['Received', escapeAttr(fmtMsgDate(m.submittedAt))]
  ].filter(Boolean);
  $('#msgDetail').innerHTML =
    '<div class="msg-detail-grid">' +
    rows.map(r => '<div class="msg-detail-row"><span class="msg-detail-label">' + r[0] + '</span><span class="msg-detail-value">' + r[1] + '</span></div>').join('') +
    '</div>' +
    '<div class="msg-detail-body">' + escapeHtml(m.message).replace(/\n/g, '<br>') + '</div>';

  renderMsgReplies(m);
  $('#msgReplyText').value = '';
  openModal('msgModal');
}

/* Mark a message as read */
function markMessageRead(m) {
  Messages.setStatus(m.id, 'read').then(() => {
    updateMsgTabBadge();
    renderMessagesAdmin();
  });
}

/* Render the saved replies inside the modal */
function renderMsgReplies(m) {
  const box = $('#msgReplies');
  if (!box) return;
  if (!m.replies || !m.replies.length) {
    box.innerHTML = '<div class="msg-no-replies">No replies yet.</div>';
    return;
  }
  box.innerHTML = m.replies.map(r =>
    '<div class="msg-reply-item"><div class="msg-reply-meta">' + escapeAttr(fmtMsgDate(r.at)) + '</div><div class="msg-reply-text">' + escapeHtml(r.text).replace(/\n/g, '<br>') + '</div></div>'
  ).join('');
}

/* Build a mailto: link and open the visitor's email client */
function openMsgInEmail(replyText) {
  if (typeof Messages === 'undefined' || !currentMsgId) return;
  const m = findMessageAny(currentMsgId);
  if (!m) return;
  const subject = 'Re: ' + msgSubjectLabel(m.subject) + ' - MYHBeauty';
  const body = (typeof replyText === 'string' && replyText.trim())
    ? replyText
    : ($('#msgReplyText') ? $('#msgReplyText').value.trim() : '');
  const quoted = m.message.split('\n').map(l => '> ' + l).join('\n');
  const full = (body ? body + '\n\n' : '') + '---------- Original message ----------\n'
    + 'From: ' + ((m.firstName + ' ' + m.lastName).trim() || m.email) + '\n'
    + 'Date: ' + fmtMsgDate(m.submittedAt) + '\n\n' + quoted;
  window.location.href = 'mailto:' + m.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(full);
}

/* Save the written reply, mark as replied, then open the email client */
async function sendMsgReply() {
  if (!currentMsgId) return;
  const m = findMessageAny(currentMsgId);
  if (!m) return;
  const text = $('#msgReplyText') ? $('#msgReplyText').value.trim() : '';
  if (!text) {
    showToast('Please write a reply first', 'error');
    return;
  }
  const res = await Messages.addReply(m.id, text);
  const ok = !!res;
  if (ok) {
    showToast('Reply saved — opening your email client', 'success');
    closeModal('msgModal');
    openMsgInEmail(text);
    updateMsgTabBadge();
    renderMessagesAdmin();
  } else {
    showToast('Save failed! Please try again.', 'error');
  }
}

/* Delete the message currently open in the modal */
function confirmDeleteCurrentMsg() {
  if (currentMsgId) confirmDeleteMsg(currentMsgId);
}

function confirmDeleteMsg(id) {
  const m = findMessageAny(id);
  const name = m ? ((m.firstName + ' ' + m.lastName).trim() || m.email) : 'this message';
  $('#confirmTitle').textContent = 'Delete Message';
  $('#confirmMessage').innerHTML = 'Permanently delete the message from <strong>' + escapeAttr(name) + '</strong>? This cannot be undone.';
  confirmCallback = async () => {
    const res = typeof Messages !== 'undefined' ? await Messages.deleteItem(id) : false;
    closeModal('confirmModal');
    closeModal('msgModal');
    if (res) {
      showToast('Message deleted', 'success');
      if (currentMsgId === id) currentMsgId = null;
      updateMsgTabBadge();
      renderMessagesAdmin();
    } else {
      showToast('Delete failed! Please try again.', 'error');
    }
  };
  openModal('confirmModal');
}

function confirmClearMessages() {
  $('#confirmTitle').textContent = 'Clear All Messages';
  $('#confirmMessage').innerHTML = 'Permanently delete <strong>ALL</strong> customer messages? This cannot be undone.';
  confirmCallback = async () => {
    const res = typeof Messages !== 'undefined' ? await Messages.clearAll() : false;
    closeModal('confirmModal');
    if (res) {
      showToast('All messages cleared', 'success');
      currentMsgId = null;
      updateMsgTabBadge();
      renderMessagesAdmin();
    } else {
      showToast('Clear failed! Please try again.', 'error');
    }
  };
  openModal('confirmModal');
}

/* ==========================================================
   GitHub Sync
   ----------------------------------------------------------
   "Sync to GitHub" writes everything stored in this admin —
   products, page content, banners, category icons, blog posts,
   social links and every image uploaded here (images are embedded
   in data.js) — into the repository as a commit, using GitHub's
   REST API directly from the browser.
   ========================================================== */

function openGithubModal() {
  if (typeof GHSync === 'undefined') {
    showToast('GitHub sync module failed to load', 'error');
    return;
  }
  const cfg = GHSync.loadConfig();
  $('#ghOwner').value = cfg.owner;
  $('#ghRepo').value = cfg.repo;
  $('#ghBranch').value = cfg.branch;
  $('#ghPath').value = cfg.path;
  $('#ghToken').value = cfg.token || '';
  $('#ghAlsoImages').checked = !!cfg.alsoImages;
  $('#ghFileBased').checked = !!cfg.fileBased;

  const last = GHSync.loadLast();
  if (last && last.url) {
    setGithubStatus('Last sync: ' + escapeAttr(last.time || '') + ' — '
      + '<a href="' + escapeAttr(last.url) + '" target="_blank" rel="noopener">view commit</a>'
      + ' (' + escapeAttr((last.files || 1) + ' file' + (last.files > 1 ? 's' : '')) + ', '
      + Math.round((last.bytes || 0) / 1024) + ' KB)', 'ok');
  } else {
    setGithubStatus('Nothing pushed yet from this browser.', '');
  }
  openModal('githubModal');
}

function setGithubStatus(html, kind) {
  const box = $('#githubStatus');
  if (!box) return;
  if (!html) { box.hidden = true; box.innerHTML = ''; box.className = 'github-status'; return; }
  box.hidden = false;
  box.innerHTML = html;
  box.className = 'github-status' + (kind === 'ok' ? ' is-ok' : (kind === 'err' ? ' is-err' : ''));
}

/* Read + lightly validate the form; returns null when invalid. */
function readGithubForm() {
  const cfg = {
    owner: $('#ghOwner').value.trim(),
    repo: $('#ghRepo').value.trim(),
    branch: $('#ghBranch').value.trim() || 'main',
    path: ($('#ghPath').value.trim() || 'data.js').replace(/^\/+/, '').replace(/\\/g, '/'),
    token: $('#ghToken').value.trim(),
    alsoImages: $('#ghAlsoImages').checked,
    fileBased: $('#ghFileBased').checked
  };
  if (!cfg.owner) { showToast('Please enter the repository owner', 'error'); $('#ghOwner').focus(); return null; }
  if (!cfg.repo) { showToast('Please enter the repository name', 'error'); $('#ghRepo').focus(); return null; }
  if (!cfg.token) { showToast('Please paste your GitHub access token', 'error'); $('#ghToken').focus(); return null; }
  return cfg;
}

async function testGithubConnection() {
  const cfg = readGithubForm();
  if (!cfg) return;
  setGithubStatus('Checking access to ' + escapeAttr(cfg.owner + '/' + cfg.repo) + '…', '');
  try {
    const repo = await GHSync.testConnection(cfg);
    GHSync.saveConfig(Object.assign({}, cfg));
    let html = 'Connected to <code>' + escapeAttr(repo.fullName) + '</code>'
      + (repo.private ? ' (private)' : ' (public)')
      + ', default branch <code>' + escapeAttr(repo.defaultBranch) + '</code>. ';

    // Inspect the token itself: scopes + type, so we can warn before pushing.
    let tokenNote = '';
    try {
      const t = await GHSync.inspectToken(cfg);
      if (t.error) {
        tokenNote = 'But the token is invalid: ' + escapeAttr(t.error);
      } else if (t.type === 'fine-grained') {
        tokenNote = 'Token is <strong>fine-grained</strong> (login <code>' + escapeAttr(t.login || '')
          + '</code>). Confirm its settings grant <strong>"Contents: Read and write"</strong> for '
          + '<code>' + escapeAttr(cfg.owner + '/' + cfg.repo) + '</code>'
          + (t.sso ? ' and that SSO is authorized for the org' : '') + '.';
      } else {
        const hasRepo = t.scopes.includes('repo');
        const hasPublic = t.scopes.includes('public_repo');
        if (!hasRepo && !hasPublic) {
          tokenNote = 'But this classic token only has scopes ['
            + escapeAttr(t.scopes.join(', ') || 'none') + '] — it is missing the <strong>repo</strong> '
            + 'scope needed to write. Regenerate the token with <strong>repo</strong> ticked.';
        } else if (repo.private && !hasRepo) {
          tokenNote = 'This classic token only has <strong>public_repo</strong>, but the repo is private — '
            + 'you also need the full <strong>repo</strong> scope.';
        } else {
          tokenNote = 'Classic token (login <code>' + escapeAttr(t.login || '') + '</code>) has write '
            + 'scope [' + escapeAttr(t.scopes.join(', ')) + '].';
        }
      }
    } catch (te) {
      tokenNote = 'Could not inspect token: ' + escapeAttr(te.message);
    }

    if (!repo.hasPush) {
      html += 'However, this token has <strong>no push permission</strong> on the repo. ' + tokenNote;
      setGithubStatus(html, 'err');
    } else {
      html += (repo.private ? 'You have push access. ' : 'Public repo, push access confirmed. ') + tokenNote;
      setGithubStatus(html, 'ok');
      showToast('GitHub connection OK', 'success');
    }
  } catch (e) {
    setGithubStatus(escapeAttr(e.message), 'err');
    showToast('Connection failed: ' + e.message, 'error');
  }
}

async function pushToGithub() {
  const cfg = readGithubForm();
  if (!cfg) return;
  const pushBtn = $('#btnGithubPush');
  const testBtn = $('#btnGithubTest');
  const label = pushBtn.textContent;
  pushBtn.disabled = true;
  if (testBtn) testBtn.disabled = true;
  pushBtn.textContent = 'Pushing…';
  setGithubStatus('Collecting everything stored in this admin…', '');
  try {
    GHSync.saveConfig(Object.assign({}, cfg));
    const bundle = await buildPublishBundle();
    setGithubStatus('Uploading <code>' + escapeAttr(cfg.path) + '</code> and any images to GitHub…', '');
    const res = await GHSync.push(cfg, bundle, {});
    let msg = 'Committed ' + res.files.length + ' file' + (res.files.length > 1 ? 's' : '')
      + ' to <code>' + escapeAttr(cfg.owner + '/' + cfg.repo) + '</code> on branch <code>'
      + escapeAttr(cfg.branch) + '</code> (' + Math.round((res.dataBytes + (res.imageBytes || 0)) / 1024) + ' KB)';
    const head = res.files[0];
    if (head && head.url) {
      msg += ' — <a href="' + escapeAttr(head.url) + '" target="_blank" rel="noopener">view on GitHub</a>';
    }
    if (res.imageCount && res.imageCount > 0) {
      msg += '<br>' + res.imageCount + ' image file(s) written to <code>images/uploads/</code>.';
    }
    (res.warnings || []).forEach(function (w) { msg += '<br>' + escapeAttr(w); });
    setGithubStatus(msg, 'ok');
    showToast('Pushed to GitHub — ' + res.files.length + ' file(s) committed', 'success');
  } catch (e) {
    setGithubStatus(escapeAttr(e.message), 'err');
    showToast('GitHub push failed: ' + e.message, 'error');
  } finally {
    pushBtn.disabled = false;
    if (testBtn) testBtn.disabled = false;
    pushBtn.textContent = label;
  }
}

/* Publish content as separate repository files instead of one big data.js
   blob: images under images/, products/posts under content/*.json, and a
   slim data.js index carrying the fileBased flag so the live site loads
   them on demand. */
async function pushAsFilesToGithub() {
  const cfg = readGithubForm();
  if (!cfg) return;
  const pushBtn = $('#btnGithubPushFiles');
  const label = pushBtn.textContent;
  pushBtn.disabled = true;
  setGithubStatus('Building the file set (images + content JSON + index)…', '');
  try {
    GHSync.saveConfig(Object.assign({}, cfg));
    const bundle = await buildPublishBundle();
    const files = GHSync.buildFileSet(bundle, {});
    const res = await GHSync.pushFileSet(cfg, files, {
      onProgress: function (f, i, total) {
        setGithubStatus('Committing ' + (i + 1) + ' / ' + total + ' — <code>'
          + escapeAttr(f.path) + '</code>', '');
      }
    });
    let msg = 'Committed ' + res.files.length + ' file' + (res.files.length > 1 ? 's' : '')
      + ' to <code>' + escapeAttr(cfg.owner + '/' + cfg.repo) + '</code> on <code>'
      + escapeAttr(cfg.branch) + '</code> (' + Math.round((res.dataBytes + (res.imageBytes || 0)) / 1024) + ' KB)';
    if (res.imageBytes) msg += '<br>' + Math.round(res.imageBytes / 1024) + ' KB of images written to <code>images/</code>.';
    const head = res.files[res.files.length - 1];
    if (head && head.url) {
      msg += ' — <a href="' + escapeAttr(head.url) + '" target="_blank" rel="noopener">view on GitHub</a>';
    }
    (res.warnings || []).forEach(function (w) { msg += '<br>' + escapeAttr(w); });
    setGithubStatus(msg, 'ok');
    showToast('Pushed as files — ' + res.files.length + ' file(s) committed', 'success');
  } catch (e) {
    setGithubStatus(escapeAttr(e.message), 'err');
    showToast('GitHub file push failed: ' + e.message, 'error');
  } finally {
    pushBtn.disabled = false;
    pushBtn.textContent = label;
  }
}

/* Same as pushToGithub(), plus every static file of the site itself
   (HTML / CSS / JS), so the repository mirrors the live website. */
async function pushWholeSiteToGithub() {
  const cfg = readGithubForm();
  if (!cfg) return;
  const pushBtn = $('#btnGithubPushSite');
  const pushPrimary = $('#btnGithubPush');
  const testBtn = $('#btnGithubTest');
  const label = pushBtn.textContent;
  [pushBtn, pushPrimary, testBtn].forEach(function (b) { if (b) b.disabled = true; });
  pushBtn.textContent = 'Pushing…';
  setGithubStatus('Reading the site files and pushing them one by one…', '');
  try {
    GHSync.saveConfig(Object.assign({}, cfg));
    const bundle = await buildPublishBundle();
    const res = await GHSync.pushSite(cfg, bundle, null, {});
    let msg = 'Committed ' + res.files.length + ' file' + (res.files.length > 1 ? 's' : '')
      + ' to <code>' + escapeAttr(cfg.owner + '/' + cfg.repo) + '</code> on <code>'
      + escapeAttr(cfg.branch) + '</code> — the whole site plus the latest <code>'
      + escapeAttr(cfg.path) + '</code>.';
    if (res.imageCount) msg += '<br>' + res.imageCount + ' image file(s) written to <code>images/uploads/</code>.';
    (res.warnings || []).forEach(function (w) { msg += '<br>' + escapeAttr(w); });
    setGithubStatus(msg, 'ok');
    showToast('Whole site pushed — ' + res.files.length + ' files committed', 'success');
  } catch (e) {
    setGithubStatus(escapeAttr(e.message), 'err');
    showToast('Push failed: ' + e.message, 'error');
  } finally {
    [pushBtn, pushPrimary, testBtn].forEach(function (b) { if (b) b.disabled = false; });
    pushBtn.textContent = label;
  }
}
