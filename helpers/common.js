const STUDENT_ID = '23120328';
const API_URL = 'http://localhost:3000/api';
const WEB_URL = 'http://localhost:5173';
const ADMIN_URL = 'http://localhost:5174';

/**
 * Attach student ID and ISO timestamp annotation to each test in HTML reports.
 */
function attachRunBy(testInfo) {
  testInfo.annotations.push({
    type: 'Run by',
    description: `${STUDENT_ID} @ ${new Date().toISOString()}`,
  });
}

/**
 * Strip non-numeric characters (keeping optional leading minus) from formatted currency text.
 */
function parseMoney(text) {
  const cleaned = String(text || '').replace(/[^\d-]/g, '');
  return cleaned === '' ? NaN : Number(cleaned);
}

/**
 * Log in to EShop Web UI using the test user account.
 */
async function loginWebUser(page, email = 'test@eshop.com', password = 'Test1234!') {
  await page.goto(`${WEB_URL}/login`);
  await page.locator('label:has-text("Username") + input').fill(email);
  await page.locator('label:has-text("Mật khẩu") + input').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByText('Chào, Test User').waitFor({ state: 'visible' });
}

/**
 * Log in to EShop Admin UI and open a target tab.
 */
async function loginAdmin(page, tabName = 'Sản phẩm', email = 'admin@eshop.com', password = 'Admin123!') {
  await page.goto(ADMIN_URL);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('EShop Admin').waitFor({ state: 'visible' });
  if (tabName) {
    await page.getByText(tabName, { exact: true }).click();
  }
}

/**
 * Add a product to cart from the home page without reloading (preserves React cart state).
 */
async function addProductFromHome(page, productName) {
  const card = page.locator('div.border', { hasText: productName });
  await card.getByRole('button', { name: 'Thêm vào giỏ' }).click();
}

/**
 * Authenticate via API and return token + user object.
 */
async function loginApi(request, email, password) {
  const res = await request.post(`${API_URL}/login`, {
    data: { email, password },
  });
  return res.json();
}

/**
 * Remove any non-seed products (id > 5) before/after FR-15 tests.
 */
async function cleanupTestProducts(request) {
  const res = await request.get(`${API_URL}/products`);
  const products = await res.json();
  for (const p of products) {
    if (p.id > 5) {
      await request.delete(`${API_URL}/products/${p.id}`);
    }
  }
}

/**
 * Fetch current orders of the logged-in user sorted newest-first (by backend).
 */
async function getMyOrders(request, token) {
  const res = await request.get(`${API_URL}/orders/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

module.exports = {
  STUDENT_ID,
  API_URL,
  WEB_URL,
  ADMIN_URL,
  attachRunBy,
  parseMoney,
  loginWebUser,
  loginAdmin,
  addProductFromHome,
  loginApi,
  cleanupTestProducts,
  getMyOrders,
};
