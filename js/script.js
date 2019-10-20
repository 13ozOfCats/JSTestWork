//Функция для получения данных из json
async function getJson() {
    const response = await fetch('https://raw.githubusercontent.com/wrike/frontend-test/master/data.json');
    return await response.json();
}

//Создание массива дерева
function CreateTree(data) {
    let tree = new Map();
    for (let item of data) {
        tree.set(item.id, {
            id: item.id, title: item.title,
            parentId: item.parentId, children: [], hidden: false
        });
    }
//Отдаем детей их родителям
    for(let i = tree.size; i>=-1; i--){
        for(let id of tree.keys()){
            let folder = tree.get(id);
            let parentId = folder.parentId;
            if(folder.parentId === i){
                tree.get(parentId).children.push(folder);
            }
        }
    }
//Достаем корневые элементы
    let finalTree = [];
    for(let id of tree.keys()){
        let folder = tree.get(id);
        let parentId = folder.parentId;
        if(parentId === null){
            finalTree.push(folder);
        }
    }
    return finalTree;
}
//Функция отрисовывающая массив на странице
function printTree(tree) {
    document.getElementById('tree').innerHTML = '';
    for (let elem of tree) {
        if (!elem.hidden || !hiddenChild(elem)){
            console.log(hiddenChild(elem));
            document.querySelector('#tree').appendChild(createElement(elem));
            if (elem.children.length !== 0){
                printChild(elem);
            }
        }
    }

    //Функция рисующая дочерние элементы дерева
    function printChild(element){
        this.elem = element.children;
        for (let id of this.elem) {
            if (id.children.length !== 0) {
                if(!id.hidden || !hiddenChild(id)) {
                    document.querySelector(`.node[data-id='${id.parentId}']`).appendChild(createElement(id));
                    printChild(id);
                }

            }
            else {
                if(!id.hidden){
                    document.querySelector(`.node[data-id='${id.parentId}']`).appendChild(createElement(id));
                }
            }
        }
    }

    //Функция проверяющая скрытых детей
    function hiddenChild(element){
        this.elem = element.children;
        for (let id of this.elem) {
            if (id.hidden) {
                if(id.children.length !== 0) {
                    return hiddenChild(id);
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }
    }

    //Функция преобразует элемент массива в элемент отображения
    function createElement(elem){
        let element = document.createElement("div");
        element.className = "node";
        element.dataset.id = elem.id;
        let name = document.createElement("span");
        name.innerText = elem.title;
        element.appendChild(name);
        if(elem.children.length !== 0){
            name.className += "parent";
            name.onclick = function hideChild() {
                name.classList.toggle("parent_hidden");
                for(let child of name.closest(".node").querySelectorAll(".node")){
                    child.classList.toggle("hidden");
                }
            }
        }
        return element;
    }
}
//Функция сортировки
function sort(tree, reverse = false) {
    for (let item of tree) {
        sortChild(item);
    }
    function sortChild(item) {
        item.children.sort(function (a, b) {
            if (a.title < b.title) {
                if (reverse) {
                    return 1
                }
                return -1;
            }
            if (a.title > b.title) {
                if (reverse) {
                    return -1
                }
                return 1;
            }
            return 0;
        });
        for (let children of item.children) {
            sortChild(children);
        }
    }
    printTree(tree);
}
//Функция поиска
function  search(tree) {
    let input = document.querySelector("#search").value.toLowerCase();
    for (let item of tree) {
        let name = item.title.toLowerCase();
        item.hidden = !name.includes(input);
        if (item.children.length !== 0) {
            checkChild(item);
        }
    }
    function checkChild(element) {
        this.elem = element.children;
        for (let id of this.elem) {
            let name = id.title.toLowerCase();
            id.hidden = !name.includes(input);
            if (id.children.length !== 0) {
                checkChild(id);
            }
        }
    }
    console.log(tree);
    printTree(tree);
}

//Функция запускающая все остальные функции
async function start() {
    let data = await getJson();
    let tree = new CreateTree(data);
    printTree(tree);
    document.querySelector("#btnAZ").onclick = function () {
        sort(tree)
    };
    document.querySelector("#btnZA").onclick = function () {
        sort(tree, true)
    };
    document.querySelector("#search").onkeyup = function () {
        search(tree)
    };
}
let go = start();
