let listItem = document.createElement('li'),
    info = document.createElement('div'),
    key = document.createElement('p');
info.className = 'list__item-info';
info.append(key);

listItem.className = 'list__item';
listItem.append(info);

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

parent.appendChild(list);