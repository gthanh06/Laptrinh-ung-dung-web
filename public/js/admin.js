document.addEventListener('DOMContentLoaded', () => {
  const BACKEND_URL = '';
  let token = localStorage.getItem('adminToken');

  // Elements
  const loginScreen = document.getElementById('login-screen');
  const dashboard = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('logout-btn');
  
  const requestsTableBody = document.getElementById('requests-table-body');
  const productsTableBody = document.getElementById('products-table-body');

  const menuBtnRequests = document.getElementById('menu-btn-requests');
  const menuBtnProducts = document.getElementById('menu-btn-products');
  const tabRequests = document.getElementById('tab-requests');
  const tabProducts = document.getElementById('tab-products');

  const btnOpenCreateProd = document.getElementById('btn-open-create-prod');
  const productFormModal = document.getElementById('product-form-modal');
  const closeProdFormModal = document.getElementById('close-prod-form-modal');
  const productCrudForm = document.getElementById('product-crud-form');
  const productFormTitle = document.getElementById('product-form-title');
  const crudProdId = document.getElementById('crud-prod-id');
  const crudImage = document.getElementById('crud-image');
  const crudImagePreview = document.getElementById('crud-image-preview');
  const crudImagePreviewPlaceholder = document.getElementById('crud-image-preview-placeholder');

  const dbIndicatorDot = document.getElementById('db-indicator-dot');
  const dbIndicatorText = document.getElementById('db-indicator-text');

  // --- NOTIFICATION TOAST ---
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // --- CHECK LOGIN STATE ---
  if (token) {
    showDashboard();
  } else {
    showLogin();
  }

  function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'flex';
    fetchRequests();
    fetchProducts();
    checkDatabaseConnection();
  }

  function showLogin() {
    loginScreen.style.display = 'flex';
    dashboard.style.display = 'none';
    localStorage.removeItem('adminToken');
    token = null;
  }

  // --- DATABASE STATUS INDICATOR ---
  async function checkDatabaseConnection() {
    try {
      // We will define a simple endpoint /api/db-status on the server
      const res = await fetch(`${BACKEND_URL}/api/db-status`);
      if (res.ok) {
        const status = await res.json();
        if (status.dbConnected) {
          dbIndicatorDot.className = 'db-dot connected';
          dbIndicatorText.textContent = 'Cloud: MongoDB Atlas';
          dbIndicatorText.title = 'Đang đồng bộ dữ liệu đám mây thời gian thực';
        } else {
          dbIndicatorDot.className = 'db-dot';
          dbIndicatorText.textContent = 'Local: JSON File';
          dbIndicatorText.title = 'Mất kết nối đám mây, sử dụng bộ nhớ cục bộ dự phòng';
        }
      }
    } catch (err) {
      console.warn('Không thể kiểm tra trạng thái DB:', err);
      // Fallback display
      dbIndicatorDot.className = 'db-dot';
      dbIndicatorText.textContent = 'Offline Fallback';
    }
  }

  // --- LOGIN SUBMIT ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        token = result.token;
        localStorage.setItem('adminToken', token);
        showToast('🔓 Đăng nhập thành công! Chào mừng Quản trị viên.', 'success');
        showDashboard();
      } else {
        showToast(result.message || 'Sai tài khoản hoặc mật khẩu.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('⚠️ Không thể kết nối với Backend.', 'error');
    }
  });

  // --- LOGOUT ---
  logoutBtn.addEventListener('click', () => {
    showToast('🚪 Đã đăng xuất khỏi phiên làm việc.');
    showLogin();
  });

  // --- TAB MENU SWITCHING ---
  const menuButtons = [menuBtnRequests, menuBtnProducts];
  const tabs = [tabRequests, tabProducts];

  menuButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      menuButtons.forEach(b => b.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));

      e.target.classList.add('active');
      const activeTabId = 'tab-' + e.target.dataset.tab;
      document.getElementById(activeTabId).classList.add('active');

      if (e.target.dataset.tab === 'requests') {
        fetchRequests();
      } else {
        fetchProducts();
      }
    });
  });

  // --- FETCH REQUESTS LIST ---
  async function fetchRequests() {
    requestsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Đang tải danh sách đơn đăng ký mẫu...</td></tr>';
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401 || response.status === 403) {
        showToast('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
        showLogin();
        return;
      }

      if (!response.ok) throw new Error('Không thể tải danh sách đơn');
      const data = await response.json();
      renderRequestsTable(data);
    } catch (error) {
      console.error(error);
      showToast('Lỗi khi tải dữ liệu đơn đăng ký mẫu.', 'error');
      requestsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #e74c3c;">Lỗi kết nối máy chủ backend.</td></tr>';
    }
  }

  function renderRequestsTable(requests) {
    requestsTableBody.innerHTML = '';
    
    if (requests.length === 0) {
      requestsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px 0;">Không có đơn đăng ký mẫu nào trong hệ thống.</td></tr>';
      return;
    }

    requests.forEach(req => {
      const tr = document.createElement('tr');
      
      const dateFormatted = new Date(req.createdAt).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      let badgeClass = 'badge-pending';
      if (req.status === 'Đã duyệt') badgeClass = 'badge-approved';
      if (req.status === 'Đã gửi mẫu') badgeClass = 'badge-shipped';
      if (req.status === 'Từ chối') badgeClass = 'badge-rejected';

      tr.innerHTML = `
        <td style="font-weight:600;">${req.fullName}</td>
        <td>
          <a href="tel:${req.phone}" style="color: var(--primary); text-decoration: underline;">${req.phone}</a>
          ${req.email ? `<br><small style="color: var(--text-muted);">${req.email}</small>` : ''}
        </td>
        <td style="max-width: 250px; font-size: 0.85rem;">${req.address}</td>
        <td><strong style="color: var(--primary);">${req.leatherType}</strong></td>
        <td style="font-size: 0.85rem; max-width: 200px; color: var(--text-muted);">${req.notes || '<em>Không có ghi chú</em>'}</td>
        <td style="font-size: 0.8rem;">${dateFormatted}</td>
        <td>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <span class="status-badge ${badgeClass}">${req.status}</span>
            <select class="status-select" data-id="${req._id || req.id}">
              <option value="Chờ duyệt" ${req.status === 'Chờ duyệt' ? 'selected' : ''}>Chờ duyệt</option>
              <option value="Đã duyệt" ${req.status === 'Đã duyệt' ? 'selected' : ''}>Duyệt đơn</option>
              <option value="Đã gửi mẫu" ${req.status === 'Đã gửi mẫu' ? 'selected' : ''}>Đã gửi mẫu</option>
              <option value="Từ chối" ${req.status === 'Từ chối' ? 'selected' : ''}>Từ chối</option>
            </select>
          </div>
        </td>
      `;
      
      // Bind status changer
      tr.querySelector('.status-select').addEventListener('change', async (e) => {
        const reqId = e.target.dataset.id;
        const newStatus = e.target.value;
        await updateRequestStatus(reqId, newStatus);
      });

      requestsTableBody.appendChild(tr);
    });
  }

  async function updateRequestStatus(id, status) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const result = await response.json();
      if (response.ok) {
        showToast('✅ Cập nhật trạng thái đơn thành công!', 'success');
        fetchRequests();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi khi cập nhật trạng thái đơn.', 'error');
    }
  }

  // --- FETCH PRODUCTS LIST FOR CRUD ---
  async function fetchProducts() {
    productsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Đang tải danh sách mẫu da...</td></tr>';
    try {
      const response = await fetch(`${BACKEND_URL}/api/products`);
      if (!response.ok) throw new Error('Không thể lấy danh sách sản phẩm');
      const products = await response.json();
      renderProductsTable(products);
    } catch (error) {
      console.error(error);
      productsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #e74c3c;">Lỗi kết nối máy chủ lấy danh sách sản phẩm.</td></tr>';
    }
  }

  function renderProductsTable(products) {
    productsTableBody.innerHTML = '';
    
    if (products.length === 0) {
      productsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px 0;">Không có sản phẩm nào trong hệ thống.</td></tr>';
      return;
    }

    products.forEach(prod => {
      const tr = document.createElement('tr');
      const colorsMarkup = prod.colors.map(color => 
        `<span style="display:inline-block; width:14px; height:14px; border-radius:50%; background-color:${color}; border:1px solid rgba(255,255,255,0.2); vertical-align:middle; margin-right:4px;" title="${color}"></span>`
      ).join('');

      tr.innerHTML = `
        <td style="font-weight:600; color: var(--text-main);">${prod.name}</td>
        <td><span class="status-badge" style="background: rgba(197,168,128,0.08); border:1px solid var(--primary); color:var(--primary);">${prod.type}</span></td>
        <td>${prod.thickness}</td>
        <td>${colorsMarkup}</td>
        <td><strong style="color: var(--primary);">${prod.price}</strong></td>
        <td>
          <button class="btn-action-sm btn-edit" data-id="${prod._id || prod.id}">Sửa</button>
          <button class="btn-action-sm btn-delete" data-id="${prod._id || prod.id}">Xóa</button>
        </td>
      `;

      // Event handlers for Edit/Delete
      tr.querySelector('.btn-edit').addEventListener('click', () => openEditProductForm(prod));
      tr.querySelector('.btn-delete').addEventListener('click', () => deleteProduct(prod._id || prod.id, prod.name));

      productsTableBody.appendChild(tr);
    });
  }

  // --- CRUD OPERATIONS ---

  // Open Form for CREATE new product
  btnOpenCreateProd.addEventListener('click', () => {
    productCrudForm.reset();
    crudProdId.value = ''; // empty means create mode
    productFormTitle.textContent = 'Thêm Mẫu Da Mới';
    crudImagePreview.src = '';
    crudImagePreview.style.display = 'none';
    crudImagePreviewPlaceholder.style.display = 'block';
    crudImagePreviewPlaceholder.textContent = 'Chưa có ảnh';
    productFormModal.showModal();
  });

  // Open Form for EDIT product
  function openEditProductForm(prod) {
    productCrudForm.reset();
    crudProdId.value = prod._id || prod.id; // set ID to trigger edit mode
    productFormTitle.textContent = 'Chỉnh Sửa Thông Tin Sản Phẩm';

    document.getElementById('crud-name').value = prod.name;
    document.getElementById('crud-type').value = prod.type;
    document.getElementById('crud-thickness').value = prod.thickness;
    document.getElementById('crud-price').value = prod.price;
    document.getElementById('crud-colors').value = prod.colors.join(',');
    document.getElementById('crud-applications').value = prod.applications.join(',');
    document.getElementById('crud-features').value = prod.features.join(',');
    document.getElementById('crud-desc').value = prod.description;

    // Load existing image preview if any
    if (prod.imageUrl) {
      crudImagePreview.src = prod.imageUrl;
      crudImagePreview.style.display = 'block';
      crudImagePreviewPlaceholder.style.display = 'none';
    } else {
      crudImagePreview.src = '';
      crudImagePreview.style.display = 'none';
      crudImagePreviewPlaceholder.style.display = 'block';
      crudImagePreviewPlaceholder.textContent = 'Chưa có ảnh';
    }

    productFormModal.showModal();
  }

  closeProdFormModal.addEventListener('click', () => productFormModal.close());
  productFormModal.addEventListener('click', (e) => {
    if (e.target === productFormModal) productFormModal.close();
  });

  // Live image preview selection change handler
  crudImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        crudImagePreview.src = event.target.result;
        crudImagePreview.style.display = 'block';
        crudImagePreviewPlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      crudImagePreview.src = '';
      crudImagePreview.style.display = 'none';
      crudImagePreviewPlaceholder.style.display = 'block';
      crudImagePreviewPlaceholder.textContent = 'Chưa có ảnh';
    }
  });

  // CRUD Form Submit (Creates or Updates)
  productCrudForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = crudProdId.value;
    const name = document.getElementById('crud-name').value;
    const type = document.getElementById('crud-type').value;
    const thickness = document.getElementById('crud-thickness').value;
    const price = document.getElementById('crud-price').value;
    const colors = document.getElementById('crud-colors').value;
    const applications = document.getElementById('crud-applications').value;
    const features = document.getElementById('crud-features').value;
    const description = document.getElementById('crud-desc').value;

    // Use FormData to allow file uploads (multipart/form-data)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('thickness', thickness);
    formData.append('price', price);
    formData.append('colors', colors);
    formData.append('applications', applications);
    formData.append('features', features);
    formData.append('description', description);

    if (crudImage.files[0]) {
      formData.append('image', crudImage.files[0]);
    }

    const isEdit = !!id;
    const url = isEdit ? `${BACKEND_URL}/api/admin/products/${id}` : `${BACKEND_URL}/api/admin/products`;
    // We send PUT or POST. Note that some older platforms prefer POST for FormData, 
    // but modern fetch natively supports PUT with FormData perfectly.
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          // IMPORTANT: Do NOT set Content-Type header when sending FormData!
          // Browser will automatically set it to multipart/form-data with correct boundary.
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        showToast(`✅ ${isEdit ? 'Chỉnh sửa' : 'Thêm'} sản phẩm thành công!`, 'success');
        productFormModal.close();
        fetchProducts();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi lưu dữ liệu sản phẩm.', 'error');
    }
  });

  // Delete Product Action
  async function deleteProduct(id, name) {
    if (!confirm(`Bạn có chắc chắn muốn xóa mẫu da "${name}"? Thao tác này không thể hoàn tác.`)) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      if (response.ok) {
        showToast('✅ Xóa sản phẩm thành công!', 'success');
        fetchProducts();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi thực hiện xóa sản phẩm.', 'error');
    }
  }
});
