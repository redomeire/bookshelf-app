const Uncompleted = "belumSelesai";
const completed = "sudahSelesai";
const todos = "itemid";
let lakukan = [];
let storageKey = "Data(s)";

function scrolling() {
    const scrollHalus = document.getElementsByTagName('html');
    scrollHalus[0].style.scrollBehavior = "smooth";
}

scrolling();

document.addEventListener("DOMContentLoaded", function () {
    const masukkan = document.getElementById('form');
    masukkan.addEventListener("submit", function (ev) {
        ev.preventDefault();
        tambahBelumSelesai();
    });
    if (checkStorage()) {
        dataLoad();
    }
});

function tambahBelumSelesai() {
    const rakBelumDibaca = document.getElementById(Uncompleted);
    const judul = document.getElementById("judul").value;
    const pengarang = document.getElementById("creator").value;
    const tahunTerbit = document.getElementById("year").value;
    const tahunTerbit2 = parseInt(tahunTerbit);

    const list = buatIsi(judul, pengarang, tahunTerbit, false);

    const listValue = tipeInputan(judul, pengarang, tahunTerbit2, false);

    list[todos] = listValue.id;
    lakukan.push(listValue);

    rakBelumDibaca.append(list);
    upload();
    rakBelumDibaca.append(list);
}

function removeToSudahSelesai(Element) {
    const rakSudahSelesai = document.getElementById(completed);
    const tangkapJudul = Element.querySelector(".bookList  h3").innerText;
    const tangkapPengarang = Element.querySelector(".bookList .namaPengarang ").innerText;
    const tangkapTahun = Element.querySelector(".bookList .tahunBerapa").innerText;

    const listBaru = buatIsi(tangkapJudul, tangkapPengarang, tangkapTahun, true);

    const todo = findTodo(Element[todos]);
    todo.isComplete = true;
    listBaru[todos] = todo.id;
    upload();
    rakSudahSelesai.append(listBaru);
    Element.remove();
}

function removeToBelumSelesai(Element) {
    const rakBelumDibaca = document.getElementById(Uncompleted);
    const catchJudul = Element.querySelector(".bookList h3").innerText;
    const catchPengarang = Element.querySelector(".bookList  .namaPengarang").innerText;
    const catchTahun = Element.querySelector(".bookList .tahunBerapa").innerText;

    const listBaru = buatIsi(catchJudul, catchPengarang, catchTahun, false);
    const todo = findTodo(Element[todos]);
    todo.isComplete = false;
    listBaru[todos] = todo.id;

    upload();
    rakBelumDibaca.append(listBaru);
    Element.remove();
}

function buatTombolHapus() {
    const tombolHapus = document.createElement("button");
    tombolHapus.classList.add("btn3");
    tombolHapus.innerText = "hapus";
    tombolHapus.addEventListener("click", function (ev) {
        memunculkanCustom();
        hapusTask(ev.target.parentElement.parentElement);
    });
    return tombolHapus;
}

function hapusTask(Element) {

    const todoPosition = todoIndex(Element[todos]);
    lakukan.splice(todoPosition, 1);

    Element.remove();
    upload();
}

function buatTombolSudahSelesai() {
    const tombolSudah = document.createElement("button");
    tombolSudah.classList.add("btn4");
    tombolSudah.innerText = "Sudah Selesai";
    tombolSudah.addEventListener("click", function (ev) {
        removeToSudahSelesai(ev.target.parentElement.parentElement);
    });
    return tombolSudah;
}

function buatTombolBelumSelesai() {
    const tombolBelum = document.createElement("button");
    tombolBelum.classList.add("btn5");
    tombolBelum.innerText = "Belum Selesai";

    tombolBelum.addEventListener("click", function (ev) {
        removeToBelumSelesai(ev.target.parentElement.parentElement);
    });
    return tombolBelum;
}

function buatTombolContainer() {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("ganti");
    return buttonContainer;
}

function buatIsi(title, whoCreated, year, isComplete) {
    const judulList = document.createElement("h3");
    judulList.setAttribute("id", "judulh3");
    judulList.innerText = title;

    const creator = document.createElement("p");
    creator.classList.add("namaPengarang");
    creator.innerText = whoCreated;

    const tahun = document.createElement("p");
    tahun.classList.add("tahunBerapa");
    tahun.innerText = year;

    const masukkan = buatTombolContainer();

    if (isComplete) {
        masukkan.append(buatTombolHapus(), buatTombolBelumSelesai());
    } else {
        masukkan.append(buatTombolHapus(), buatTombolSudahSelesai());
    }

    const gantiContainer = document.createElement("div");
    gantiContainer.classList.add("bookList");
    gantiContainer.setAttribute("id", "bookList");
    gantiContainer.append(judulList, creator, tahun, masukkan);

    return gantiContainer;
}

function memunculkanCustom() {
    const munculCustom = document.getElementById("custom");
    munculCustom.removeAttribute("hidden");
}

function addHidden() {
    const custom = document.getElementById("custom");
    const hidden = document.createAttribute("hidden");
    const setHidden = custom.setAttributeNode(hidden);
    return setHidden;
}

document.querySelector("#done").addEventListener("click", function () {
    addHidden();
});

document.addEventListener("DOMContentLoaded", function () {
    const searchFormSubmit = document.getElementById('searchForm');
    searchFormSubmit.addEventListener("submit", function (ev) {
        ev.preventDefault();
        searchFunction();
    });
});

function searchFunction() {
    const input = document.getElementById("searchInput");
    const value = input.value;
    const bookList = document.getElementsByClassName("bookList");
    const length = bookList.length;
    for (let a = 0; a < length; a++) {
        const b = bookList[a].querySelector(".bookList h3");
        if (b.innerHTML.indexOf(value) > -1) {
            bookList[a].style.display = "";
        } else {
            bookList[a].style.display = "none";
        }
    }
}

function checkStorage() {
    if (typeof (Storage) === undefined) {
        console.log("browser tidak mendukung web storage");
        return false;
    } else {
        console.log("browser anda mendukung web storage");
        return true;
    }
}

function tipeInputan(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    };
}

function upload() {
    const changeToString = JSON.stringify(lakukan);
    localStorage.setItem(storageKey, changeToString);
    document.dispatchEvent(new Event("ondatasaved"));
}

function findTodo(todoId) {
    for (todo of lakukan) {
        if (todo.id === todoId)
            return todo;
    }
    return null;
}

function todoIndex(todoId) {
    let nums = 0;
    for (todo of lakukan) {
        if (todo.id === todoId) {
            return nums;
            nums++;
        }
        return -1;
    }
}

function loadData() {
    const datas = localStorage.getItem("Data(s)");
    const load = JSON.parse(datas);

    if (load !== null) {
        lakukan = load;
    }
    document.dispatchEvent(new Event("ondataloaded"));
}

function dataLoad() {
    const getStorageKey = localStorage.getItem(storageKey);

    let data = JSON.parse(getStorageKey);

    if (data !== null)
        lakukan = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function refreshPage() {
    const listCompleted = document.getElementById(completed);
    const listUncompleted = document.getElementById(Uncompleted);

    for (todo of lakukan) {
        const listBaru = buatIsi(todo.title, todo.author, todo.year, todo.isComplete);
        listBaru[todos] = todo.id;

        if (todo.isComplete) {
            listCompleted.append(listBaru);
        } else {
            listUncompleted.append(listBaru);
        }
    }
}

document.addEventListener("ondataloaded", () => {
    refreshPage();
});