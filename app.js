//**Проект по подсчету доходов и расходов */
//* Все данные храняться в объесте Storage.
//* Данные состоят из массивов объектов income(доход) и expense(расход) 
//* Массивы состоят из объектов со свойствами description, value, id
const storage = {
    income:[],
    expense:[]
};

//Функции для работы с дынными:
//*1.Добавление в storage
//*2.Удаление из storage 
//*3.Вычисление значения по каждому массиву отдельно и вычисление путем слаживания значений обоих массивов

/**
 * Variables
 */
const firstForm = document.forms[0];
const allElementsForm = firstForm.elements;
const input_description = document.querySelector('.add__description');
const input_value = document.querySelector('.add__value');
const income_1 = document.querySelector('.income');
const expenses_1 = document.querySelector('.expenses');
let arrValueExpense = [];
let arrValueIncome = []
let kind = 'income'; 
let resCommon = 0;
let resExpense = 0;
let resIncome = 0;

//*Добавление

/**
 *  generate_id_todo - функция для генерирования идентификатора
 *
 */
const generate_id_todo = () => {
    const words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'.split(''); 
    const arr = words.map(index => index < 10? words[Math.floor(Math.random() * words.length)]:'');
    return arr.join('');
}

/**Событие отслеживания клика по элементам форм */
firstForm.addEventListener('change', (e) => {
    if (e.target.value === 'expense') {
        kind = 'expense';
        for (i = 0; i < allElementsForm.length; i++) {
            allElementsForm[i].classList.add('red-focus');
        }
    } else if ( e.target.value === 'income') {
        kind = 'income';
        for (i = 0; i < allElementsForm.length; i++) {
            allElementsForm[i].classList.remove('red-focus');
        }
    } 
});

firstForm.addEventListener('click', (e) => {
    if (e.target.closest('.add__btn')) {
        e.preventDefault();
        const description = input_description.value;
        const value = input_value.value;
        if (!description) return alert ('добавьте описание');
        if (!value) return alert('добавьте значение');
        if (!(input_value.classList.contains('red-focus')) && value < 0) return alert('Вы находитесь в разделе доходов, введите положительное значение');
        if (input_value.classList.contains('red-focus') && value > 0) return alert('Вы находитесь в разделе расходов, введите отрицательное значение');
        add_in_storage(kind, description, value);
        firstForm.reset();
        for (i = 0; i < allElementsForm.length; i++) {
            allElementsForm[i].classList.remove('red-focus');
        }
        kind = 'income';
    }
});

/**
 * add_in_storage - функция добавления в storage объектов
 * @param {string} kind 
 * @param {string} description 
 * @param {string} value 
 * @returns {object}
 */
const add_in_storage = ((kind, description, value) => {
    const newItem = {description, value, id: generate_id_todo()};
    if (kind === 'income') {
        arrValueIncome.push(+newItem.value);
        storage.income.push(newItem);
        add_item_in_html_income(newItem);
    } else {
        arrValueExpense.push(+newItem.value);
        storage.expense.push(newItem);
        add_item_in_html_expense(newItem);
    }
    calc_separat_kind(arrValueIncome, arrValueExpense);
    return storage;
});

/**
 * функции add_item_in_html_income и add_item_in_html_expense добавляют на страницу разметку
 * @param {Object} newItem 
 */
const add_item_in_html_income = newItem => {
    const template = createTemplate(newItem, '+');
    const income__list = document.querySelector('.income__list');
    income__list.insertAdjacentHTML('beforeend', template);
}

const add_item_in_html_expense = newItem => {
    const template = createTemplate(newItem, '');
    const expenses__list = document.querySelector('.expenses__list');
    expenses__list.insertAdjacentHTML('beforeend', template);
}

/**
 * createTemplate - функция генерации шаблонов
 * @param {object} newItem 
 */
