//Функция для получения данных из json
async function getJson() {
const response = await fetch('https://raw.githubusercontent.com/wrike/frontend-test/master/data.json');
const myJson = await response.json();
return myJson;
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
            if(folder.parentId == i){
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


async function start() {
    let data = await getJson();
    let tree = new CreateTree(data);
    console.log(tree);

}
start();
