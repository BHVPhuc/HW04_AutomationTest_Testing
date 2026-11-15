const { test, expect } = require('@playwright/test');
const cases = require('../data/FR-08.json');
const {
  attachRunBy,
  parseMoney,
  loginWebUser,
  addProductFromHome,
  loginApi,
  getMyOrders,
} = require('../helpers/common');

test.describe('FR-08: Checkout', () => {
  test.beforeEach(async ({}, testInfo) => {
    attachRunBy(testInfo);
  });

  for (const c of cases) {
    test(`${c.id} - ${c.title}`, async ({ page, request }) => {
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
        let dialogMsg = '';
        page.once('dialog', async (dialog) => {
          dialogMsg = dialog.message();
          await dialog.accept();
        });
        await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
        expect(dialogMsg).toContain('Bạn cần đăng nhập');
        await expect(page).toHaveURL(/\/login$/);
        return;
      }

      await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
      await expect(page).toHaveURL(/\/checkout$/);

      const totalInput = page.locator('label:has-text("Tổng tiền thanh toán") + input');
      if (c.editTotalTo !== undefined) {
        await totalInput.fill(c.editTotalTo);
      }

      if (c.expected === 'checkout-heading') {
        await expect(page.getByRole('heading', { name: c.expectedHeading })).toBeVisible();
      } else if (c.expected === 'checkout-item-text') {
        await expect(page.locator('ul li', { hasText: c.expectedItemText })).toBeVisible();
      } else if (c.expected === 'checkout-item-count') {
        await expect(page.locator('ul li')).toHaveCount(c.expectedItemCount);
      } else if (c.expected === 'checkout-total') {
        const totalText = await page.locator('span:has-text("Tổng thanh toán:")').textContent();
        expect(parseMoney(totalText)).toBe(c.expectedTotal);
      } else if (c.expected === 'total-not-editable') {
        await expect(totalInput).not.toBeEditable();
      } else {
        await page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click();
        await expect(page.getByRole('heading', { name: 'Thanh toán thành công!' })).toBeVisible();

        if (c.expected === 'cart-cleared') {
          await page.getByRole('link', { name: 'Giỏ hàng' }).click();
          await expect(page.getByText('Giỏ hàng của bạn đang trống')).toBeVisible();
        } else if (c.expected === 'order-in-profile') {
          const auth = await loginApi(request, 'test@eshop.com', 'Test1234!');
          const orders = await getMyOrders(request, auth.token);
          const latestOrder = orders[0];
          await page.getByText('Chào, Test User').click();
          await expect(page).toHaveURL(/\/profile$/);
          const orderRow = page.locator('tbody tr', { hasText: `#${latestOrder.id}` });
          await expect(orderRow).toBeVisible();
          await expect(orderRow.locator('td').nth(3)).toHaveText(c.expectedStatus);
          const orderTotalText = await orderRow.locator('td').nth(2).textContent();
          expect(parseMoney(orderTotalText)).toBe(c.expectedTotal);
        } else if (c.expected === 'tamper-recalculated') {
          const auth = await loginApi(request, 'test@eshop.com', 'Test1234!');
          const orders = await getMyOrders(request, auth.token);
          const latestOrder = orders[0];
          expect(Number(latestOrder.total_amount)).toBe(c.expectedTotal);
        }
      }
    });
  }
});
