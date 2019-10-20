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
            parentId: item.parentId, children: []
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

    this.treeObject = [];
    for(let id of tree.keys()){
        let folder = tree.get(id);
        let parentId = folder.parentId;
        if(parentId === null){
            this.treeObject.push(folder);
        }
    }

}
//Функция отрисовывающая массив на странице
function printTree(tree) {
    document.getElementById('tree').innerHTML = '';
    for (let elem of tree.treeObject) {
        document.querySelector('#tree').appendChild(createElement(elem));
        if (elem.children.length !== 0){
            printChild(elem);
        }
    }

    //Функция рисующая дочерние элементы дерева
    function printChild(element){
        this.elem = element.children;
        for (let id of this.elem) {
            if (id.children.length !== 0) {
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

//Функция запускающая все остальные функции
async function start() {
    let data = await getJson();
    let tree = new CreateTree(data);
    printTree(tree);
}
let go = start();
