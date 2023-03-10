const Util = require("./util");

class Sheet {
    constructor(doc) {
        this.doc = doc;
    }

    isExistSheet(idSheet) {
        const sheet = this.doc.sheetsByTitle[idSheet]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

        if (sheet) {
            this.sheet = sheet;
            return true;
        }
        return false;
    }

    async loadCell() {
        await this.sheet.loadCells('A1:O300');
    }

    getNameStudent() {
        return `**${this.sheet.getCell(0, 9).value}**`;
    }

    getHocPhi() {
        const soBuoi = this.sheet.getCell(0, 6); 
        const hocPhi = this.sheet.getCell(0, 7); 
        const paid = this.sheet.getCell(0, 8); 

        return {
            number: soBuoi.value,
            fee: Util.numberWithCommas(hocPhi.value) + " VNĐ",
            total: Util.numberWithCommas(soBuoi.value * hocPhi.value - paid.value) + " VNĐ",
            paid: Util.numberWithCommas(paid.value)+ " VNĐ"
        };
    }

    getHuongDan(command) {
        const content = `+ học phí: Kiểm tra học phí\n+ nhận xét: Lấy thông tin nhận xét`;
        return `Kiểm tra thông tin của **${this.getNameStudent()}** bằng các lệnh sau:\n`+ Util.wrapBox(content);
    }

    getHocPhiText() {
        const data = this.getHocPhi();
        return `Học phí của ${this.getNameStudent()}:\n` + Util.wrapBox(`+ Số buổi: ${data.number}\n+ Học phí trên buổi: ${data.fee}\n+ Đã thanh toán: ${data.paid}\n+ Tổng còn phải nộp: ${data.total}`);
    }
    
    getLink() {
        return `Xem nhận xét quá trình học của ${this.getNameStudent()} tại: ` + this.sheet.getCell(0, 10).value;
    }

}


module.exports = Sheet;