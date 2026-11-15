const { test, expect } = require('@playwright/test');
const cases = require('../data/FR-06.json');
const { attachRunBy, parseMoney } = require('../helpers/common');

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
        await expect(page).toHaveURL(new RegExp(`/product/${c.productId}$`));
        await expect(page.locator('h1')).toHaveText(c.name);
        return;
      }

      await page.goto(`/product/${c.productId}`);
      await expect(page.locator('h1')).toBeVisible();

      if (c.expected === 'product-detail') {
        await expect(page.locator('h1')).toHaveText(c.name);
        const priceText = await page.locator('p.text-red-600').textContent();
        expect(parseMoney(priceText)).toBe(c.price);
        await expect(page.getByText(c.description, { exact: true })).toBeVisible();
        await expect(page.locator('main img')).toHaveAttribute('alt', c.name);
      } else if (c.expected === 'category-visible') {
        await expect(page.getByText(c.category)).toBeVisible();
      } else if (c.expected === 'default-quantity') {
        const qtyInput = page.locator('label:has-text("Số lượng:") + input');
        await expect(qtyInput).toHaveValue(c.expectedQuantity);
      } else if (c.expected === 'quantity-min-attr') {
        const qtyInput = page.locator('label:has-text("Số lượng:") + input');
        await expect(qtyInput).toHaveAttribute('min', c.expectedMin);
      } else if (c.expected === 'added-feedback') {
        const qtyInput = page.locator('label:has-text("Số lượng:") + input');
        await qtyInput.fill(String(c.quantity));
        const addBtn = page.getByRole('button', { name: /Thêm vào giỏ hàng|Đã thêm/ });
        await addBtn.click();
        await expect(addBtn).toHaveText('Đã thêm');
      } else if (c.expected === 'cart-updated') {
        const qtyInput = page.locator('label:has-text("Số lượng:") + input');
        await qtyInput.fill(String(c.quantity));
        await page.getByRole('button', { name: 'Thêm vào giỏ hàng' }).click();
        await page.getByRole('link', { name: 'Giỏ hàng' }).click();
        const rows = page.locator('tbody tr');
        await expect(rows).toHaveCount(c.expectedRows);
        await expect(rows.first().locator('td').nth(2)).toHaveText(c.expectedCartQty);
      } else if (c.expected === 'cart-empty') {
        const qtyInput = page.locator('label:has-text("Số lượng:") + input');
        await qtyInput.fill(String(c.quantity));
        await page.getByRole('button', { name: 'Thêm vào giỏ hàng' }).click();
        await page.getByRole('link', { name: 'Giỏ hàng' }).click();
        await expect(page.getByText('Giỏ hàng của bạn đang trống')).toBeVisible();
      }
    });
  }
});
