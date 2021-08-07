// Данные
// 1. Создаем классы
//     a.Корневого объекта

class Root {
    constructor() {


        this.objects = {};
        this.elements = {};

    }

    //    Запрос к серверу по URL
    request(url) {
        return new Promise(function (resolve) {
            let httpRequest;
            if (window.XMLHttpRequest) {
                httpRequest = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            };

            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === 4) {
                    resolve(httpRequest.responseText);

                }
            };
            httpRequest.open('GET', url, true);
            httpRequest.send();

        })

    }

    // 3.b. Выводим структуру
    render() {
        let main = document.querySelector('.main');
        main.innerHTML = `<h1 class ="heading"> Root</h1>`;
        console.log(this.objects)
        this.bypass(main, this.objects, this.elements);

    }

    // Обходим объект
    bypass(parent, object, element) {
        let list = document.createElement('ul');
        list.className = 'list';



        for (let prop in object) {

            let listItem = document.createElement('li'),
                info = document.createElement('div'),
                key = document.createElement('p');
            info.className = 'list__item-info';
            info.append(key);
            listItem.className = 'list__item';
            listItem.append(info);

            // Обработчик, отвечающий за открытие ветки
            listItem.addEventListener('dblclick', (event) => {
                if (listItem.classList.contains('list__item_object')) {
                    listItem.classList.toggle('list__item_active');
                }
                event.stopImmediatePropagation();

            })

            // Обработчик, отвечающий за выделение элеменат
            listItem.addEventListener('click', (event) => {
                let current = document.querySelector('.list__item_current');

                if (current) {
                    current.classList.remove('list__item_current');
                };
                listItem.classList.add('list__item_current');
                this.current = {
                    object: object,
                    property: prop,
                    element: listItem
                };

                event.stopImmediatePropagation();
            });

            // Обработчик, вызывающий контекстное меню
            listItem.addEventListener('contextmenu', (event) => {


                event.preventDefault();
                event.stopImmediatePropagation();

                this.menu.style.left = event.pageX + 'px';
                this.menu.style.top = event.pageY + 'px';
                this.menu.style.display = 'block';



            });
            key.innerText = prop;
            key.className = 'list__item-key';
            list.appendChild(listItem);
            if (typeof (object[prop]) == 'object') {
                element[prop] = {};
                element[prop].obj = object[prop];
                element[prop].elem = listItem;

                listItem.classList.add('list__item_object')
                this.bypass(listItem, object[prop], element[prop]);
            } else {
                let value = document.createElement('p');
                value.className = 'list__item-value';
                value.innerText = object[prop];
                info.appendChild(value);

            }
        }
        parent.appendChild(list);

    }

    contextMenuCreate(event) {
        let menu = document.createElement('div'),
            edit = document.createElement('button'),
            remove = document.createElement('button'),
            add = document.createElement('button'),
            body = document.querySelector('body');

        menu.append(add, edit, remove);
        menu.className = 'context-menu';

        add.innerHTML = 'Add';
        add.addEventListener('click', this.addElement.bind(this));

        edit.innerHTML = 'Edit';
        edit.addEventListener('click', this.editElement.bind(this));

        remove.innerHTML = 'Remove element';
        remove.addEventListener('click', this.removeElement.bind(this));

        body.append(menu);
        this.menu = menu;
        document.addEventListener('click', () => {
            menu.style.display = 'none';
        })
    }
    removeElement() {

        let alerts = document.querySelector('.alerts p');
        if (this.current) {
            delete this.current.object[this.current.property];
            this.current.element.remove();
            alerts.innerHTML = '';
        } else {

            alerts.innerHTML = 'First select an element';
        }

    }

    editElement() {
        let alerts = document.querySelector('.alerts p');

        if (this.current) {
            let info = this.current.element.children[0],
                key = info.querySelector(' .list__item-key'),
                value = info.querySelector(' .list__item-value');
            console.log(info, value);
            // Если уже редактируем
            if (info.classList.contains('list__item_editable')) {
                info.classList.remove('list__item_editable');
                let newKey = key.innerHTML;
                key.removeAttribute('contenteditable');




                // Если новый ключ не равен старому
                if (key.innerHTML !== this.current.property) {

                    if (typeof (this.current.object[this.current.property]) === 'object') {
                        Object.assign(this.current.object, {
                            [newKey]: this.current.object[this.current.property]
                        });

                    } else {

                        let newValue = value.innerHTML;
                        Object.assign(this.current.object, {
                            [newKey]: newValue
                        });
                        value.removeAttribute('contenteditable');

                    }

                    delete this.current.object[this.current.property];


                } else if (value.innerHTML !== this.current.object[this.current.property]) {
                    // Если изменилось только значение

                    if (typeof (this.current.object[this.current.property]) !== 'object') {

                        Object.assign(this.current.object, {
                            [this.current.property]: newValue
                        });


                    }




                }
            } else {
                info.classList.add('list__item_editable');
                key.setAttribute('contenteditable', '');
                key.focus();
                if (value) {
                    value.setAttribute('contenteditable', '');
                }

            }

            alerts.innerHTML = '';
        } else {
            alerts.innerHTML = 'First select an element';
        }
    }
    addElement() {
        console.log('add');


    }
};

let root = new Root();
root.request('https://en.wikipedia.org/w/rest.php/v1/page/Blackadder').then(function (item) {

    root.objects = JSON.parse(item);
    root.render();
}.bind(this))
console.log(root);

root.contextMenuCreate();


// 2. Сохраняем DOM элементы в root

// Алгоритм
// 1. Генерируем объект



// 3. Выводим
//     a. Навигацию
//     b. Структуру

// 4. Описываем добавление / удаление элементов / свойств

// 5. Сохраняем
//     a. LocalStorage
//     b. Server





// let root = new Root({
//     a1: {
//         b1: {
//             c: 1
//         },
//         b2: {
//             c: 222
//         },
//         b3: {
//             c: {
//                 d: 33,
//                 e: 2.5,
//                 f: {
//                     g: 9999,
//                     h: {
//                         i: {
//                             j: 1001,
//                             k: 'строка',
//                             l: [1, 2, 3]
//                         }
//                     }
//                 }
//             }
//         }
//     },
//     a2: [1, 2, '321']
// });