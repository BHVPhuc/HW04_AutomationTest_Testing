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
      const rows = page.locator('tbody tr');

      if (c.expected === 'initial-list') {
        await expect(rows).toHaveCount(c.expectedCount);
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
        await expect(rows.filter({ hasText: c.seedName })).toBeVisible();
      }

      if (c.expected === 'edit-form-prefilled') {
        const row = rows.filter({ hasText: c.seedName });
        await row.getByRole('button', { name: 'Sửa' }).click();
        await expect(page.getByRole('heading', { name: c.expectedFormTitle })).toBeVisible();
        await expect(page.getByPlaceholder('Tên sản phẩm')).toHaveValue(c.seedName);
        await expect(page.getByPlaceholder('Giá tiền')).toHaveValue(c.seedPrice);
        return;
      }

      if (c.expected === 'edit-isolated') {
        const row = rows.filter({ hasText: c.seedName });
        await row.getByRole('button', { name: 'Sửa' }).click();
        await page.getByPlaceholder('Tên sản phẩm').fill(c.newName);
        const dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
          const msg = dialog.message();
          await dialog.accept();
          return msg;
        });
        await page.getByRole('button', { name: 'Lưu sản phẩm' }).click();
        const dialogMsg = await dialogPromise;
        expect(dialogMsg).toContain('Cập nhật thành công');
        await expect(rows.filter({ hasText: c.newName }).first()).toBeVisible();
        await expect(rows.filter({ hasText: c.preservedSeedName })).toBeVisible();
        return;
      }

      if (c.expected === 'delete-success') {
        const row = rows.filter({ hasText: c.seedName });
        await row.getByRole('button', { name: 'Xóa' }).click();
        await expect(rows.filter({ hasText: c.seedName })).toHaveCount(0);
        await expect(rows).toHaveCount(c.expectedCount);
        return;
      }

      const productName = resolveName(c);
      await page.getByPlaceholder('Tên sản phẩm').fill(productName);
      await page.getByPlaceholder('Giá tiền').fill(c.price);
      if (c.imageUrl) await page.getByPlaceholder('URL Ảnh').fill(c.imageUrl);
      if (c.description) await page.getByPlaceholder('Mô tả').fill(c.description);
      if (c.category) await page.locator('form select').selectOption({ label: c.category });

      if (c.expected === 'missing-name') {
        await page.getByRole('button', { name: 'Lưu sản phẩm' }).click();
        const isMissing = await page.getByPlaceholder('Tên sản phẩm').evaluate((el) => el.validity.valueMissing);
        expect(isMissing).toBe(true);
        await expect(rows).toHaveCount(c.expectedCount);
      } else if (c.expected === 'create-success') {
        await page.getByRole('button', { name: 'Lưu sản phẩm' }).click();
        const createdRow = rows.filter({ hasText: productName });
        await expect(createdRow).toBeVisible();
        await expect(createdRow.locator('td').nth(2)).toHaveText(`${c.price} ₫`);
        await expect(rows).toHaveCount(c.expectedCount);
        const res = await request.get(`${API_URL}/products`);
        const list = await res.json();
        expect(list.some((p) => p.name === productName)).toBe(true);
      } else if (c.expected === 'create-rejected') {
        const postPromise = page
          .waitForResponse((r) => r.url().includes('/api/products') && r.request().method() === 'POST', { timeout: 1500 })
          .catch(() => null);
        await page.getByRole('button', { name: 'Lưu sản phẩm' }).click();
        await postPromise;
        const res = await request.get(`${API_URL}/products`);
        const list = await res.json();
        expect(list.length).toBe(c.expectedCount);
        await expect(rows).toHaveCount(c.expectedCount);
      }
    });
  }
});
