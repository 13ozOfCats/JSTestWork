//Функция для получения данных из json
async function getJson() {
    const response = await fetch('https://raw.githubusercontent.com/wrike/frontend-test/master/data.json');
    return await response.json();
}

//Создание массива дерева
function CreateTree(data) {
    data.sort(function (a, b) {
        if (a.parentId < b.parentId || a.parentId === null) {
            return -1;
        }
        if (a.parentId > b.parentId) {
            return 1;
        }
        return 0;
    });

    let tree = [];
    while (data.length > 0) {
        let child = data.pop();
        if (child.parentId !== null) {
            for (let item of data) {
                if (item.id === child.parentId) {
                    if(!item.children) {
                        item.children = []
                    }
                    item.children.push(child);
                }
            }
        } else {
            tree.push(child);
        }
    }
    return tree;
}
//Функция отрисовывающая массив на странице
function printTree(tree) {
    document.getElementById('tree').innerHTML = '';
    for (let elem of tree) {
        document.querySelector('#tree').appendChild(createElement(elem));
        if (elem.children){
            printChild(elem);
        }
    }
    //Функция рисующая дочерние элементы дерева
    function printChild(element){
        this.elem = element.children;
        for (let id of this.elem) {
            if (id.children) {
                document.querySelector(`.node[data-id='${id.parentId}']`).appendChild(createElement(id));
                printChild(id);
            }
            else {
                document.querySelector(`.node[data-id='${id.parentId}']`).appendChild(createElement(id));
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
        if(elem.children){
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
function sortTree(tree, reverse = false) {
    tree.sort(function (a, b) {
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
    for (let item of tree) {
        if(item.children){
            sortTree(item.children, reverse)
        }
    }
    printTree(tree);
}

//Функция поиска
function  search() {
    let input = document.querySelector("#search").value.toLowerCase();
    let elements = document.querySelectorAll('.node');
    for(let item of elements){
        let child = item.firstChild;
        let name = child.innerHTML.toLowerCase();
        if(name.includes(input)) {
            item.classList.remove("hidden");
            let parent = item.parentElement;
            while (parent) {
                parent.classList.remove("hidden");
                parent = parent.parentElement;
            }
        }
        else{
            item.classList.add("hidden");
        }
    }
}

//Функция запускающая все остальные функции
async function start() {
    let data = await getJson();
    let tree = new CreateTree(data);
    printTree(tree);
    document.querySelector("#btnAZ").onclick = function () {
        sortTree(tree)
    };
    document.querySelector("#btnZA").onclick = function () {
        sortTree(tree, true)
    };
    document.querySelector("#search").onkeyup = function () {
        search()
    };
}
let go = start();
