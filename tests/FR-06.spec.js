const { test, expect } = require('@playwright/test');
const cases = require('../data/FR-06.json');
const { attachRunBy } = require('../helpers/common');

test.describe('FR-06: Product Detail', () => {
  test.beforeEach(async ({}, testInfo) => {
    attachRunBy(testInfo);
  });

  for (const c of cases) {
    test(`${c.id} - ${c.title}`, async ({ page }) => {
      if (c.expected === 'navigate-from-home') {
        await page.goto('/');
        const card = page.locator('div.border', { hasText: c.name });
        await card.getByRole('link', { name: 'Xem chi tiết' }).click();
        await expect(page.locator('h1')).toBeVisible();
        return;
      }

      await page.goto(`/product/${c.productId}`);
      await expect(page.locator('h1')).toBeVisible();

      if (c.expected === 'added-feedback' || c.expected === 'cart-updated' || c.expected === 'cart-empty') {
        const qtyInput = page.locator('label:has-text("Số lượng:") + input');
        if (c.quantity !== undefined) {
          await qtyInput.fill(String(c.quantity));
        }
        await page.getByRole('button', { name: 'Thêm vào giỏ hàng' }).click();
        if (c.expected === 'cart-updated' || c.expected === 'cart-empty') {
          await page.getByRole('link', { name: 'Giỏ hàng' }).click();
        }
      }
    });
  }
});
