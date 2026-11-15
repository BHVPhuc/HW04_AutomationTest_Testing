const { test, expect } = require('@playwright/test');
const cases = require('../data/FR-15.json');
const {
  API_URL,
  attachRunBy,
  loginAdmin,
  cleanupTestProducts,
} = require('../helpers/common');

function resolveName(c) {
  if (c.nameLength) {
    return 'A'.repeat(c.nameLength);
  }
  return c.name ?? '';
}

test.describe('FR-15: Product CRUD (Admin)', () => {
  test.beforeEach(async ({ page, request }, testInfo) => {
    attachRunBy(testInfo);
    await cleanupTestProducts(request);
    await loginAdmin(page, 'Sản phẩm');
  });

  test.afterAll(async ({ request }) => {
    await cleanupTestProducts(request);
  });

  for (const c of cases) {
    test(`${c.id} - ${c.title}`, async ({ page, request }) => {
      if (c.expected === 'initial-list') {
        await expect(page.locator('tbody tr')).toHaveCount(c.expectedCount);
        return;
      }

      if (c.seedName) {
        await request.post(`${API_URL}/products`, {
          data: {
            name: c.seedName,
            price: c.seedPrice,
            description: 'Seed test',
            imageUrl: 'https://placehold.co/200',
            category_id: 3,
          },
        });
        await page.reload();
        await page.getByText('Sản phẩm', { exact: true }).click();
      }

      if (c.expected === 'edit-form-prefilled' || c.expected === 'edit-isolated') {
        const row = page.locator('tbody tr', { hasText: c.seedName });
        await row.getByRole('button', { name: 'Sửa' }).click();
        if (c.expected === 'edit-isolated') {
          await page.getByPlaceholder('Tên sản phẩm').fill(c.newName);
          page.once('dialog', async (d) => d.accept());
          await page.getByRole('button', { name: 'Lưu sản phẩm' }).click();
        }
        return;
      }

      if (c.expected === 'delete-success') {
        const row = page.locator('tbody tr', { hasText: c.seedName });
        await row.getByRole('button', { name: 'Xóa' }).click();
        return;
      }

      const productName = resolveName(c);
      await page.getByPlaceholder('Tên sản phẩm').fill(productName);
      await page.getByPlaceholder('Giá tiền').fill(c.price);
      if (c.imageUrl) await page.getByPlaceholder('URL Ảnh').fill(c.imageUrl);
      if (c.description) await page.getByPlaceholder('Mô tả').fill(c.description);
      if (c.category) await page.locator('form select').selectOption({ label: c.category });
      await page.getByRole('button', { name: 'Lưu sản phẩm' }).click();
    });
  }
});
