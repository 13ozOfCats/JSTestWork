async function getJson() {
const response = await fetch('https://raw.githubusercontent.com/wrike/frontend-test/master/data.json'); //Получаем json
const myJson = await response.json(); //преобразуем содержимое json в переменную
console.log(myJson);
return myJson;
}
