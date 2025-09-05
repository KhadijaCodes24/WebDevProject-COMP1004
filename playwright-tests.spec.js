import exp from 'constants';

const { test, expect} = require('@playwright/test');

const websiteURL = 'http://127.0.0.1:5500/people-search.html';

test.beforeEach(async ({ page }) => {
   await page.goto(websiteURL);
});

// TEST 1 - Owner Already Exists, all conditions tested by this test are mentioned below in comments.

test ('Owner Already Exists', async ({page}) => {
   await page.getByRole('link', { name: 'Add a vehicle' }).click();

   // Ensures Check owner is disabled at the start of the test when no information is entered
   await page.getByRole('button', { name: 'Check owner' }).isDisabled();

   // Enters an owner name but no information for the vehicle – expects an Error message
   await page.locator('#owner').fill('rachel smi')
   await page.getByRole('button', { name: 'Check owner' }).click();
   await expect(page.locator('#message-vehicle')).toContainText('Error');

   // Enters information of an owner that already exists in the database (An owner that can be selected) 
   // expects a Select owner button 
   // Checks case sensitivity by using a partial name – e.g “rach smi”
   await page.locator('#rego').fill('LKJ23UO')
   await page.locator('#make').fill('Porsche')
   await page.locator('#model').fill('Taycan')
   await page.locator('#colour').fill('white')
   await expect(page.getByRole('button', { name: 'Check owner' })).toBeVisible()
   await page.getByRole('button', { name: 'Check owner' }).click();
   await expect(page.getByRole('button', { name: 'Select owner' })).toBeVisible()
   await page.getByRole('button', { name: 'Select owner' }).click();

   // Expects a “Vehicle added successfully” message.
   await expect(page.locator('#message-vehicle')).toContainText('Vehicle added successfully')

   //Uses Vehicle Search to ensure the vehicle has been added
   await page.getByRole('link', { name: 'Vehicle search' }).click();
   await page.locator('#rego').fill('LKJ23UO')
   await page.getByRole('button', { name: 'Submit' }).click();
   await expect(page.locator('#results')).toContainText('Rachel Smith')
   await expect(page.locator('#results').locator('div')).toHaveCount(1)

})

// TEST 2 - Owner does not Exist, all conditions tested by this test are mentioned below in comments.

test('Owner does not Exist', async ({page}) => {
   await page.getByRole('link', { name: 'Add a vehicle' }).click();

   // Enters the information of an owner that does not exist – expects a New owner button
   await page.locator('#owner').fill('Khadija Amin')
   await page.locator('#rego').fill('KKJ23UPP')
   await page.locator('#make').fill('Porsche')
   await page.locator('#model').fill('Taycan')
   await page.locator('#colour').fill('red')
   await expect(page.getByRole('button', { name: 'Check owner' })).toBeVisible()
   await page.getByRole('button', { name: 'Check owner' }).click();
   await expect(page.getByRole('button', { name: 'New owner' })).toBeVisible()
   await page.getByRole('button', { name: 'New owner' }).click();

   // Submits the form without any information entered – expects an Error
   await expect(page.getByRole('button', { name: 'Add owner' })).toBeVisible()
   await page.getByRole('button', { name: 'Add owner' }).click();
   await expect(page.locator('#message-owner')).toContainText('Error')

   // Submits the form with empty spaces – expects an Error message
   await page.locator('#name').fill('')
   await page.locator('#address').fill('')
   await page.locator('#dob').fill('')
   await page.locator('#license').fill('')
   await page.locator('#expire').fill('')
   await expect(page.getByRole('button', { name: 'Add owner' })).toBeVisible()
   await page.getByRole('button', { name: 'Add owner' }).click();
   await expect(page.locator('#message-owner')).toContainText('Error')

   // Enters information of an owner that already exists (identical owner already exists) – expects an Error message
   await page.locator('#name').fill('Rachel Smith')
   await page.locator('#address').fill('Wollaton')
   await page.locator('#dob').fill('1979-06-05')
   await page.locator('#license').fill('SG345PQ')
   await page.locator('#expire').fill('2020-05-05')
   await expect(page.getByRole('button', { name: 'Add owner' })).toBeVisible()
   await page.getByRole('button', { name: 'Add owner' }).click();
   await expect(page.locator('#message-owner')).toContainText('Error')

   // Fills in all fields but one – expects an Error message
   await page.locator('#name').fill('Khadija Amin')
   await page.locator('#address').fill('Nottingham')
   await page.locator('#dob').fill('2006-10-22')
   await page.locator('#license').fill('KKK23UPP')
   await page.locator('#expire').fill('')
   await expect(page.getByRole('button', { name: 'Add owner' })).toBeVisible()
   await page.getByRole('button', { name: 'Add owner' }).click();
   await expect(page.locator('#message-owner')).toContainText('Error')

   // Finally, enters all valid information – expects an Add owner button.
   //Expects an Owner added successfully message
   await page.locator('#expire').fill('2020-10-10')
   await expect(page.getByRole('button', { name: 'Add owner' })).toBeVisible()
   await page.getByRole('button', { name: 'Add owner' }).click();
   await expect(page.locator('#message-owner')).toContainText('Owner added successfully')

   //Expects an Add vehicle button
   // Expects a Vehicle added successfully message
   await expect(page.getByRole('button', { name: 'Add vehicle' })).toBeVisible()
   await page.getByRole('button', { name: 'Add vehicle' }).click();
   await expect(page.locator('#message-vehicle')).toContainText('Vehicle added successfully')

})