
const sectionAddNewRegister = document.querySelector('section.form-add-bill');
const btnAddNewBill         = document.querySelector('button#btn-add-new-bill');
const btnEditNewBIll        = document.querySelector('button#btn-edit-new-bill');
const divMsgSuccess         = document.querySelector('div.msg-content');
const divImportCsv          = document.querySelector('section:has(div.form-import-csv)');

let divBillContainer    = document.querySelector('div.bill-container');
let nameBill            = document.querySelector('input[name=nome]');
let valueBill           = document.querySelector('input[name=value]');
let parcelBill          = document.querySelector('input[name=parcel]');
let colorBill           = document.querySelector('input[name=color]');
let dateBill            = document.querySelector('input[name=date]');
let inputFile           = document.querySelector('input#import-csv');
let msgError            = document.querySelector('span#msgError');
let msgSuccess          = document.querySelector('h3#msgSuccess');

let numParcel = 1;

btnAddNewBill.addEventListener('click', registerBill);
btnEditNewBIll.addEventListener('click', editNewBill);

// EVENTS
document.querySelector('button#btn-add').addEventListener('click', openModalRegister);
document.querySelector('button#btn-close-new-bill').addEventListener('click', closeModalRegister);
document.querySelector('input#search').addEventListener('keyup', searchBill);
document.querySelector('button#add-parcel').addEventListener('click', () => parcelBill.value = ++numParcel);
document.querySelector('button#rm-parcel').addEventListener('click', () => (numParcel <= 1) ? parcelBill.value = 1 : parcelBill.value = --numParcel);
document.querySelector('ion-icon[name=sunny-outline]').addEventListener('click', changeModeLight);
document.querySelector('ion-icon[name=moon-outline]').addEventListener('click', changeModeDark);
document.querySelector('a#export-csv').addEventListener('click', exportCSV);
document.querySelector('button#import-csv').addEventListener('click', openModelCSV);
document.querySelector('button#btn-close-csv').addEventListener('click', (e) => {e.preventDefault(); divImportCsv.style.display = 'none'});
document.querySelector('button#btn-send-csv').addEventListener('click', importCSV);

valueBill.addEventListener('keypress', matchDigits);

let locaArrBills = JSON.parse(localStorage.getItem('arrNameBill'));
//ARRAYS
let arrNameBill = [];

const formatMoney = Intl.NumberFormat('pt-BR', {
    style:'currency',
    currency:'BRL',
    maximumFractionDigits: 2
});

if(locaArrBills) {
    locaArrBills.forEach(bills => arrNameBill.push(bills));
}

if (navigator.userAgentData != undefined && navigator.userAgentData.mobile) {
    valueBill.setAttribute('type', 'number');
} else {
    valueBill.setAttribute('type', 'text');
}

function matchDigits(event) {

    let char = String.fromCharCode(event.keyCode);
    let patters = '[0-9,]';

    if (!char.match(patters) || event.target.value.length > 7) {
        event.preventDefault();
    }
}

function registerBill() {
    if (notCampsEmpty() == false) return;

    let nameBillVal    = nameBill.value;
    let valueBillVal   = valueBill.value;
    let parcelBillVal  = parcelBill.value;
    let colorBillVal   = colorBill.value;
    let dateBillVal    = dateBill.value;

    valueBillVal = parseFloat(valueBillVal.replace(',', '.'));

    let parcels = [];

    for (let i = 0; i < parcelBillVal; i++) {
        parcels.push({pa: valueBillVal/parcelBillVal, sa: 'NF'});
    }

    let verifyBill = true;

    arrNameBill.forEach((bill, i) => {
        if (bill.name == nameBillVal){
            verifyBill = false;
        }
    });
    
    if (!verifyBill) {
        setMsgError('Já existe uma conta com esse nome!');
        return;
    }

    arrNameBill.push({name: nameBillVal, total: valueBillVal, color: colorBillVal, date: dateBillVal,pac: parcels});
    localStorage.setItem('arrNameBill', JSON.stringify(arrNameBill));

    templateNewBill(arrNameBill);
    setMsgAction('Conta cadastrada com sucesso!');

    nameBill.value = '';
    valueBill.value = '';
    parcelBill.value = 1;
    numParcel = 1;
}

function editNewBill(element) {
    if (notCampsEmpty() == false) return;

    let index = element.target.getAttribute('idx');

    let nameBillVal    = nameBill.value;
    let valueBillVal   = valueBill.value;
    let parcelBillVal  = parcelBill.value;
    let colorBillVal   = colorBill.value;
    let dateBillVal    = dateBill.value;

    valueBillVal = parseFloat(valueBillVal.replace(',', '.'));

    let parcels = [];

    for (let i = 0; i < parcelBillVal; i++) {
        parcels.push({pa: valueBillVal/parcelBillVal, sa: 'NF'});
    }

    arrNameBill[index] = {name: nameBillVal, total: valueBillVal, color: colorBillVal, date: dateBillVal, pac: parcels}

    localStorage.setItem('arrNameBill', JSON.stringify(arrNameBill));

    htmlConstruct(arrNameBill);

    clearCampsForm();
    setMsgAction('Conta editada com sucesso!');

    setHideTimeOut(sectionAddNewRegister, 700);
}

