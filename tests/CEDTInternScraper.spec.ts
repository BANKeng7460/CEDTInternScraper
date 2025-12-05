import { test, expect } from '@playwright/test';
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
    await locatorCell.getByRole('button', { name: 'ดูเพิ่มเติม' }).click()
    const Compensation = await page.locator('.body1.font-normal.w-\\[70\\%\\].text-high.max-lg\\:w-full').first().textContent()
    console.log(jobName,companyName,Compensation)
    results.push({ "jobPosition":jobName ,"CompanyName":companyName,"Compensation":Compensation});
  }

  function escapeCsvValue(value: string | null): string {
  if (value === null) {
    return '';
  }
  if (typeof value === 'string') {
    // escape " เป็น ""
    value = value.replace(/"/g, '""');
    // ถ้ามี , หรือ " หรือ \n ให้ครอบด้วย "
    if (value.search(/("|,|\n)/g) >= 0) {
      value = `"${value}"`;
    }
  }
  return value;
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
  fs.writeFileSync('CEDTCompensationList.csv', csvData);

  console.log('saved → CEDTCompensationList.csv');
});
