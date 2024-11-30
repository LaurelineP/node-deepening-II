// @ts-check
const { test, expect } = require('@playwright/test');
const { describe, beforeEach } = test;
const URL = 'http://localhost:8080';

describe('Home / Overview page', () => {
	beforeEach(async({ page }) => {
		await page.goto(URL);
	})

	test('should display a list of products', async ({ page }) => {
		const productCards = await page.locator('.card');
		await expect(productCards).toHaveCount(5);
	})

	test('should navigate to a product on clicking on the clickable area', async ({ page }) => {
		await page.locator('.card .card__link').nth(0).click();
		await expect(page).toHaveURL(/product(\?id=\d|\/\w)?/);
	})
});

describe('Product page', () => {
	beforeEach(async ({ page }) => {
		await page.goto(`${URL}/product?id=0`);
	})

	test('should have a go back button', async ({ page }) => {
		const goBack = await page.locator('.product__back');
		await expect(goBack).toBeVisible();
		await expect(goBack).toHaveAttribute('href', '/')
	})

	test('should have header', async ({ page }) => {
		const headerProduct = await page.locator('h1');
		await expect(headerProduct).toBeVisible();
	})

	test('should have isOrganic', async ({ page }) => {
		const productFrom = await page.getByTestId('isOrganic');
		await expect(productFrom).toBeVisible();
	})

	test('should have "from" detail', async ({ page }) => {
		const productFrom = await page.getByTestId('from');
		await expect(productFrom).toBeVisible();
	})

	test('should have "nutrients" detail', async ({ page }) => {
		const productNutrients = await page.getByTestId('nutrients');
		await expect(productNutrients).toBeVisible();
	})

	test('should have "quantity" detail', async ({ page }) => {
		const productQuantity = await page.getByTestId('quantity');
		await expect(productQuantity).toBeVisible();
	})

	test('should have "price" detail', async ({ page }) => {
		const productPrice = await page.getByTestId('price');
		await expect(productPrice).toBeVisible();
	})


	test('should have "description" detail', async ({ page }) => {
		const productDescription = await page.getByTestId('description');
		await expect(productDescription).toBeVisible();
	})
})