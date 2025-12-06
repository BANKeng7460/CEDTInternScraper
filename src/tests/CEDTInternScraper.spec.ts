import { test, expect } from '@playwright/test';
import { escapeCsvValue }from '../functions/escapeCsvValue';
import * as fs from 'fs';

test('CEDTInternScraper', async ({ page }) => {
  const usernameID = process.env.USERNAMEID!
  const password = process.env.PASSWORD!
  const results = []
  //Setup Zone
  await page.goto('https://cedtintern.cp.eng.chula.ac.th/');
  await page.getByRole('button', { name: 'เข้าสู่ระบบด้วยบัญชี' }).click();
  await page.locator('#cv-login-main').click();
  await page.getByRole('link').filter({ hasText: /^$/ }).click();
  await page.getByRole('textbox', { name: 'ชื่อบัญชี (Username)' }).fill(usernameID)
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill(password)
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await page.getByRole('link', { name: 'ตำแหน่งฝึกงาน', exact:true }).click();
  const locatorPosCount = page.locator('p', { hasText: "ผลลัพธ์การค้นหา" })
                   .locator('span.font-bold')
                   .first();
  await expect(locatorPosCount).not.toHaveText(/0 ตำแหน่งงาน/);
  const positions = await page.locator('p', { hasText: "ผลลัพธ์การค้นหา" }).locator('span.font-bold').first().textContent();
  
  const positionCount = positions == null ? 0 : parseInt(positions.trim(), 10);
  console.log("position count is",positionCount)
  for (let i = 0; i < positionCount; i++) {
    console.log(`Working on ${i+1}/${positionCount}`)
    const pageNo = Math.ceil((i+1)/20);
    const cell = (i)%20;
    await page.goto(`https://cedtintern.cp.eng.chula.ac.th/opening?page=${pageNo}&bookmarkedFilter=false&availablePositionFilter=false`)
    const locatorCell = page.locator('.flex.flex-col.w-full.h-fit.rounded-md').nth(cell)
    const jobName = await locatorCell.locator('a').first().textContent()
    const companyName = await locatorCell.locator('a').nth(1).textContent()
    const seatsText = await locatorCell.locator('p', { hasText: 'ที่นั่ง' }).textContent();
    const seats = seatsText?.match(/\d+/)?.[0] ?? null;
    const locator = locatorCell.locator('p', { hasText: 'คนเลือกตำแหน่งนี้' });
const count = await locator.count();

let selections = 0;  // default 0
if (count > 0) {
  const text = await locator.textContent();
  selections = Number(text?.match(/\d+/)?.[0] ?? 0);
}

    await locatorCell.getByRole('button', { name: 'ดูเพิ่มเติม' }).click()
    const Compensation = await page.locator('.body1.font-normal.w-\\[70\\%\\].text-high.max-lg\\:w-full').first().textContent()
    const Address = await page.locator('.body1.font-normal.w-\\[70\\%\\].text-high.max-lg\\:w-full').nth(3).textContent()
    console.log(jobName,companyName,seats,"ที่นั่ง",selections,"คนเลือกตำแหน่งนี้",Compensation,Address)
    results.push({ "jobPosition":jobName ,"CompanyName":companyName,seats,selections,"Compensation":Compensation,Address});
  }

  

// สร้าง header
const header = Object.keys(results[0]).join(',') + '\n';

// สร้าง row แต่ละตัว
const rows = results.map(obj =>
  Object.values(obj).map(escapeCsvValue).join(',')
).join('\n');

// รวม header + rows
const csvData = header + rows;


// เขียนไฟล์ CSV
  fs.writeFileSync('CEDTInternList.csv', csvData);

  console.log('saved → CEDTInternList.csv');
});
