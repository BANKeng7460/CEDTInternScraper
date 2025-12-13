import { Page } from "@playwright/test"
export class LoginPage {
    /**
     * 
     * @param {Page} page 
     */
    constructor(page) {
        this.page = page
    }

    baseUrl = 'https://cedtintern.cp.eng.chula.ac.th/'

    async  goto(){
        await this.page.goto(this.baseUrl)
    }

    async clickLoginWithAccountButton() {
        await this.page.getByRole('button', { name: 'เข้าสู่ระบบด้วยบัญชี' }).click();
    }

    async clickLoginWithChulaAccountButton() {
        await this.page.getByRole('link').filter({ hasText: /^$/ }).click();
    }
    async Login(usernameID,password){
        await this.goto()
        await this.clickLoginWithAccountButton()
        await this.clickLoginWithChulaAccountButton()
        await this.page.getByRole('textbox', { name: 'ชื่อบัญชี (Username)' }).fill(usernameID)
        await this.page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill(password)
        await this.page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    }
}