function searchBill(event) {

    let searchName = event.target.value;

    let result = arrNameBill.filter(billName =>{
        return billName.name.includes(searchName);
    });

    setTimeout(() => {
        (result.length > 0) ? htmlConstruct(result) : htmlConstruct(arrNameBill);
    }, 500);
}

function templateNewBill(arrBill) {
    htmlConstruct(arrBill);
}

function htmlConstruct(array) {
    let html = '';
    let checked = false;

    if (array.length > 0){

        array.forEach((bill, i) => {
            let {name, total, color, date, pac} = bill;
            let idxP = i;

            html += `<div class="bill-content">
                        <details>
                            <summary>
                                <div class="title-bill">
                                    <div>
                                        <span class="bill-color" style="background: ${color}"></span>
                                        <h3 id="name-bill">${name} - 
                                            <span>Total: ${formatMoney.format(total)} 
                                                <span> - ${date}</span>
                                            </span>
                                        </h3>
                                    </div>
                                    <div>
                                        <button title="Editar" onclick="editBill(this)" idx="${i}">
                                            <ion-icon name="pencil-outline"></ion-icon>
                                        </button>
                                        <button title="Deletar" onclick="deleteBill(this)" idx="${i}">
                                            <ion-icon name="trash-outline"></ion-icon>
                                        </button>
                                    </div>   
                                </div>
                            </summary>
                            <div class="bill-table">
                                <ul id="list-bills">
                                    ${pac.map((pac, i) => {
                                    if (pac.sa == 'PG') {
                                        checked = 'checked' 
                                    }else {
                                        checked = false ;
                                    }

                                    return `<li>Parcelas: ${formatMoney.format(pac.pa)}  
                                            <span>
                                                <ion-icon name="checkmark-circle-outline" class="${checked}" idx="${idxP}" id="${i}" onclick="handleCheck(this)"></ion-icon>
                                            </span>
                                        </li>`
                                    }).join('')}
                                </ul>
                            </div>
                        </details>
                    </div>`;

            });
    } else {

        html = `<div class="list-empty">
                    <h1>Nenhuma conta por aqui!</h1>
                    <img src="../images/listempty.png" />
                </div>`;
    }
    
    return divBillContainer.innerHTML = html;
}

function deleteBill(element) {
    let index = element.getAttribute('idx');

    arrNameBill.splice(index, 1);
    localStorage.setItem('arrNameBill', JSON.stringify(arrNameBill));

    htmlConstruct(arrNameBill);

}

function editBill(element) {

    btnAddNewBill.style.display         = 'none';
    btnEditNewBIll.style.display        = 'block';
    sectionAddNewRegister.style.display = 'flex';

    let index = element.getAttribute('idx');

    btnEditNewBIll.setAttribute('idx', index);

    let {name, color, total, date, pac} = arrNameBill[parseInt(index)];

    let totalFixed = parseInt(total).toFixed(2);

    nameBill.value   = name;
    valueBill.value  = totalFixed.replace('.', ',');
    parcelBill.value = pac.length;
    colorBill.value  = color;
    dateBill.value   = date;
    numParcel        = pac.length;
}

let body = document.body;
let main = document.querySelector('main');
let html = document.querySelectorAll('html');
(localStorage.getItem('current-mode') == 'dark') ? changeModeDark() : changeModeLight();

function changeModeLight() {
    main.style.color = '#000';
    body.style.background = '#fff';
    html.forEach(dt => {
        dt.style.setProperty('--bg-details','#0000001e')
        dt.style.setProperty('--box-shadow','2px 5px 10px #000')
    });
    localStorage.setItem('current-mode', 'light');
}

function changeModeDark() {
    main.style.color = '#fff';
    body.style.background = '#000';
    html.forEach(dt => {
        dt.style.setProperty('--bg-details','#fff')
        dt.style.setProperty('--box-shadow','2px 5px 10px #fff')
    });
    localStorage.setItem('current-mode', 'dark');
}

htmlConstruct(arrNameBill);

