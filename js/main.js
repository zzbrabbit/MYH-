/* ============================================
   MYHBeauty — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Apply CMS Content Overrides ---------- */
  if (typeof Content !== 'undefined') {
    Content.apply();
  }

  /* ---------- Page Loader ---------- */
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hide'), 400);
    });
    // Fallback hide
    setTimeout(() => loader.classList.add('hide'), 2000);
  }

  /* ---------- Sticky Nav ---------- */
  const nav = document.querySelector('.nav');
  const scrollTopBtn = document.querySelector('.scroll-top');

  const handleScroll = () => {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', y > 60);
    }
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('show', y > 500);
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---------- Mobile Nav Toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Active Nav Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Scroll Reveal Animations ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- Scroll to Top ---------- */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Dynamic Product Rendering ---------- */

  // Current filter / sort / search state (products page)
  let activeFilter = 'all';
  let activeSort = 'featured';
  let searchQuery = '';

  // Generate star rating HTML
  function renderStars(rating, reviewCount) {
    if (!rating) return '';
    const full = Math.floor(rating);
    const half = (rating - full) >= 0.5;
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) stars += '<svg viewBox="0 0 24 24" fill="currentColor" class="star-full"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>';
      else if (i === full && half) stars += '<svg viewBox="0 0 24 24" class="star-half"><defs><linearGradient id="half' + i + '"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="url(#half' + i + ')" stroke="currentColor" stroke-width="1"/></svg>';
      else stars += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="star-empty"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>';
    }
    const countHtml = reviewCount ? `<span class="rating-count">(${reviewCount})</span>` : '';
    return `<div class="product-rating">${stars}<span class="rating-num">${rating.toFixed(1)}</span>${countHtml}</div>`;
  }

  // Strip HTML tags to a plain-text preview (for compact product cards)
  function stripHtml(html) {
    if (!html) return '';
    if (html.indexOf('<') === -1) return html; // plain text already
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || '').trim();
  }

  // Render products into a grid container from Store data
  function renderProducts(gridEl, products, showTag) {
    if (!gridEl) return;

    if (!products || products.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20 7l-8-4-8 4M20 7v10l-8 4-8-4V7M20 7l-8 4M4 7l8 4m0 0v10"/></svg>
          <h3>No Products Found</h3>
          <p>Try a different category or search keyword.</p>
        </div>`;
      return;
    }

    gridEl.innerHTML = products.map((p, i) => {
      const iconSvg = (typeof ICON_LIBRARY !== 'undefined' && ICON_LIBRARY[p.icon]) ? ICON_LIBRARY[p.icon] : '';
      const delayClass = `reveal-delay-${(i % 4) + 1}`;
      const catLabel = (typeof CATEGORY_LIBRARY !== 'undefined' && CATEGORY_LIBRARY[p.category]) ? CATEGORY_LIBRARY[p.category].label : p.category;
      const tagHtml = (showTag && p.tag) ? `<span class="product-tag">${p.tag}</span>` : '';
      const brandHtml = p.brand ? `<span class="product-brand">${p.brand}</span>` : '';
      const ratingHtml = renderStars(p.rating, p.reviewCount);
      const priceHtml = p.price
        ? `<div class="product-price-row"><span class="product-price">$${p.price}</span>${p.comparePrice ? `<span class="product-price-old">$${p.comparePrice}</span>` : ''}</div>`
        : '';
      const hasImage = p.image && p.image.trim();
      const imgHtml = hasImage
        ? `<img src="${p.image}" alt="${p.name}" class="product-thumb-img" onerror="this.style.display='none'; this.parentElement.querySelector('.product-img-bg').style.opacity='1'; this.parentElement.querySelector('.product-icon').style.opacity='1';">`
        : '';
      const bgOpacity = hasImage ? '0' : '1';
      const iconOpacity = hasImage ? '0' : '1';
      return `
        <div class="product-card reveal ${delayClass}" data-category="${p.category}" data-product-id="${p.id}" style="cursor:pointer;">
          <div class="product-img">
            <div class="product-img-bg" style="background: ${p.gradient}; opacity: ${bgOpacity};"></div>
            <span class="product-cat-badge">${catLabel}</span>
            ${tagHtml}
            <div class="product-icon" style="opacity:${iconOpacity};">${iconSvg}</div>
            ${imgHtml}
            <div class="product-img-hover"><span class="product-view">View Details</span></div>
          </div>
          <div class="product-body">
            ${brandHtml}
            <h3>${p.name}</h3>
            ${ratingHtml}
            <p>${stripHtml(p.description)}</p>
            <div class="product-footer">
              ${priceHtml}
              <span class="product-link">View Details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
            </div>
          </div>
        </div>`;
    }).join('');

    // Trigger reveal animation on new cards
    gridEl.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // Update sidebar category counts
  function updateCategoryCounts() {
    if (typeof Store === 'undefined' || typeof CATEGORY_LIBRARY === 'undefined') return;
    const all = Store.getProducts();
    const counts = { all: all.length };
    Object.keys(CATEGORY_LIBRARY).forEach(k => { counts[k] = 0; });
    all.forEach(p => { if (counts[p.category] !== undefined) counts[p.category]++; });

    document.querySelectorAll('.sidebar-cat').forEach(btn => {
      const f = btn.dataset.filter;
      const countEl = btn.querySelector('.cat-count');
      if (countEl && counts[f] !== undefined) countEl.textContent = counts[f];
    });
  }

  // Apply combined filters (category + search + sort) on products page
  function applyProductFilters() {
    if (typeof Store === 'undefined') return;
    let list = Store.getProducts();

    if (activeFilter !== 'all') {
      list = list.filter(p => p.category === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (CATEGORY_LIBRARY[p.category] && CATEGORY_LIBRARY[p.category].label.toLowerCase().includes(q))
      );
    }

    if (activeSort === 'newest') {
      list = list.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (activeSort === 'name') {
      list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = list.slice().sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    const grid = document.querySelector('#productGrid');
    renderProducts(grid, list, true);

    const countEl = document.querySelector('#toolbarCount');
    if (countEl) {
      const total = Store.getProducts().length;
      if (list.length === total && activeFilter === 'all' && !searchQuery) {
        countEl.textContent = `Showing all ${total} products`;
      } else {
        countEl.textContent = `Showing ${list.length} of ${total} products`;
      }
    }
  }

  // Products page: render full catalog + sidebar counts
  const productGrid = document.querySelector('#productGrid');
  if (productGrid && typeof Store !== 'undefined') {
    updateCategoryCounts();
    // Read ?cat= URL parameter to auto-filter products
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam && catParam !== 'all') {
      const validCat = document.querySelector('.sidebar-cat[data-filter="' + catParam + '"]');
      if (validCat) {
        activeFilter = catParam;
        document.querySelectorAll('.sidebar-cat').forEach(b => b.classList.remove('active'));
        validCat.classList.add('active');
        // Scroll sidebar to the active category for visibility
        validCat.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
    // Read ?search= URL parameter to pre-fill search
    const searchParam = urlParams.get('search');
    if (searchParam) {
      searchQuery = searchParam.trim();
      const searchInputEl = document.querySelector('#productSearch');
      if (searchInputEl) searchInputEl.value = searchQuery;
    }
    applyProductFilters();
  }

  // Homepage: render featured products
  const featuredGrid = document.querySelector('#featuredProducts');
  if (featuredGrid && typeof Store !== 'undefined') {
    let featured = Store.getFeaturedProducts();
    if (featured.length === 0) {
      featured = Store.getProducts().slice(0, 3);
    }
    renderProducts(featuredGrid, featured.slice(0, 3), true);
  }

  /* ---------- Sidebar Filter + Search + Sort ---------- */
  const sidebarCats = document.querySelectorAll('.sidebar-cat');
  if (sidebarCats.length) {
    sidebarCats.forEach(btn => {
      btn.addEventListener('click', () => {
        sidebarCats.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        applyProductFilters();
      });
    });
  }

  const productSearchInput = document.querySelector('#productSearch');
  if (productSearchInput) {
    productSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      applyProductFilters();
    });
  }

  const sortSelectEl = document.querySelector('#sortSelect');
  if (sortSelectEl) {
    sortSelectEl.addEventListener('change', (e) => {
      activeSort = e.target.value;
      applyProductFilters();
    });
  }

  // Legacy top-bar filter buttons (if any remain on a page)
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const productCards = document.querySelectorAll('.product-card[data-category]');
        productCards.forEach(card => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            card.style.animation = 'fadeInUp .5s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Product Detail Modal ---------- */

  // Create detail modal DOM (once)
  let detailModal = null;
  function ensureDetailModal() {
    if (detailModal) return detailModal;
    detailModal = document.createElement('div');
    detailModal.className = 'detail-overlay';
    detailModal.innerHTML = `
      <div class="detail-modal">
        <button class="detail-close" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div class="detail-content" id="detailContent"><!-- rendered by JS --></div>
      </div>`;
    document.body.appendChild(detailModal);

    // Close handlers
    detailModal.querySelector('.detail-close').addEventListener('click', closeDetailModal);
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeDetailModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && detailModal.classList.contains('open')) {
        closeDetailModal();
      }
    });
    return detailModal;
  }

  function closeDetailModal() {
    if (!detailModal) return;
    detailModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openProductDetail(productId) {
    if (typeof Store === 'undefined') return;
    const product = Store.getProduct(productId);
    if (!product) return;

    ensureDetailModal();
    const content = detailModal.querySelector('#detailContent');

    const iconSvg = (typeof ICON_LIBRARY !== 'undefined' && ICON_LIBRARY[product.icon]) ? ICON_LIBRARY[product.icon] : '';
    const hasImage = product.image && product.image.trim();
    const validGallery = Array.isArray(product.gallery) ? product.gallery.filter(g => g && g.trim()) : [];
    const validSpecs = Array.isArray(product.specs) ? product.specs.filter(s => s.label && s.value) : [];
    const hasSpecs = validSpecs.length > 0;
    const catLabel = (typeof CATEGORY_LIBRARY !== 'undefined' && CATEGORY_LIBRARY[product.category]) ? CATEGORY_LIBRARY[product.category].label : product.category;

    // Build main image
    const mainImageHtml = hasImage
      ? `<div class="detail-main-image"><img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <div class="detail-image-fallback" style="display:none; background:${product.gradient};"><div class="detail-fallback-icon">${iconSvg}</div></div></div>`
      : `<div class="detail-main-image detail-image-placeholder" style="background:${product.gradient};"><div class="detail-fallback-icon">${iconSvg}</div></div>`;

    // Build gallery thumbnails — include main image as first thumb
    const allImages = [];
    if (hasImage) allImages.push(product.image);
    validGallery.forEach(g => allImages.push(g));

    const galleryHtml = allImages.length > 1
      ? `<div class="detail-gallery"><div class="gallery-thumbs">${
          allImages.map((url, i) =>
            `<div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-full="${url}"><img src="${url}" alt="View ${i+1}" onerror="this.parentElement.style.display='none';"></div>`
          ).join('')
        }</div></div>`
      : '';

    // Key features — extract from specs (first 3) as highlighted bullets
    const featureItems = validSpecs.slice(0, 3).map(s =>
      `<li><span class="feat-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg></span><span><strong>${s.value}</strong> &middot; ${s.label}</span></li>`
    ).join('');
    const featuresHtml = featureItems
      ? `<div class="detail-features"><h4>Key Features</h4><ul>${featureItems}</ul></div>`
      : '';

    // Build specs table
    const specsHtml = hasSpecs
      ? `<div class="detail-specs"><h4>Specifications</h4><table class="specs-table"><tbody>${
          validSpecs.map(s => `<tr><th>${s.label}</th><td>${s.value}</td></tr>`).join('')
        }</tbody></table></div>`
      : '';

    // Brand, rating, price
    const brandHtml = product.brand ? `<span class="detail-brand">${product.brand}</span>` : '';
    const ratingHtml = renderStars(product.rating, product.reviewCount);
    const priceHtml = product.price
      ? `<div class="detail-price"><span class="detail-price-label">Starting from</span><span class="detail-price-now">$${product.price}</span>${product.comparePrice ? `<span class="detail-price-old">$${product.comparePrice}</span>` : ''}</div>`
      : '';

    // Related products
    const related = (typeof Store !== 'undefined') ? Store.getRelatedProducts(product.id, 4) : [];
    const relatedHtml = related.length
      ? `<div class="detail-related"><h4>You May Also Like</h4><div class="related-grid">${
          related.map(rp => {
            const rpIcon = (typeof ICON_LIBRARY !== 'undefined' && ICON_LIBRARY[rp.icon]) ? ICON_LIBRARY[rp.icon] : '';
            const rpHasImg = rp.image && rp.image.trim();
            return `<div class="related-card" data-product-id="${rp.id}" style="cursor:pointer;"><div class="related-img" style="background:${rp.gradient};">${rpIcon}${rpHasImg ? `<img src="${rp.image}" alt="${rp.name}" onerror="this.style.display='none';">` : ''}</div><div class="related-body"><h5>${rp.name}</h5>${rp.price ? `<span class="related-price">$${rp.price}</span>` : ''}</div></div>`;
          }).join('')
        }</div></div>`
      : '';

    content.innerHTML = `
      <div class="detail-breadcrumb"><a href="index.html">Home</a> <span class="sep">/</span> <a href="products.html">Products</a> <span class="sep">/</span> <span>${catLabel}</span></div>
      <div class="detail-grid">
        <div class="detail-image-section">
          ${mainImageHtml}
          ${galleryHtml}
        </div>
        <div class="detail-info-section">
          <div class="detail-meta">
            ${brandHtml}
            ${product.tag ? `<span class="detail-tag">${product.tag}</span>` : ''}
            <span class="detail-category">${catLabel}</span>
          </div>
          <h2 class="detail-title">${product.name}</h2>
          ${ratingHtml}
          <div class="detail-desc">${product.description}</div>
          ${priceHtml}
          ${featuresHtml}
          ${specsHtml}
          <div class="detail-actions">
            <a href="contact.html" class="btn btn-primary btn-arrow">Inquire Now</a>
            <a href="products.html" class="btn btn-outline">Back to Products</a>
          </div>
        </div>
      </div>
      ${relatedHtml}`;

    // Gallery thumbnail click — swap main image
    if (allImages.length > 1) {
      content.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const fullUrl = thumb.dataset.full;
          const mainImg = content.querySelector('.detail-main-image img');
          if (mainImg && fullUrl) {
            mainImg.src = fullUrl;
            content.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
          }
        });
      });
    }

    detailModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Bind click on product cards (event delegation)
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card[data-product-id], .related-card[data-product-id]');
    if (card) {
      e.preventDefault();
      openProductDetail(card.dataset.productId);
    }
  });

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    const successMsg = document.querySelector('.form-success');

    const validateField = (field) => {
      const group = field.closest('.form-group');
      const errorEl = group.querySelector('.form-error');
      let valid = true;

      if (field.type === 'email') {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valid = emailRe.test(field.value.trim());
        if (errorEl) errorEl.textContent = 'Please enter a valid email address';
      } else if (field.value.trim() === '') {
        valid = false;
        if (errorEl) errorEl.textContent = 'This field is required';
      }

      group.classList.toggle('error', !valid);
      return valid;
    };

    // Real-time validation
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group.classList.contains('error')) validateField(field);
      });
      field.addEventListener('change', () => {
        const group = field.closest('.form-group');
        if (group.classList.contains('error')) validateField(field);
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
      let allValid = true;

      fields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (allValid) {
        // Simulate submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          if (successMsg) {
            successMsg.classList.add('show');
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;

          setTimeout(() => {
            if (successMsg) successMsg.classList.remove('show');
          }, 5000);
        }, 1200);
      }
    });
  }

  /* ---------- Newsletter Form ---------- */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');
      if (input.value.trim()) {
        const original = btn.textContent;
        btn.textContent = 'Done!';
        input.value = '';
        setTimeout(() => { btn.textContent = original; }, 2500);
      }
    });
  }

  /* ---------- Blog Page Rendering ---------- */
  const blogGrid = document.querySelector('#blogGrid');
  if (blogGrid && typeof BLOG_ARTICLES !== 'undefined') {
    const blogFeatured = document.querySelector('#blogFeatured');
    const featuredArticle = BLOG_ARTICLES.find(a => a.featured) || BLOG_ARTICLES[0];
    if (blogFeatured && featuredArticle) {
      blogFeatured.innerHTML = `
        <div class="blog-featured-card">
          <div class="blog-featured-img"><img src="${featuredArticle.image}" alt="${featuredArticle.title}" onerror="this.style.display='none';"></div>
          <div class="blog-featured-body">
            <span class="blog-cat-badge">${featuredArticle.category}</span>
            <h2>${featuredArticle.title}</h2>
            <p>${featuredArticle.excerpt}</p>
            <div class="blog-meta"><span>${featuredArticle.author}</span><span>&middot;</span><span>${featuredArticle.date}</span><span>&middot;</span><span>${featuredArticle.readTime}</span></div>
            <span class="blog-read-more">Read Article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
          </div>
        </div>`;
    }
    // Category filter buttons
    const blogFiltersEl = document.querySelector('.blog-filters');
    if (blogFiltersEl) {
      BLOG_CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'blog-filter-btn';
        btn.dataset.category = cat;
        btn.textContent = cat;
        blogFiltersEl.appendChild(btn);
      });
    }
    function renderBlogGrid(category) {
      const list = category === 'all'
        ? BLOG_ARTICLES.filter(a => a.id !== (featuredArticle && featuredArticle.id))
        : BLOG_ARTICLES.filter(a => a.category === category && a.id !== (featuredArticle && featuredArticle.id));
      if (list.length === 0) {
        blogGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--c-muted); padding:3rem 0;">No articles in this category yet.</p>';
        return;
      }
      blogGrid.innerHTML = list.map((a, i) => `
        <article class="blog-card reveal reveal-delay-${(i % 4) + 1}">
          <div class="blog-card-img"><img src="${a.image}" alt="${a.title}" onerror="this.style.display='none';"></div>
          <div class="blog-card-body">
            <span class="blog-cat-badge">${a.category}</span>
            <h3>${a.title}</h3>
            <p>${a.excerpt}</p>
            <div class="blog-meta"><span>${a.date}</span><span>&middot;</span><span>${a.readTime}</span></div>
          </div>
        </article>
      `).join('');
      blogGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }
    renderBlogGrid('all');
    document.querySelectorAll('.blog-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderBlogGrid(btn.dataset.category);
      });
    });
    // Sidebar categories
    const blogSidebarCats = document.querySelector('#blogSidebarCats');
    if (blogSidebarCats) {
      const counts = {};
      BLOG_ARTICLES.forEach(a => { counts[a.category] = (counts[a.category] || 0) + 1; });
      blogSidebarCats.innerHTML = `<li><button class="sidebar-cat active"><span>All Articles</span><span class="cat-count">${BLOG_ARTICLES.length}</span></button></li>` +
        BLOG_CATEGORIES.map(c => `<li><button class="sidebar-cat"><span>${c}</span><span class="cat-count">${counts[c] || 0}</span></button></li>`).join('');
    }
    // Popular posts
    const blogPopular = document.querySelector('#blogPopular');
    if (blogPopular) {
      blogPopular.innerHTML = BLOG_ARTICLES.filter(a => a.id !== (featuredArticle && featuredArticle.id)).slice(0, 4).map(a => `
        <li class="blog-popular-item">
          <div class="blog-popular-img"><img src="${a.image}" alt="${a.title}" onerror="this.style.display='none';"></div>
          <div class="blog-popular-body">
            <h5>${a.title}</h5>
            <span>${a.date}</span>
          </div>
        </li>`).join('');
    }
    // Tags
    const blogTagsEl = document.querySelector('#blogTags');
    if (blogTagsEl) {
      const tags = ['RF', 'Cavitation', 'LED', 'IPL', 'Microneedling', 'EMS', 'Cryo', 'Dermabrasion', 'Anti-Aging', 'Slimming', 'Acne', 'Skin Care'];
      blogTagsEl.innerHTML = tags.map(t => `<span class="blog-tag">${t}</span>`).join('');
    }
  }

  /* ---------- Treatment Guide Page Rendering ---------- */
  const treatmentGrid = document.querySelector('#treatmentGrid');
  if (treatmentGrid && typeof TREATMENTS !== 'undefined') {
    const treatmentFiltersEl = document.querySelector('#treatmentFilters');
    if (treatmentFiltersEl) {
      TREATMENT_CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'blog-filter-btn';
        btn.dataset.category = cat;
        btn.textContent = cat;
        treatmentFiltersEl.appendChild(btn);
      });
    }
    function renderTreatments(category) {
      const list = category === 'all' ? TREATMENTS : TREATMENTS.filter(t => t.category === category);
      treatmentGrid.innerHTML = list.map((t, i) => {
        const iconSvg = (typeof ICON_LIBRARY !== 'undefined' && ICON_LIBRARY[t.icon]) ? ICON_LIBRARY[t.icon] : '';
        const benefitsHtml = t.benefits.map(b => `<li><span class="feat-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg></span>${b}</li>`).join('');
        const relatedCatsHtml = t.relatedCategories.map(c => {
          const label = (typeof CATEGORY_LIBRARY !== 'undefined' && CATEGORY_LIBRARY[c]) ? CATEGORY_LIBRARY[c].label : c;
          return `<a href="products.html" class="treatment-related-cat">${label}</a>`;
        }).join('');
        return `
          <div class="treatment-card reveal reveal-delay-${(i % 4) + 1}">
            <div class="treatment-card-header" style="background:${t.gradient};">
              <div class="treatment-icon">${iconSvg}</div>
              <span class="treatment-cat-badge">${t.category}</span>
            </div>
            <div class="treatment-card-body">
              <h3>${t.name}</h3>
              <p>${t.description}</p>
              <div class="treatment-info">
                <div class="treatment-info-item"><span class="label">Area</span><span class="value">${t.area}</span></div>
                <div class="treatment-info-item"><span class="label">Duration</span><span class="value">${t.duration}</span></div>
                <div class="treatment-info-item"><span class="label">Sessions</span><span class="value">${t.sessions}</span></div>
              </div>
              <div class="treatment-benefits"><ul>${benefitsHtml}</ul></div>
              <div class="treatment-related"><span>Related Equipment:</span><div class="treatment-related-cats">${relatedCatsHtml}</div></div>
            </div>
          </div>`;
      }).join('');
      treatmentGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }
    renderTreatments('all');
    if (treatmentFiltersEl) {
      treatmentFiltersEl.querySelectorAll('.blog-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          treatmentFiltersEl.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderTreatments(btn.dataset.category);
        });
      });
    }
  }

  /* ---------- Homepage Testimonials Slider ---------- */
  const testimonialsSlider = document.querySelector('#testimonialsSlider');
  if (testimonialsSlider && typeof TESTIMONIALS !== 'undefined') {
    testimonialsSlider.innerHTML = TESTIMONIALS.map((t, i) => `
      <div class="testimonial-card ${i === 0 ? 'active' : ''}" data-index="${i}">
        <div class="testimonial-stars">${'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>'.repeat(t.rating)}</div>
        <p class="testimonial-text">&ldquo;${t.text}&rdquo;</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar" style="background:${t.gradient};">${t.avatar}</div>
          <div class="testimonial-author-info"><strong>${t.name}</strong><span>${t.role}</span></div>
        </div>
      </div>
    `).join('');
    let testimonialIndex = 0;
    const testimonialCards = testimonialsSlider.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelector('#testimonialDots');
    if (testimonialDots) {
      testimonialDots.innerHTML = TESTIMONIALS.map((_, i) => `<button class="testimonial-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Testimonial ${i+1}"></button>`).join('');
      testimonialDots.querySelectorAll('.testimonial-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          testimonialIndex = parseInt(dot.dataset.index);
          updateTestimonial();
        });
      });
    }
    function updateTestimonial() {
      testimonialCards.forEach((c, i) => c.classList.toggle('active', i === testimonialIndex));
      if (testimonialDots) testimonialDots.querySelectorAll('.testimonial-dot').forEach((d, i) => d.classList.toggle('active', i === testimonialIndex));
    }
    const tPrev = document.querySelector('#testimonialPrev');
    const tNext = document.querySelector('#testimonialNext');
    if (tPrev) tPrev.addEventListener('click', () => { testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length; updateTestimonial(); });
    if (tNext) tNext.addEventListener('click', () => { testimonialIndex = (testimonialIndex + 1) % testimonialCards.length; updateTestimonial(); });
    if (testimonialCards.length > 1) {
      setInterval(() => { testimonialIndex = (testimonialIndex + 1) % testimonialCards.length; updateTestimonial(); }, 6000);
    }
  }

  /* ---------- Homepage Blog Preview ---------- */
  const homeBlogPreview = document.querySelector('#homeBlogPreview');
  if (homeBlogPreview && typeof BLOG_ARTICLES !== 'undefined') {
    homeBlogPreview.innerHTML = BLOG_ARTICLES.slice(0, 3).map((a, i) => `
      <article class="blog-card reveal reveal-delay-${(i % 4) + 1}">
        <div class="blog-card-img"><img src="${a.image}" alt="${a.title}" onerror="this.style.display='none';"></div>
        <div class="blog-card-body">
          <span class="blog-cat-badge">${a.category}</span>
          <h3>${a.title}</h3>
          <p>${a.excerpt}</p>
          <div class="blog-meta"><span>${a.date}</span><span>&middot;</span><span>${a.readTime}</span></div>
        </div>
      </article>
    `).join('');
    homeBlogPreview.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ---------- Animated Counter ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = target + suffix;
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

});

/* ---------- fadeInUp keyframe (injected) ---------- */
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleEl);
