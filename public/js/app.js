document.addEventListener('DOMContentLoaded', () => {
  // Global States
  let productsData = [];
  const BACKEND_URL = ''; // Relative path because of express serving public folder

  // --- LANGUAGE / TRANSLATIONS ---
  const translations = {
    vi: {
      'nav.home': 'Trang chủ',
      'nav.about': 'Giới thiệu',
      'nav.products': 'Sản phẩm',
      'nav.customizer': 'Thử màu da',
      'nav.request': 'Đăng ký mẫu',
      'nav.contact': 'Liên hệ',
      'hero.badge': 'ĐẲNG CẤP DA CÔNG NGHIỆP SINCE 1994',
      'hero.title': 'Kiến Tạo Không Gian<br><span>Nâng Tầm Chất Liệu</span>',
      'hero.desc': 'Thắng Thành Lợi cung cấp giải pháp vải giả da cao cấp (Simili, PU, PVC, Microfiber) vượt trội về chất lượng, dẫn đầu về xu hướng màu sắc và hoa văn, đồng hành cùng các thương hiệu sofa, ô tô, giày dép hàng đầu.',
      'hero.btn1': 'Khám phá sản phẩm',
      'hero.btn2': 'Đăng ký nhận mẫu thử',
      'about.subtitle': 'VỀ CHÚNG TÔI',
      'about.title': 'Hành Trình Hơn 3 Thập Kỷ Kiến Tạo Uy Tín',
      'about.p1': 'Khởi đầu từ cửa hàng Đại Thắng năm 1994, Thắng Thành Lợi đã không ngừng lớn mạnh để trở thành nhà phân phối da công nghiệp uy tín bậc nhất tại Việt Nam. Chúng tôi thấu hiểu từng chất liệu, đáp ứng mọi yêu cầu khắt khe về kỹ thuật và thẩm mỹ.',
      'about.p2': 'Sản phẩm của chúng tôi luôn đi kèm cam kết về nguồn hàng ổn định, mức giá cạnh tranh tận xưởng và sự trung thực tuyệt đối trong mọi giao dịch.',
      'about.stat1.title': 'Năm kinh nghiệm',
      'about.stat1.desc': 'Đồng hành phát triển từ 1994',
      'about.stat2.title': 'Mẫu mã đa dạng',
      'about.stat2.desc': 'Luôn cập nhật xu hướng mới',
      'about.stat3.title': 'Đạt chuẩn chất lượng',
      'about.stat3.desc': 'Kháng khuẩn, chống nước, bền màu',
      'about.stat4.title': 'Đối tác tin cậy',
      'about.stat4.desc': 'Xưởng sofa, ô tô, giày dép lớn',
      'products.subtitle': 'DANH MỤC CHẤT LIỆU',
      'products.title': 'Sản Phẩm Da Nổi Bật',
      'products.desc': 'Tổng hợp các dòng da công nghiệp chủ lực, được kiểm định nghiêm ngặt về chất lượng trước khi phân phối.',
      'products.filter.all': 'Tất cả',
      'products.loading': 'Đang tải danh sách sản phẩm da...',
      'products.empty': 'Không tìm thấy mẫu da nào thuộc danh mục này.',
      'products.thickness': 'Độ dày:',
      'products.feature': 'Đặc tính:',
      'products.colors': 'Màu có sẵn:',
      'products.detail': 'Chi tiết →',
      'customizer.subtitle': 'WOW EXPERIENCE',
      'customizer.title': 'Phòng Trực Quan Hóa Chất Liệu',
      'customizer.desc': 'Chọn loại da và thay đổi màu sắc trực quan để xem sự hòa hợp trên các mô hình sản phẩm thực tế.',
      'customizer.step1': '1. Chọn mô hình bọc thử',
      'customizer.mockup.sofa': 'Ghế Sofa',
      'customizer.mockup.car': 'Nội thất Ô tô',
      'customizer.mockup.shoe': 'Giày Da Oxford',
      'customizer.step2': '2. Chọn Chất liệu vân da',
      'customizer.type.simili': 'Simili PVC (Mịn)',
      'customizer.type.pu': 'Da PU (Vân Nhẹ)',
      'customizer.type.pvc': 'Da PVC (Dày dặn)',
      'customizer.type.micro': 'Microfiber (Siêu mịn)',
      'customizer.step3': '3. Chọn Màu sắc Da',
      'customizer.textureLabel': 'Mẫu vân da đang chọn',
      'customizer.gallerySubtitle': 'BẢNG MẪU DA',
      'customizer.galleryTitle': 'Xem Trực Tiếp Mẫu Vân Da',
      'customizer.galleryDesc': 'Nhấn vào mẫu da bên dưới để xem chi tiết vân da và áp dụng lên mô hình sofa phía trên.',
      'customizer.spec.type': 'Chất liệu da:',
      'customizer.spec.thickness': 'Độ dày tiêu chuẩn:',
      'customizer.spec.features': 'Đặc tính nổi bật:',
      'request.subtitle': 'ĐĂNG KÝ NHẬN MẪU THỬ',
      'request.title': 'Trực Tiếp Trải Nghiệm Chất Lượng',
      'request.desc': 'Chúng tôi sẵn sàng gửi miễn phí sổ mẫu da thử tận nơi (catalog mini chứa các mẩu da thật có kích thước 10x10cm) để bạn cảm nhận trực tiếp độ dày, bề mặt vân da và kiểm định chất lượng vật lý.',
      'request.info.phone.title': 'Điện thoại Hotline',
      'request.info.email.title': 'Hòm thư hỗ trợ',
      'request.info.address.title': 'Tổng kho & Văn phòng',
      'request.form.title': 'Thông Tin Nhận Mẫu Thử',
      'request.form.fullName': 'Họ và tên *',
      'request.form.fullName.ph': 'Ví dụ: Nguyễn Văn A',
      'request.form.phone': 'Số điện thoại *',
      'request.form.phone.ph': 'Ví dụ: 0912345678',
      'request.form.email': 'Hòm thư email (nếu có)',
      'request.form.email.ph': 'ten@congty.com',
      'request.form.address': 'Địa chỉ nhận mẫu thử *',
      'request.form.address.ph': 'Số nhà, tên đường, phường/xã, quận/huyện, tỉnh thành...',
      'request.form.leatherType': 'Dòng da mong muốn *',
      'request.form.leatherType.simili': 'Simili PVC',
      'request.form.leatherType.pu': 'Da PU cao cấp',
      'request.form.leatherType.pvc': 'Da PVC ô tô & sofa',
      'request.form.leatherType.micro': 'Microfiber siêu bền',
      'request.form.color': 'Tông màu quan tâm',
      'request.form.color.ph': 'Ví dụ: Đen, Kem, Nâu...',
      'request.form.color.default': 'Tự chọn',
      'request.form.notes': 'Ghi chú yêu cầu thêm',
      'request.form.notes.ph': 'Nêu rõ yêu cầu về độ dày hoặc mục đích sử dụng (Ví dụ: bọc ghế oto sang, làm ví bóp bọc sổ...) để chúng tôi chọn mẫu thử chính xác nhất.',
      'request.form.submit': 'Gửi Yêu Cầu Nhận Mẫu',
      'contact.subtitle': 'ĐỊA CHỈ PHÂN PHỐI',
      'contact.title': 'Vị Trí Cửa Hàng Tổng Kho',
      'contact.mapHint': '📍 Bấm để mở trong Google Maps',
      'contact.mapAria': 'Mở Google Maps',
      'footer.desc': 'Tổng đại lý phân phối vải giả da simili, da nhân tạo cao cấp cho thị trường nội địa và xuất khẩu. Kiến tạo niềm tin vững bền qua hơn 30 năm tận tụy.',
      'footer.quicklinks': 'Liên Kết Nhanh',
      'footer.link.products': 'Danh mục da',
      'footer.link.customizer': 'Bộ thử màu da',
      'footer.link.request': 'Yêu cầu mẫu',
      'footer.legal': 'Thông Tin Pháp Lý',
      'footer.legal.tax': 'Mã số thuế:',
      'footer.legal.rep': 'Đại diện:',
      'footer.legal.address': 'Địa chỉ đăng ký kinh doanh:',
      'modal.defaultTitle': 'Tên sản phẩm da',
      'modal.type': 'Dòng chất liệu:',
      'modal.thickness': 'Độ dày tiêu chuẩn:',
      'modal.price': 'Giá bán phân phối:',
      'modal.applications': 'Ứng dụng may mặc / sản xuất:',
      'modal.features': 'Đặc tính kỹ thuật:',
      'modal.colors': 'Bảng màu sản xuất sẵn:',
      'modal.requestBtn': 'Yêu cầu mẫu thử da này',
      'toast.offlineProducts': 'Đang hiển thị danh mục sản phẩm ngoại tuyến.',
      'toast.submitSuccess': '✅ Gửi yêu cầu nhận mẫu thành công! Chúng tôi sẽ gọi lại trong 24h.',
      'toast.submitError': '⚠️ Không thể kết nối server để lưu yêu cầu. Vui lòng kiểm tra lại.'
    },
    en: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.products': 'Products',
      'nav.customizer': 'Color Studio',
      'nav.request': 'Get a Sample',
      'nav.contact': 'Contact',
      'hero.badge': 'PREMIUM INDUSTRIAL LEATHER SINCE 1994',
      'hero.title': 'Crafting Spaces<br><span>Elevating Materials</span>',
      'hero.desc': 'Thang Thanh Loi delivers premium faux leather solutions (Simili, PU, PVC, Microfiber) with outstanding quality, leading color and pattern trends, partnering with top sofa, automotive, and footwear brands.',
      'hero.btn1': 'Explore Products',
      'hero.btn2': 'Request a Free Sample',
      'about.subtitle': 'ABOUT US',
      'about.title': 'Over Three Decades of Building Trust',
      'about.p1': 'Starting from the Dai Thang store in 1994, Thang Thanh Loi has grown continuously to become one of the most trusted industrial leather distributors in Vietnam. We understand every material and meet the most demanding technical and aesthetic requirements.',
      'about.p2': 'Our products always come with a commitment to stable supply, competitive factory-direct pricing, and absolute honesty in every transaction.',
      'about.stat1.title': 'Years of Experience',
      'about.stat1.desc': 'Growing together since 1994',
      'about.stat2.title': 'Diverse Designs',
      'about.stat2.desc': 'Always up to date with new trends',
      'about.stat3.title': 'Quality Certified',
      'about.stat3.desc': 'Antibacterial, waterproof, colorfast',
      'about.stat4.title': 'Trusted Partners',
      'about.stat4.desc': 'Major sofa, automotive & footwear workshops',
      'products.subtitle': 'MATERIAL CATALOG',
      'products.title': 'Featured Leather Products',
      'products.desc': 'A curated collection of our core industrial leather lines, strictly quality-checked before distribution.',
      'products.filter.all': 'All',
      'products.loading': 'Loading leather product catalog...',
      'products.empty': 'No leather samples found in this category.',
      'products.thickness': 'Thickness:',
      'products.feature': 'Feature:',
      'products.colors': 'Colors:',
      'products.detail': 'Details →',
      'customizer.subtitle': 'WOW EXPERIENCE',
      'customizer.title': 'Material Visualization Studio',
      'customizer.desc': 'Choose a leather type and change colors visually to preview the match on real product mockups.',
      'customizer.step1': '1. Choose a Mockup Model',
      'customizer.mockup.sofa': 'Sofa Chair',
      'customizer.mockup.car': 'Car Interior',
      'customizer.mockup.shoe': 'Oxford Leather Shoe',
      'customizer.step2': '2. Choose a Leather Texture',
      'customizer.type.simili': 'Simili PVC (Smooth)',
      'customizer.type.pu': 'PU Leather (Light Grain)',
      'customizer.type.pvc': 'PVC Leather (Thick)',
      'customizer.type.micro': 'Microfiber (Ultra-smooth)',
      'customizer.step3': '3. Choose Leather Color',
      'customizer.textureLabel': 'Selected leather texture',
      'customizer.gallerySubtitle': 'LEATHER SAMPLES',
      'customizer.galleryTitle': 'View Leather Samples Directly',
      'customizer.galleryDesc': 'Click on a leather sample below to see texture details and apply it to the sofa model above.',
      'customizer.spec.type': 'Leather Type:',
      'customizer.spec.thickness': 'Standard Thickness:',
      'customizer.spec.features': 'Key Features:',
      'request.subtitle': 'REQUEST A SAMPLE',
      'request.title': 'Experience the Quality Firsthand',
      'request.desc': "We're happy to send you a free sample booklet (a mini catalog with real 10x10cm leather swatches) so you can feel the thickness, texture, and physical quality firsthand.",
      'request.info.phone.title': 'Hotline',
      'request.info.email.title': 'Support Email',
      'request.info.address.title': 'Warehouse & Office',
      'request.form.title': 'Sample Request Information',
      'request.form.fullName': 'Full Name *',
      'request.form.fullName.ph': 'e.g. John Smith',
      'request.form.phone': 'Phone Number *',
      'request.form.phone.ph': 'e.g. 0912345678',
      'request.form.email': 'Email Address (optional)',
      'request.form.email.ph': 'name@company.com',
      'request.form.address': 'Delivery Address *',
      'request.form.address.ph': 'House no., street, ward/district, city...',
      'request.form.leatherType': 'Preferred Leather Type *',
      'request.form.leatherType.simili': 'Simili PVC',
      'request.form.leatherType.pu': 'Premium PU Leather',
      'request.form.leatherType.pvc': 'Automotive & Sofa PVC Leather',
      'request.form.leatherType.micro': 'Ultra-durable Microfiber',
      'request.form.color': 'Preferred Color Tone',
      'request.form.color.ph': 'e.g. Black, Cream, Brown...',
      'request.form.color.default': 'Any Color',
      'request.form.notes': 'Additional Notes',
      'request.form.notes.ph': 'Specify thickness or intended use (e.g. car seat upholstery, wallet, notebook cover...) so we can pick the most accurate sample for you.',
      'request.form.submit': 'Submit Sample Request',
      'contact.subtitle': 'DISTRIBUTION LOCATION',
      'contact.title': 'Warehouse Store Location',
      'contact.mapHint': '📍 Tap to open in Google Maps',
      'contact.mapAria': 'Open Google Maps',
      'footer.desc': 'A leading distributor of simili faux leather and premium synthetic leather for the domestic and export markets. Building lasting trust over more than 30 years of dedication.',
      'footer.quicklinks': 'Quick Links',
      'footer.link.products': 'Leather Catalog',
      'footer.link.customizer': 'Color Studio',
      'footer.link.request': 'Request a Sample',
      'footer.legal': 'Legal Information',
      'footer.legal.tax': 'Tax Code:',
      'footer.legal.rep': 'Representative:',
      'footer.legal.address': 'Registered Business Address:',
      'modal.defaultTitle': 'Leather Product Name',
      'modal.type': 'Material Line:',
      'modal.thickness': 'Standard Thickness:',
      'modal.price': 'Distribution Price:',
      'modal.applications': 'Applications / Production Use:',
      'modal.features': 'Technical Features:',
      'modal.colors': 'Available Color Palette:',
      'modal.requestBtn': 'Request This Sample',
      'toast.offlineProducts': 'Showing offline product catalog.',
      'toast.submitSuccess': "✅ Sample request submitted successfully! We'll call you back within 24h.",
      'toast.submitError': '⚠️ Unable to connect to the server to save your request. Please try again.'
    }
  };

  let currentLang = localStorage.getItem('siteLang') || 'vi';

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || translations.vi[key] || key;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.innerHTML = t(el.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });

    document.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.dataset.i18nValue;
      const isUntouched = Object.values(translations).some(dict => dict[key] === el.value) || !el.value;
      if (isUntouched) el.value = t(key);
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    // Refresh dynamic content that embeds translated labels
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
    const filteredProducts = activeFilter === 'all' ? productsData : productsData.filter(p => p.type === activeFilter);
    if (productsData.length) renderProducts(filteredProducts);

    const activeMaterialBtn = document.querySelector('[data-type].active');
    if (activeMaterialBtn) {
      const data = visualizerMaterials[activeMaterialBtn.dataset.type];
      document.getElementById('spec-leather-features').textContent = data.features[currentLang];
      renderVisualizerSwatches(data.swatches);
      renderLeatherGallery(data.swatches);
    }
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem('siteLang', currentLang);
      applyTranslations();
    });
  });

  // Swatch color definitions for visualizer
  const visualizerMaterials = {
    'Simili PVC': {
      thickness: "0.7mm - 0.9mm",
      features: {
        vi: 'Đa màu sắc, Chống thấm nước, Giá cạnh tranh',
        en: 'Wide color range, Waterproof, Competitive price'
      },
      swatches: [
        { color: '#8B4513', name: { vi: 'Nâu Simili', en: 'Simili Brown' } },
        { color: '#CD853F', name: { vi: 'Bò Sáng', en: 'Light Tan' } },
        { color: '#D2B48C', name: { vi: 'Kem Cát', en: 'Sand Cream' } },
        { color: '#000000', name: { vi: 'Đen Bóng', en: 'Glossy Black' } },
        { color: '#FFFFFF', name: { vi: 'Trắng Sữa', en: 'Milk White' } },
        { color: '#333333', name: { vi: 'Xám Đậm', en: 'Dark Grey' } }
      ]
    },
    'Da PU': {
      thickness: "1.0mm - 1.2mm",
      features: {
        vi: 'Đàn hồi tốt, Mềm mại như da thật, Không bong tróc',
        en: 'Great elasticity, Soft like real leather, Peel-resistant'
      },
      swatches: [
        { color: '#c5a880', name: { vi: 'Vàng Kim Luxury', en: 'Luxury Gold' } },
        { color: '#4A2E1B', name: { vi: 'Nâu Cafe', en: 'Coffee Brown' } },
        { color: '#8B5A2B', name: { vi: 'Nâu Hạt Dẻ', en: 'Chestnut Brown' } },
        { color: '#000000', name: { vi: 'Đen Mờ', en: 'Matte Black' } },
        { color: '#EAEAEA', name: { vi: 'Trắng Kem', en: 'Cream White' } },
        { color: '#A0522D', name: { vi: 'Đỏ Sienna', en: 'Sienna Red' } }
      ]
    },
    'Da PVC': {
      thickness: "1.2mm - 1.4mm",
      features: {
        vi: 'Chống mài mòn cao, Kháng khuẩn, Chống cháy lan',
        en: 'High abrasion resistance, Antibacterial, Flame retardant'
      },
      swatches: [
        { color: '#2B2B2B', name: { vi: 'Đen Than', en: 'Charcoal Black' } },
        { color: '#5C4033', name: { vi: 'Nâu Đậm Ô tô', en: 'Automotive Dark Brown' } },
        { color: '#D2B48C', name: { vi: 'Kem Bọc Ghế', en: 'Seat Cream' } },
        { color: '#800000', name: { vi: 'Đỏ Đô Luxury', en: 'Luxury Maroon' } },
        { color: '#1A303A', name: { vi: 'Xanh Navy', en: 'Navy Blue' } }
      ]
    },
    'Microfiber': {
      thickness: "1.4mm - 1.6mm",
      features: {
        vi: 'Bền vượt trội da thật, Chống mốc, Không mùi',
        en: 'Outlasts real leather, Mold-resistant, Odorless'
      },
      swatches: [
        { color: '#3E2723', name: { vi: 'Nâu Gụ Hạng Sang', en: 'Premium Mahogany' } },
        { color: '#4E342E', name: { vi: 'Nâu Đất Mịn', en: 'Smooth Earth Brown' } },
        { color: '#212121', name: { vi: 'Đen Carbon', en: 'Carbon Black' } },
        { color: '#BDBDBD', name: { vi: 'Ghi Xám Nhạt', en: 'Light Grey' } },
        { color: '#8D6E63', name: { vi: 'Nâu Khói', en: 'Smoky Brown' } }
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
      showToast(t('toast.offlineProducts'), 'error');
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
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">${t('products.empty')}</div>`;
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
        mediaHtml = `<div class="leather-swatch-canvas" data-base-color="${previewBgColor}" style="background-image: url('assets/images/leather_swatch_texture.png'); background-color: ${previewBgColor};"></div>`;
      }

      // Generate color swatches for this product
      const colorSwatchesHtml = product.colors.map((color, idx) => 
        `<div class="product-color-dot ${idx === 0 ? 'active' : ''}" data-color="${color}" style="background-color: ${color};" title="${color}"></div>`
      ).join('');
      
      card.innerHTML = `
        <div class="product-img-box">
          ${mediaHtml}
          <span class="product-badge">${product.type}</span>
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-colors-row">
            <span class="product-colors-label">${t('products.colors')}</span>
            <div class="product-colors-swatches">${colorSwatchesHtml}</div>
          </div>
          <ul class="product-specs">
            <li>${t('products.thickness')} ${product.thickness}</li>
            <li>${t('products.feature')} ${product.features[0] || 'Cao cấp'}</li>
          </ul>
          <div class="product-footer">
            <span class="product-price">${product.price}</span>
            <button class="btn-card-action btn-view-detail" data-id="${product._id || product.id}">
              ${t('products.detail')}
            </button>
          </div>
        </div>
      `;

      // Add color swatch click listeners to change the card preview
      const swatchCanvas = card.querySelector('.leather-swatch-canvas');
      card.querySelectorAll('.product-color-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          // Update active dot
          card.querySelectorAll('.product-color-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          // Change the canvas background color
          if (swatchCanvas) {
            swatchCanvas.style.backgroundColor = dot.dataset.color;
          }
        });
      });

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
              <td style="padding: 10px 0; color: var(--text-muted); font-weight: 500;">${t('modal.type')}</td>
              <td style="padding: 10px 0; color: var(--primary); font-weight: 600;">${product.type}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 10px 0; color: var(--text-muted); font-weight: 500;">${t('modal.thickness')}</td>
              <td style="padding: 10px 0; font-weight: 500;">${product.thickness}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 10px 0; color: var(--text-muted); font-weight: 500;">${t('modal.price')}</td>
              <td style="padding: 10px 0; font-weight: 700; color: var(--primary);">${product.price}</td>
            </tr>
          </table>

          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 0.9rem; text-transform:uppercase; margin-bottom: 10px; color: var(--text-muted);">${t('modal.applications')}</h4>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">${appList}</div>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 0.9rem; text-transform:uppercase; margin-bottom: 8px; color: var(--text-muted);">${t('modal.features')}</h4>
            <ul style="list-style:none; display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size: 0.9rem; color: var(--text-main); font-weight:500;">
              ${featuresList}
            </ul>
          </div>

          <div>
            <h4 style="font-size: 0.9rem; text-transform:uppercase; margin-bottom: 10px; color: var(--text-muted);">${t('modal.colors')}</h4>
            <div style="display:flex; gap:12px; flex-wrap:wrap;">${colorsList}</div>
          </div>

          <div style="margin-top: 30px; display:flex; gap:15px;">
            <a href="#request" class="btn btn-primary" onclick="document.getElementById('product-detail-modal').close();" style="flex:1; padding: 10px 20px; font-size:0.9rem;">${t('modal.requestBtn')}</a>
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
  const sofaOverlay = document.getElementById('sofa-color-overlay');
  const sofaWrapper = document.getElementById('sofa-image-wrapper');
  const colorDotLabel = document.getElementById('color-dot-label');
  const colorNameLabel = document.getElementById('color-name-label');
  const texturePreviewInner = document.getElementById('texture-preview-inner');
  const controlMockups = document.querySelectorAll('[data-mockup]');
  const controlMaterials = document.querySelectorAll('[data-type]');
  const vazSwatches = document.getElementById('vaz-swatches');
  const sofaBaseImg = document.getElementById('sofa-base-img');

  let activeMaterial = 'Simili PVC';
  let activeColorHex = '#c5a880';

  // Convert HEX color to HSL object
  function hexToHsl(hex) {
    let c = (hex || '#000000').replace('#', '').trim();
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16) || 0;
    let r = ((num >> 16) & 255) / 255;
    let g = ((num >> 8) & 255) / 255;
    let b = (num & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  // Mockup images for each type
  const mockupImages = {
    sofa: 'assets/images/sofa_neutral.png',
    car: 'assets/images/car_interior.png',
    shoe: 'assets/images/oxford_shoe.png'
  };

  // Background toggle & dark color adaptive backdrop logic
  const visualizerDisplay = document.getElementById('visualizer-display');
  const bgToggleBtn = document.getElementById('visualizer-bg-toggle');
  const bgToggleIcon = document.getElementById('bg-toggle-icon');
  const bgToggleText = document.getElementById('bg-toggle-text');
  let isManualBgOverride = false;
  let isLightBgActive = false;

  function setVisualizerBgMode(isLight) {
    isLightBgActive = isLight;
    if (visualizerDisplay) {
      if (isLight) {
        visualizerDisplay.classList.add('light-bg');
        if (bgToggleIcon) bgToggleIcon.textContent = '🌙';
        if (bgToggleText) bgToggleText.textContent = 'Nền tối';
      } else {
        visualizerDisplay.classList.remove('light-bg');
        if (bgToggleIcon) bgToggleIcon.textContent = '☀️';
        if (bgToggleText) bgToggleText.textContent = 'Nền sáng';
      }
    }
  }

  if (bgToggleBtn) {
    bgToggleBtn.addEventListener('click', () => {
      isManualBgOverride = true;
      setVisualizerBgMode(!isLightBgActive);
    });
  }

  // Apply color to sofa/car/shoe mockup using CSS pixel filters on img directly
  function applySofaColor(colorHex, colorName) {
    activeColorHex = colorHex;
    const hsl = hexToHsl(colorHex);

    // Auto-detect dark color (black, charcoal, carbon, dark coffee, mahogany, etc.)
    const isDark = hsl.l <= 35;

    // Automatically switch to bright light background for dark/black colors unless user manually toggled
    if (!isManualBgOverride) {
      setVisualizerBgMode(isDark);
    }

    // Hide the rectangular overlay element to prevent background box artifacts on transparent PNGs
    if (sofaOverlay) {
      sofaOverlay.style.display = 'none';
    }

    if (sofaBaseImg) {
      // 1. Black / Dark Charcoal (#000000, #212121, #2B2B2B, #333333, #3E2723)
      if (hsl.l <= 18) {
        // Optimized brightness & contrast so seat wrinkles, seams and leather highlights are crisp on light studio background
        sofaBaseImg.style.filter = 'brightness(0.56) contrast(1.35) grayscale(1)';
      }
      else if (hsl.l <= 32 && hsl.s <= 25) {
        // Dark grey / charcoal
        sofaBaseImg.style.filter = 'brightness(0.68) contrast(1.25) grayscale(0.8)';
      }
      // 2. White / Pure Cream Light (#FFFFFF, #EAEAEA)
      else if (hsl.l >= 85 && hsl.s <= 20) {
        sofaBaseImg.style.filter = 'brightness(1.45) contrast(0.9) grayscale(1)';
      }
      // 3. Grey / Silver / Slate Neutral (#BDBDBD, #8D6E63)
      else if (hsl.s <= 15) {
        const bright = 0.4 + (hsl.l / 100) * 0.9;
        sofaBaseImg.style.filter = `brightness(${bright}) contrast(1.1) grayscale(1)`;
      }
      // 4. Chromatic Colors (Brown, Gold, Red, Navy, Sienna, Tan)
      else {
        // Calculate hue shift relative to base tan color (approx 35deg)
        const hueShift = hsl.h - 35;
        const bright = 0.7 + (hsl.l / 100) * 0.5;
        const sat = 0.8 + (hsl.s / 100) * 1.3;
        sofaBaseImg.style.filter = `sepia(0.65) hue-rotate(${hueShift}deg) saturate(${sat}) brightness(${bright}) contrast(1.05)`;
      }
    }

    // Update color label
    if (colorDotLabel) colorDotLabel.style.backgroundColor = colorHex;
    if (colorNameLabel) colorNameLabel.textContent = colorName;

    // Update texture preview strip (use lighter tint for pitch black so texture remains visible)
    if (texturePreviewInner) {
      texturePreviewInner.style.backgroundColor = (colorHex === '#000000' || colorHex === '#000') ? '#222222' : colorHex;
    }

    // Animate mockup wrapper with a subtle scale pulse
    if (sofaWrapper) {
      sofaWrapper.style.transform = 'scale(1.02)';
      setTimeout(() => {
        sofaWrapper.style.transform = 'scale(1)';
      }, 300);
    }
  }

  // Toggle Mockup Display (Sofa, Car Seat, Shoe)
  controlMockups.forEach(btn => {
    btn.addEventListener('click', (e) => {
      controlMockups.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const mockupName = e.target.dataset.mockup;
      if (sofaBaseImg && mockupImages[mockupName]) {
        sofaBaseImg.src = mockupImages[mockupName];
      }
      // Re-apply current color
      const activeSwatch = vazSwatches.querySelector('.leather-swatch-item.active');
      if (activeSwatch) {
        applySofaColor(activeSwatch.dataset.color, activeSwatch.dataset.name || '');
      }
    });
  });

  // Toggle Material Type -> Alters Swatches and Specs
  controlMaterials.forEach(btn => {
    btn.addEventListener('click', (e) => {
      controlMaterials.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      activeMaterial = e.target.dataset.type;

      // Update Spec Labels
      const data = visualizerMaterials[activeMaterial];
      document.getElementById('spec-leather-type').textContent = activeMaterial;
      document.getElementById('spec-leather-thickness').textContent = data.thickness;
      document.getElementById('spec-leather-features').textContent = data.features[currentLang];

      // Load Swatches for this specific material
      renderVisualizerSwatches(data.swatches);
      // Also update the gallery
      renderLeatherGallery(data.swatches);
    });
  });

  function renderVisualizerSwatches(swatches) {
    vazSwatches.innerHTML = '';
    swatches.forEach((swatch, idx) => {
      const sw = document.createElement('div');
      sw.className = 'leather-swatch-item' + (idx === 0 ? ' active' : '');
      sw.style.backgroundColor = swatch.color;
      sw.dataset.color = swatch.color;
      sw.dataset.name = swatch.name[currentLang];
      sw.title = swatch.name[currentLang];

      // Add tooltip
      const tooltip = document.createElement('span');
      tooltip.className = 'swatch-name-tooltip';
      tooltip.textContent = swatch.name[currentLang];
      sw.appendChild(tooltip);

      sw.addEventListener('click', () => {
        document.querySelectorAll('#vaz-swatches .leather-swatch-item').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');

        // Apply color to sofa
        applySofaColor(swatch.color, swatch.name[currentLang]);

        // Also highlight matching gallery card
        document.querySelectorAll('.leather-sample-card').forEach(card => {
          card.classList.toggle('active', card.dataset.color === swatch.color);
        });
      });

      vazSwatches.appendChild(sw);
    });

    // Apply the first swatch by default
    if (swatches.length > 0) {
      applySofaColor(swatches[0].color, swatches[0].name[currentLang]);
    }
  }

  // --- LEATHER SAMPLE GALLERY ---
  const leatherSamplesGrid = document.getElementById('leather-samples-grid');

  // Extended leather sample data with codes (inspired by similythangthanhloi.vn product catalog)
  const leatherSamplesData = {
    'Simili PVC': [
      { color: '#8B4513', name: { vi: 'Nâu Simili Classic', en: 'Classic Simili Brown' }, code: 'SPC-101' },
      { color: '#CD853F', name: { vi: 'Bò Sáng Vintage', en: 'Vintage Light Tan' }, code: 'SPC-102' },
      { color: '#D2B48C', name: { vi: 'Kem Cát Sa Mạc', en: 'Desert Sand Cream' }, code: 'SPC-103' },
      { color: '#000000', name: { vi: 'Đen Bóng Cao Cấp', en: 'Premium Glossy Black' }, code: 'SPC-104' },
      { color: '#FFFFFF', name: { vi: 'Trắng Sữa Tinh Khiết', en: 'Pure Milk White' }, code: 'SPC-105' },
      { color: '#333333', name: { vi: 'Xám Đậm Sang Trọng', en: 'Elegant Dark Grey' }, code: 'SPC-106' }
    ],
    'Da PU': [
      { color: '#c5a880', name: { vi: 'Vàng Kim Luxury', en: 'Luxury Gold' }, code: 'PU-201' },
      { color: '#4A2E1B', name: { vi: 'Nâu Cafe Đậm', en: 'Deep Coffee Brown' }, code: 'PU-202' },
      { color: '#8B5A2B', name: { vi: 'Nâu Hạt Dẻ Italia', en: 'Italian Chestnut' }, code: 'PU-203' },
      { color: '#000000', name: { vi: 'Đen Mờ Premium', en: 'Premium Matte Black' }, code: 'PU-204' },
      { color: '#EAEAEA', name: { vi: 'Trắng Kem Ngọc Trai', en: 'Pearl Cream White' }, code: 'PU-205' },
      { color: '#A0522D', name: { vi: 'Đỏ Sienna Cổ Điển', en: 'Classic Sienna Red' }, code: 'PU-206' }
    ],
    'Da PVC': [
      { color: '#2B2B2B', name: { vi: 'Đen Than Ô Tô', en: 'Automotive Charcoal' }, code: 'PVC-301' },
      { color: '#5C4033', name: { vi: 'Nâu Đậm Nội Thất', en: 'Interior Dark Brown' }, code: 'PVC-302' },
      { color: '#D2B48C', name: { vi: 'Kem Bọc Ghế Sofa', en: 'Sofa Seat Cream' }, code: 'PVC-303' },
      { color: '#800000', name: { vi: 'Đỏ Đô Royal', en: 'Royal Maroon' }, code: 'PVC-304' },
      { color: '#1A303A', name: { vi: 'Xanh Navy Thượng Hạng', en: 'Premium Navy Blue' }, code: 'PVC-305' }
    ],
    'Microfiber': [
      { color: '#3E2723', name: { vi: 'Nâu Gụ Hạng Sang', en: 'Premium Mahogany' }, code: 'MF-401' },
      { color: '#4E342E', name: { vi: 'Nâu Đất Siêu Mịn', en: 'Ultra-smooth Earth Brown' }, code: 'MF-402' },
      { color: '#212121', name: { vi: 'Đen Carbon Luxury', en: 'Luxury Carbon Black' }, code: 'MF-403' },
      { color: '#BDBDBD', name: { vi: 'Ghi Xám Bạc', en: 'Silver Light Grey' }, code: 'MF-404' },
      { color: '#8D6E63', name: { vi: 'Nâu Khói Mộc Mạc', en: 'Rustic Smoky Brown' }, code: 'MF-405' }
    ]
  };

  function renderLeatherGallery(swatches) {
    if (!leatherSamplesGrid) return;

    const samples = leatherSamplesData[activeMaterial] || swatches.map((s, i) => ({
      ...s,
      code: `${activeMaterial.replace(/\s/g, '-')}-${String(i+1).padStart(3, '0')}`
    }));

    leatherSamplesGrid.innerHTML = '';

    samples.forEach((sample, idx) => {
      const card = document.createElement('div');
      card.className = 'leather-sample-card' + (idx === 0 ? ' active' : '');
      card.dataset.color = sample.color;

      card.innerHTML = `
        <div class="leather-sample-img" style="background-image: url('assets/images/leather_swatch_texture.png'); background-color: ${sample.color};"></div>
        <span class="leather-sample-badge">${sample.code}</span>
        <div class="leather-sample-info">
          <div class="leather-sample-name">${sample.name[currentLang]}</div>
          <div class="leather-sample-code">${activeMaterial} • ${sample.code}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        // Highlight this card
        document.querySelectorAll('.leather-sample-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Apply to sofa
        applySofaColor(sample.color, sample.name[currentLang]);

        // Also highlight matching swatch
        document.querySelectorAll('#vaz-swatches .leather-swatch-item').forEach(s => {
          s.classList.toggle('active', s.dataset.color === sample.color);
        });

        // Smooth scroll to visualizer
        document.getElementById('visualizer-display').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      leatherSamplesGrid.appendChild(card);
    });
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
        showToast(t('toast.submitSuccess'), 'success');
        requestForm.reset();
        document.getElementById('colorInterest').value = t('request.form.color.default');
      } else {
        throw new Error(result.message || 'Lỗi lưu thông tin');
      }
    } catch (err) {
      console.error(err);
      showToast(t('toast.submitError'), 'error');
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
  fetchProducts().then(applyTranslations);
  renderVisualizerSwatches(visualizerMaterials[activeMaterial].swatches);
  renderLeatherGallery(visualizerMaterials[activeMaterial].swatches);
  applyTranslations();

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