const createTemplate = ((newItem, sign) => {
    return`
        <div class="item clearfix" data-item-id="${newItem.id}">
            <div class="item__description">${newItem.description}</div>
            <div class="right clearfix">
                <div class="item__value">${sign+newItem.value}</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>
    `;
})

/**
 * calc_separat_kind - функция для подчета сумм по каждому массиву отдельно и в общем
 * @param {Array} arrValueIncome
 * @param {Array} arrValueExpense
 */
const calc_separat_kind = ((arrValueIncome, arrValueExpense) => {
    let sumIncome = arrValueIncome.reduce((prev, next) => prev + next, 0 );
    let sumExpense = arrValueExpense.reduce((prev, next) => prev + next, 0 );
    let sumAll = sumIncome + sumExpense;
    calc_sum_all_kind_in_html(sumIncome, sumExpense, sumAll);
})

/**
 * calc_sum_all_kind_in_html - функция для вывода подсчитанных сумм в разметку
 * @param {number} sumIncome
 * @param {number} sumExpense
 * @param {number} sumAll 
 */
const calc_sum_all_kind_in_html = ((sumIncome, sumExpense, sumAll) => {
    const budget__incomeValue = document.querySelector('.budget__income--value');
    if (sumIncome > 0)  sumIncome = '+' + sumIncome;
    budget__incomeValue.textContent = sumIncome;
    const budget__expensesValue = document.querySelector('.budget__expenses--value');
    budget__expensesValue.textContent = sumExpense;
    const budget__value = document.querySelector('.budget__value');
    if (sumAll > 0)  sumAll= '+' + sumAll;
    budget__value.textContent = sumAll;
})

//*Удаление
/**Отслеживание события клик по кнопке удаления income*/
income_1.addEventListener('click', (e) => {
    if (e.target.closest('.item__delete--btn')) {
        const id = e.target.closest('.item').dataset.itemId;
        delete_in_storage_income(id);
    }
})

/**Отслеживание события клик по кнопке удаления expense*/
expenses_1.addEventListener('click', (e) => {
    if (e.target.closest('.item__delete--btn')) {
        const id = e.target.closest('.item').dataset.itemId;
        delete_in_storage_expense(id);
    }
})

/**
 * delete_in_storage_expense и elete_in_storage_income - функции удаления полей инкам и expense
 * @param {string} id 
 */
const delete_in_storage_expense = id => {
    if (!id) return alert('добавьте id');
    const check_id = storage.expense.some(item => item.id === id);
    if (!check_id) return alert('добавьте правильный id');
    storage.expense = storage.expense.filter(item => item.id !== id);
    delete_todo_from_html(id);
    return storage.expense;
}

const delete_in_storage_income = id => {
    if (!id) return alert('добавьте id');
    const check_id = storage.income.some(item => item.id === id);
    if (!check_id) return alert('добавьте правильный id');
    storage.income = storage.income.filter(item => item.id !== id);
    delete_todo_from_html(id);
    return storage.income ;
}
 
/**
 * delete_todo_from_html - функция удаления из разметки
 * @param {string} id 
 */
const delete_todo_from_html = id => {
    const target = document.querySelector(`[data-item-id = '${id}']`);
    const target_parent = target.parentElement;
    minus_calc(target);
    target_parent.removeChild(target);
}

/**
 * minus_calc - функция вычисления сумм значения которых удаляються
 * @param {object} target 
 */
const minus_calc = target => {
    if (target.closest('.income')) {
        const item_value_2 = target.querySelector('.item__value');
        const resCalc = +item_value_2.innerHTML;
        arrValueIncome = arrValueIncome.filter(item => item !== resCalc)
    }
    if (target.closest('.expenses')) {
        const item_value_2 = target.querySelector('.item__value');
        const resCalc = +item_value_2.innerHTML;
        arrValueExpense = arrValueExpense.filter(item => item !== resCalc);
    }
    calc_separat_kind(arrValueIncome, arrValueExpense);
}

