document.addEventListener('DOMContentLoaded', () => {
  // Global States
  let productsData = [];
  const BACKEND_URL = ''; // Relative path because of express serving public folder

  // Swatch color definitions for visualizer
  const visualizerMaterials = {
    'Simili PVC': {
      thickness: "0.7mm - 0.9mm",
      features: "Đa màu sắc, Chống thấm nước, Giá cạnh tranh",
      swatches: [
        { color: '#8B4513', name: 'Nâu Simili' },
        { color: '#CD853F', name: 'Bò Sáng' },
        { color: '#D2B48C', name: 'Kem Cát' },
        { color: '#000000', name: 'Đen Bóng' },
        { color: '#FFFFFF', name: 'Trắng Sữa' },
        { color: '#333333', name: 'Xám Đậm' }
      ]
    },
    'Da PU': {
      thickness: "1.0mm - 1.2mm",
      features: "Đàn hồi tốt, Mềm mại như da thật, Không bong tróc",
      swatches: [
        { color: '#c5a880', name: 'Vàng Kim Luxury' },
        { color: '#4A2E1B', name: 'Nâu Cafe' },
        { color: '#8B5A2B', name: 'Nâu Hạt Dẻ' },
        { color: '#000000', name: 'Đen Mờ' },
        { color: '#EAEAEA', name: 'Trắng Kem' },
        { color: '#A0522D', name: 'Đỏ Sienna' }
      ]
    },
    'Da PVC': {
      thickness: "1.2mm - 1.4mm",
      features: "Chống mài mòn cao, Kháng khuẩn, Chống cháy lan",
      swatches: [
        { color: '#2B2B2B', name: 'Đen Than' },
        { color: '#5C4033', name: 'Nâu Đậm Ô tô' },
        { color: '#D2B48C', name: 'Kem Bọc Ghế' },
        { color: '#800000', name: 'Đỏ Đô Luxury' },
        { color: '#1A303A', name: 'Xanh Navy' }
      ]
    },
    'Microfiber': {
      thickness: "1.4mm - 1.6mm",
      features: "Bền vượt trội da thật, Chống mốc, Không mùi",
      swatches: [
        { color: '#3E2723', name: 'Nâu Gụ Hạng Sang' },
        { color: '#4E342E', name: 'Nâu Đất Mịn' },
        { color: '#212121', name: 'Đen Carbon' },
        { color: '#BDBDBD', name: 'Ghi Xám Nhạt' },
        { color: '#8D6E63', name: 'Nâu Khói' }
      ]
    }
  };

  // --- STICKY HEADER & MOBILE NAV ---
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
    
    // Highlight active section on scroll
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  });

  // --- NOTIFICATION TOAST ---
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // --- FETCH PRODUCTS FROM API ---
  async function fetchProducts() {
    const grid = document.getElementById('products-grid');
    try {
      const response = await fetch(`${BACKEND_URL}/api/products`);
      if (!response.ok) throw new Error('Không thể lấy dữ liệu sản phẩm');
      productsData = await response.json();
      renderProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Đang hiển thị danh mục sản phẩm ngoại tuyến.', 'error');
      // If server fails or offline, Express code fallback logic is client-side rendered here
      // to guarantee functionality:
      productsData = getOfflineBackupProducts();
      renderProducts(productsData);
    }
  }

  function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Không tìm thấy mẫu da nào thuộc danh mục này.</div>';
      return;
    }

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.category = product.type;

      // Create a colored background box or render actual image
      const previewBgColor = product.colors[0] || '#c5a880';
      let mediaHtml = '';
      
      if (product.imageUrl && product.imageUrl.startsWith('uploads/')) {
        mediaHtml = `<img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; transition: var(--transition-smooth);" class="product-uploaded-img">`;
      } else {
        mediaHtml = `<div class="leather-swatch-canvas" style="background-image: url('assets/images/leather_texture_seamless.png'); background-color: ${previewBgColor}; background-size: 80px;"></div>`;
      }
      
      card.innerHTML = `
        <div class="product-img-box">
          ${mediaHtml}
          <span class="product-badge">${product.type}</span>
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <ul class="product-specs">
            <li>Độ dày: ${product.thickness}</li>
            <li>Đặc tính: ${product.features[0] || 'Cao cấp'}</li>
          </ul>
          <div class="product-footer">
            <span class="product-price">${product.price}</span>
            <button class="btn-card-action btn-view-detail" data-id="${product._id || product.id}">
              Chi tiết →
            </button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // Add click listeners to detail buttons
    document.querySelectorAll('.btn-view-detail').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prodId = e.target.dataset.id;
        const selectedProd = productsData.find(p => (p._id || p.id) === prodId);
        if (selectedProd) openProductDetailModal(selectedProd);
      });
    });
  }

  // --- CATEGORIES FILTER ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filterVal = e.target.dataset.filter;
      if (filterVal === 'all') {
        renderProducts(productsData);
      } else {
        const filtered = productsData.filter(p => p.type === filterVal);
        renderProducts(filtered);
      }
    });
  });

  // --- DETAIL MODAL ---
  const modal = document.getElementById('product-detail-modal');
  const modalBody = document.getElementById('modal-product-details');
  const closeModalBtn = document.getElementById('close-detail-modal');

  function openProductDetailModal(product) {
    document.getElementById('modal-product-name').textContent = product.name;
    
    // Convert arrays to readable text
    const colorsList = product.colors.map(color => 
      `<div style="display:flex; align-items:center; gap:8px;">
        <span style="display:inline-block; width:20px; height:20px; border-radius:50%; background-color:${color}; border: 1px solid rgba(255,255,255,0.2);"></span>
        <span>${color}</span>
       </div>`
    ).join('');

    const appList = product.applications.map(app => 
      `<span style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 4px; font-size: 0.85rem; border: 1.5px solid var(--border-color);">${app}</span>`
    ).join(' ');

    const featuresList = product.features.map(feat => 
      `<li>✓ ${feat}</li>`
    ).join('');

    let modalMediaHtml = '';
    if (product.imageUrl && product.imageUrl.startsWith('uploads/')) {
      modalMediaHtml = `<img src="${product.imageUrl}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">`;
    } else {
      modalMediaHtml = `<div style="width:100%; height:100%; background-image: url('assets/images/leather_texture_seamless.png'); background-color: ${product.colors[0] || '#c5a880'}; background-size: 100px;"></div>`;
    }

    modalBody.innerHTML = `
      <div style="display:grid; grid-template-columns: 1.2fr 1.8fr; gap: 30px; margin-top: 15px;">
        <div style="aspect-ratio: 1; background-color:#1e2023; border-radius:4px; overflow:hidden; border:1px solid var(--border-color); display:flex; justify-content:center; align-items:center;">
          ${modalMediaHtml}
        </div>
        <div>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px; line-height: 1.6;">${product.description}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.9rem;">
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 10px 0; color: var(--text-muted); font-weight: 500;">Dòng chất liệu:</td>
              <td style="padding: 10px 0; color: var(--primary); font-weight: 600;">${product.type}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 10px 0; color: var(--text-muted); font-weight: 500;">Độ dày tiêu chuẩn:</td>
              <td style="padding: 10px 0; font-weight: 500;">${product.thickness}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 10px 0; color: var(--text-muted); font-weight: 500;">Giá bán phân phối:</td>
              <td style="padding: 10px 0; font-weight: 700; color: var(--primary);">${product.price}</td>
            </tr>
          </table>

          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 0.9rem; text-transform:uppercase; margin-bottom: 10px; color: var(--text-muted);">Ứng dụng may mặc / sản xuất:</h4>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">${appList}</div>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 0.9rem; text-transform:uppercase; margin-bottom: 8px; color: var(--text-muted);">Đặc tính kỹ thuật:</h4>
            <ul style="list-style:none; display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size: 0.9rem; color: var(--text-main); font-weight:500;">
              ${featuresList}
            </ul>
          </div>

          <div>
            <h4 style="font-size: 0.9rem; text-transform:uppercase; margin-bottom: 10px; color: var(--text-muted);">Bảng màu sản xuất sẵn:</h4>
            <div style="display:flex; gap:12px; flex-wrap:wrap;">${colorsList}</div>
          </div>
          
          <div style="margin-top: 30px; display:flex; gap:15px;">
            <a href="#request" class="btn btn-primary" onclick="document.getElementById('product-detail-modal').close();" style="flex:1; padding: 10px 20px; font-size:0.9rem;">Yêu cầu mẫu thử da này</a>
          </div>
        </div>
      </div>
    `;
    modal.showModal();
  }

  closeModalBtn.addEventListener('click', () => {
    modal.close();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  // --- INTERACTIVE VISUALIZER LOGIC ---
  const visualizerCanvas = document.getElementById('visualizer-canvas');
  const controlMockups = document.querySelectorAll('[data-mockup]');
  const controlMaterials = document.querySelectorAll('[data-type]');
  const vazSwatches = document.getElementById('vaz-swatches');

  let activeMaterial = 'Simili PVC';

  // Toggle Mockup Display (Sofa, Car Seat, Shoe)
  controlMockups.forEach(btn => {
    btn.addEventListener('click', (e) => {
      controlMockups.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const mockupName = e.target.dataset.mockup;
      document.getElementById('mockup-sofa').style.display = mockupName === 'sofa' ? 'block' : 'none';
      document.getElementById('mockup-car').style.display = mockupName === 'car' ? 'block' : 'none';
      document.getElementById('mockup-shoe').style.display = mockupName === 'shoe' ? 'block' : 'none';
    });
  });

  // Toggle Material Type (PU, PVC, Simili, Microfiber) -> Alters Swatches and Specs
  controlMaterials.forEach(btn => {
    btn.addEventListener('click', (e) => {
      controlMaterials.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      activeMaterial = e.target.dataset.type;
      const textureScale = e.target.dataset.scale;

      // Adjust pattern scale
      visualizerCanvas.style.backgroundSize = textureScale;

      // Update Spec Labels
      const data = visualizerMaterials[activeMaterial];
      document.getElementById('spec-leather-type').textContent = activeMaterial;
      document.getElementById('spec-leather-thickness').textContent = data.thickness;
      document.getElementById('spec-leather-features').textContent = data.features;

      // Load Swatches for this specific material
      renderVisualizerSwatches(data.swatches);
    });
  });

  function renderVisualizerSwatches(swatches) {
    vazSwatches.innerHTML = '';
    swatches.forEach((swatch, idx) => {
      const sw = document.createElement('div');
      sw.className = 'swatch' + (idx === 0 ? ' active' : '');
      sw.style.backgroundColor = swatch.color;
      sw.dataset.color = swatch.color;
      sw.title = swatch.name;

      sw.addEventListener('click', (e) => {
        document.querySelectorAll('#vaz-swatches .swatch').forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
        
        // Dynamically color visualizer texture using CSS blend mode
        visualizerCanvas.style.backgroundColor = e.target.dataset.color;
      });

      vazSwatches.appendChild(sw);
    });

    // Apply the first swatch by default on render
    if (swatches.length > 0) {
      visualizerCanvas.style.backgroundColor = swatches[0].color;
    }
  }

  // --- SUBMIT SAMPLE REQUEST FORM ---
  const requestForm = document.getElementById('sample-request-form');
  requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const leatherType = document.getElementById('leatherType').value;
    const colorInterest = document.getElementById('colorInterest').value;
    const notes = document.getElementById('notes').value;

    const requestData = { fullName, phone, email, address, leatherType, colorInterest, notes };

    try {
      const response = await fetch(`${BACKEND_URL}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (response.ok) {
        showToast('✅ Gửi yêu cầu nhận mẫu thành công! Chúng tôi sẽ gọi lại trong 24h.', 'success');
        requestForm.reset();
        document.getElementById('colorInterest').value = 'Tự chọn';
      } else {
        throw new Error(result.message || 'Lỗi lưu thông tin');
      }
    } catch (err) {
      console.error(err);
      showToast('⚠️ Không thể kết nối server để lưu yêu cầu. Vui lòng kiểm tra lại.', 'error');
    }
  });

  // --- SCROLL REVEAL ANIMATION ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));

  // Init Calls
  fetchProducts();
  renderVisualizerSwatches(visualizerMaterials[activeMaterial].swatches);

  // Offline backup data in case backend server is unreachable
  function getOfflineBackupProducts() {
    return [
      {
        id: "p1",
        name: "Simili PVC Tiêu Chuẩn",
        type: "Simili PVC",
        thickness: "0.7mm - 0.9mm",
        colors: ["#8B4513", "#CD853F", "#D2B48C", "#000000", "#FFFFFF", "#333333"],
        applications: ["Giày dép", "Thời trang", "Văn phòng phẩm"],
        price: "70,000đ - 95,000đ/m",
        description: "Vải giả da simili PVC phổ thông được làm từ lớp vải lót dệt kết hợp với nhựa PVC cao cấp. Bề mặt có vân da tự nhiên, chống trầy xước nhẹ, màu sắc đa dạng, giá thành cực kỳ kinh tế, phù hợp cho sản xuất giày dép đại trà, lót túi xách, bìa sổ văn phòng.",
        features: ["Giá thành tối ưu", "Đa dạng màu sắc", "Dễ gia công", "Chống thấm nước"]
      },
      {
        id: "p2",
        name: "Da PU Cao Cấp Mềm Mại",
        type: "Da PU",
        thickness: "1.0mm - 1.2mm",
        colors: ["#c5a880", "#4A2E1B", "#8B5A2B", "#000000", "#EAEAEA", "#A0522D"],
        applications: ["Sofa", "Thời trang", "Giày dép"],
        price: "150,000đ - 190,000đ/m",
        description: "Da PU cao cấp được phủ lớp nhựa Polyurethane mềm mại, mang lại cảm giác tiếp xúc gần như da thật. Sản phẩm có độ đàn hồi vượt trội, co giãn tốt, bề mặt sang trọng, thoáng khí và có tuổi thọ cao. Phù hợp cho may mặc áo khoác da, túi xách thời trang cao cấp và bọc ghế sofa phòng khách.",
        features: ["Đàn hồi vượt trội", "Mềm mịn như da thật", "Chống nổ bề mặt", "Thân thiện môi trường"]
      },
      {
        id: "p3",
        name: "Da PVC Chuyên Dụng Ô Tô & Sofa",
        type: "Da PVC",
        thickness: "1.2mm - 1.4mm",
        colors: ["#2B2B2B", "#5C4033", "#D2B48C", "#800000", "#1A303A"],
        applications: ["Ô tô", "Sofa"],
        price: "120,000đ - 160,000đ/m",
        description: "Dòng da PVC chịu lực cao, thiết kế chuyên dụng cho nội thất xe hơi (ghế da, tapi cửa, trần xe) và các bộ sofa văn phòng chịu tần suất sử dụng lớn. Chất liệu da dày dặn, có khả năng kháng khuẩn, chống cháy lan cấp độ nhẹ và cực kỳ dễ dàng lau chùi vệ sinh bụi bẩn.",
        features: ["Chống cháy lan nhẹ", "Chống mài mòn cực tốt", "Kháng khuẩn, dễ vệ sinh", "Độ bền màu cao"]
      },
      {
        id: "p4",
        name: "Da Nhân Tạo Cao Cấp Microfiber",
        type: "Microfiber",
        thickness: "1.4mm - 1.6mm",
        colors: ["#3E2723", "#4E342E", "#212121", "#BDBDBD", "#8D6E63"],
        applications: ["Sofa", "Ô tô", "Giày dép"],
        price: "220,000đ - 280,000đ/m",
        description: "Da nhân tạo Microfiber là dòng da công nghiệp cao cấp nhất hiện nay, sản xuất bằng công nghệ mô phỏng cấu trúc 3D của da thật. Sản phẩm có độ bền kéo đứt, độ chịu xé cao hơn cả da thật, chống mốc, chống ẩm mốc hoàn hảo và không mùi khó chịu. Lý tưởng cho bọc ghế xe hơi sang trọng, sofa hạng sang và giày bảo hộ lao động xuất khẩu.",
        features: ["Bền hơn da thật", "Kháng nấm mốc tự nhiên", "Không mùi hóa chất", "Không chứa chất độc hại"]
      }
    ];
  }
});
