export const parseDescription = (event:any) => {
    const description = event.description

    const data = {
        purpose: event.summary || "",
        spend_to: event.location || "",
        amount: 0,
        keihi_class: "",
        invoice_number: null,
        contract_number: null,
    }
    
    const descriptionArray = description.split("\n");
    descriptionArray.forEach((line) => {
        if (line.startsWith('[金額]')) {
            data.amount = line.replace('[金額] ', '').trim();
        }
        if (line.startsWith('[経費科目]')) {
            data.keihi_class = line.replace('[経費科目] ', '').trim();
        }
        if (line.startsWith('[適格請求書番号]')) {
            data.invoice_number = line.replace('[適格請求書番号] ', '').trim();
        }
        if (line.startsWith('[連絡先]')) {
            data.contract_number = line.replace('[連絡先] ', '').trim();
        }
        if (line.startsWith('[支払先]')) {
            data.spend_to = line.replace('[支払先] ', '').trim();
        }
    })

    // console.log(data)

    return data;

}

export default parseDescription;