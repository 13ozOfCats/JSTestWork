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

    for(let i = tree.size; i>=-1; i--){
        for(id of tree.keys()){
            let folder = tree.get(id);
            let parentId = folder.parentId;
            if(folder.parentId === i){
                tree.get(parentId).children.push(folder);
            }
        }
    }

    this.treeObject = [];
    for(id of tree.keys()){
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
        document.querySelector(`#tree`).appendChild(createElement(elem));
        if (elem.children.length !== 0){
            printChild(elem);
        }
    }
    for (const node of document.getElementsByClassName("node-label")) {
        node.addEventListener("click", toggleNode);
        if (node.closest(".node").children.length - 1 === 0) node.classList.add("node-label_endpoint");
    }
//Функция рисующая дочерние элементы дерева
function printChild(element){
    this.elem = element.children;
    for (let id of this.elem) {
        if (id.children.length !== 0) {
            document.querySelector(`#tree`).appendChild(createElement(id));
            printChild(id);
        }
        else {
            document.querySelector(`#tree`).appendChild(createElement(id));
        }
    }
}

//Функция преобразует элемент массива в элемент отображения
function createElement(elem){
    let element = document.createElement("div");
    let label = document.createElement("span");
    label.innerText = elem.title;
    element.appendChild(label);
    return element;
    }


}


async function start() {
    let data = await getJson();
    let tree = new CreateTree(data);
    printTree(tree);
}
start();