function handleCheck(element) {

    let idxP = element.getAttribute('idx');
    let idxF = element.getAttribute('id');

    let contentClass = element.className.match('checked') ? true : false;

    let newArrNameBill = JSON.parse(localStorage.getItem('arrNameBill'));

    if (!contentClass){

        newArrNameBill.forEach((bill, id) => {
            if (idxP == id) {
                bill.pac.map((pac, idp) =>{
                    if (idxF == idp){
                        pac.sa = 'PG';
                    }
                });
            }
        });

    } else {

        newArrNameBill.forEach((bill, id) => {
            if (idxP == id) {
                bill.pac.map((pac, idp) =>{
                    if (idxF == idp){
                        pac.sa = 'NF';
                    }
                });
            }
        });
    }

    element.classList.toggle('checked');
    arrNameBill = newArrNameBill;
    localStorage.setItem('arrNameBill', JSON.stringify(newArrNameBill)); 
}

function exportCSV() {
    
    let table = JSON.parse(localStorage.getItem('arrNameBill'));

    if (!table || table.length == 0) {
        alert('Nenhum dado para exportar!');
        return
    };

    let CSVString = '';

    table.forEach(bill => {
        let pa = bill.pac.map(pac => parseInt(pac.pa).toFixed(2));
        let sa = bill.pac.map(pac => pac.sa).join(',');
        
        CSVString += `${bill.date},${bill.name},${parseInt(bill.total).toFixed(2)},${bill.color},${pa},${sa}` + '\n';
    });

    let date = Intl.DateTimeFormat('pt-BR').format(new Date);

    this.setAttribute('href', `data:text/csv;charset=utf-8, ${encodeURIComponent(CSVString.toLocaleUpperCase())}`);
    this.setAttribute('download', `backup-bill-${date}.csv`);
}

let rel = null;
let fileReader = new FileReader();
let result = null;

function importCSV(event) {
    event.preventDefault();

    if (inputFile.value == '') {
        setMsgError('Preencha o campo, por favor!');
        return;
    }

    fileReader.onload = function (e){
        if (e.target.DONE == 2) {
            result = e.target.result;
            getDateCsv(result);
        }
    }

    if (inputFile.files[0]) {
        fileReader.readAsText(inputFile.files[0]);
    }

    setMsgAction('Dados importados com sucesso!');
    inputFile.value = '';

    setHideTimeOut(divImportCsv, 700);
}

function getDateCsv(dados) {
    let stringBills = dados.replace(/\n/g, '|');
    let arrBill = stringBills.split('|').slice(0, -1);

    let destructDate = arrBill.map((bill, i) => {
        let nArr = bill.split(',');
        let parcels = [];
        let pa = '';
        let sa = '';

        nArr.map((b, i) => {
            if (i > 3) {
                if (b != 'NF' && b != 'PG') {
                    pa = b;
                } else if (b == 'NF' || b == 'PG') {
                    sa = b
                }

                if (sa != '') {
                    parcels.push({pa:pa, sa:sa});
                }
            } 
        });

        let objDate = {
            name: nArr[1].toLocaleLowerCase(),
            date: nArr[0],
            total: nArr[2],
            color: nArr[3],
            pac: parcels
        }
        return objDate;
    });

    arrNameBill = destructDate;

    htmlConstruct(arrNameBill);
    localStorage.setItem('arrNameBill', JSON.stringify(arrNameBill));
}

function openModalRegister() {
    
    clearCampsForm();
    parcelBill.value = 1;

    let currentDate = new Date();
    dateBill.value = Intl.DateTimeFormat('pt-BR').format(currentDate); 

    btnEditNewBIll.style.display = 'none'; 
    btnAddNewBill.style.display = 'block';
    sectionAddNewRegister.style.display = 'flex';
}

function closeModalRegister() {

    clearCampsForm();
    numParcel = 1; 

    arrNameBill = JSON.parse(localStorage.getItem('arrNameBill'));
    sectionAddNewRegister.style.display = 'none';
    msgError.style.display = 'none';

}

function openModelCSV() {
    let conf = confirm('Antenção! Antes de importar os dados certifique de que nenhuma conta nova foi adicionada, caso contrário exporte a lista antes de importar!')

    if (!conf) return;

    divImportCsv.style.display = 'flex';
}

function clearCampsForm() {
    nameBill.value   = '';
    valueBill.value  = '';
    parcelBill.value = '';
    colorBill.value  = '';
    dateBill.value   = '';
    colorBill.value  = '#000';

}

function notCampsEmpty() {

    if (nameBill.value == '' || valueBill.value == '') {
        setMsgError('Preencha os campos abaixo, por favor!');
        return false;
    } else {
        msgError.style.display = 'none';
        return true;
    }
}

function setMsgError(msg) {
    msgError.style.display = 'block';
    msgError.innerHTML = msg;

    setHideTimeOut(msgError, 3000);
}

function setMsgAction(msg) {
    divMsgSuccess.style.display = 'block';
    msgSuccess.innerHTML = msg;

    setHideTimeOut(divMsgSuccess, 3000); 
}

function setHideTimeOut(camp, time) {

    setTimeout(() => {
        camp.style.display = 'none';
    }, time);
}