const { test, expect } = require('@playwright/test');
const cases = require('../data/FR-08.json');
const { attachRunBy, loginWebUser, addProductFromHome } = require('../helpers/common');

test.describe('FR-08: Checkout', () => {
  test.beforeEach(async ({}, testInfo) => {
    attachRunBy(testInfo);
  });

  for (const c of cases) {
    test(`${c.id} - ${c.title}`, async ({ page }) => {
      if (c.requireLogin) {
        await loginWebUser(page);
      } else {
        await page.goto('/');
      }

      for (const productName of c.products) {
        await addProductFromHome(page, productName);
      }

      await page.getByRole('link', { name: 'Giỏ hàng' }).click();

      if (c.expected === 'unauth-redirect') {
        page.once('dialog', async (dialog) => {
          await dialog.accept();
        });
        await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
        await expect(page).toHaveURL(/\/login$/);
        return;
      }

      await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
      await expect(page).toHaveURL(/\/checkout$/);

      if (c.editTotalTo !== undefined) {
        const totalInput = page.locator('label:has-text("Tổng tiền thanh toán") + input');
        await totalInput.fill(c.editTotalTo);
      }

      if (
        c.expected === 'checkout-success' ||
        c.expected === 'cart-cleared' ||
        c.expected === 'order-in-profile' ||
        c.expected === 'tamper-recalculated'
      ) {
        await page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click();
        await expect(page.getByText('Thanh toán thành công!')).toBeVisible();
      }
    });
  }
});
