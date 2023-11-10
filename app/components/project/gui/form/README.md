Элементы форм
------------
## checkbox
Чекбокс
```pug
+checkbox()(name="agree") я согласен с #[a(href='#' target='_blank') условиями акции]
```

Радиокнопка
```pug
+checkbox()(type="radio" name="sex" value="female") Жен
+checkbox()(type="radio" name="sex" value="male") Муж
```

Радиогруппа
```pug
+radiogroup({
  "title": "В общем случае история коммитов в гит выглядит как",
  items: [
    {value: "graph", label: "Граф"},
    {value: "tree", label: "Дерево"},
    {value: "array", label: "Массив"},
    {value: "list", label: "Список"}
  ]
})(name='git')
```
## input
[Поле ввода](input/README.md)
```pug
+input()(name="name" placeholder="Имя")
+input()(name="email" placeholder="email" type="email")
+input({tag: 'textarea'})(name="description" rows="5" placeholder="Описание")

+input({title: 'Заголовок', usePlaceholderAsTitle:false})(name="description" placeholder="Заголовок")
```

## select
Простой выпадающий список
```pug
+select({options: ['Опция 1', 'Опция 2', 'Опция 3']})(name='options' placeholder="Опции 1")
+select({options: [
  {
    label: 'Опция 1',
    value: 1
  }, {
    label: 'Опция 2',
    value: 2
  }, {
    label: 'Длинная опция',
    value: 3
  }]
})(name='date' placeholder="Опции")
```
Выбор дня месяца и года
```pug
+select-date()(name='birthdate')
```
Формы
------------
Имя всех вспомогательные элементов формы (чекбоксы для открытия `select`, селекты в `select-date` и т.п.) 
начинаются со знака подчеркивания (`_`) и не уитываются при работе формы.

При изменении любого элемента формы выполняется проверка введенных данных.

Изменив функцию `get isSubmittable` можно сделать кнопку отправки формы неактивной, пока все поля не будут 
заполнены верно.

При отправке формы, если форму можно отправить (параметр `get isSubmittable`) и введенные данные прошли проверку -
форма блокируется и срабатывает событие `form:submit` при этом `event.form.params` - содержит данные формы, 
а `event.form.deferred` - jQuery.Deferred объект, который должен быть разрешен (_resolve_) или 
отклонен (_reject_), чтобы форма разблокировалась.

Если у события не было отменено действие по умолчанию (event.preventDefault()), то отправляется запрос с помощью 
компонента `api` используя аттрибуты _action_ и _method_ формы. В случае успеха сработает событие `form:response`,
ответ сервера будет передан во второй параметр слушателя (`$form.on('form:response', function(event, response){})`).
В случае ошибки сработает событие `form:error` и ошибки выведутся в форму.
```pug
+form()(action="/api/action/" method="POST")
  +button()(type="submit")
```

Валидация форм
------------

для валидации элемента формы к нему добавляется аттрибут `data-validations`.
 
Возможные параметры 
* Массив
  ``` 
  [
    {"название": {...параметры}}, 
    {"название2": {...параметры2}}
  ]
  ```
* Объект 
  ```
  {
    "название": {...параметры}, 
    "название2": {...параметры2}
  }
  ```
* Строка `название:параметр1:параметр2,название2:параметр21:параметр22` 

Доступные проверки

### required
Поле заполнено

### email
Введен email *@*.*

### name
Введено имя человека

### phone
Телефон в виде +79999999999

### phone-formatted
Телефон в виде +7 (999) 999-99-99

### regexp
Введены данные соответствующие регулярному выражению, переданному в параметрах

### password
Пароль

### length
Минимальная/максимальная длина

### chars
Введены все обязательные символы/введены только разрешенные символы

### equal
Поле эквивалентно другому полю (подтверждение пароля)

### date
Минимальное/максимально значение даты/возраста


```pug
+form.p-example__form-form
  +input()(name="firstname" placeholder="Имя" data-validations='required:Введите Ваше имя')
  +input()(name="lastname" placeholder="Фамилия" data-validations!={required:"Введите фамилию"})
  +input()(name="email" placeholder="email" data-validations='required,email')
  +input()(name="phone" placeholder="phone" data-validations='required,phone')
  +select({"title": "Опции", "options":['Опция 1', 'Опция 2', 'Опция 3']})(
    name="options"
    placeholder="Выберите 1 вариант"
    data-validations='required:Выберите один вариант'
  )
  +select-date({"title": "Дата рождения"})(name='birthdate' data-validations='required,min-date:2000-10-14:Минимальная дата 14.10.2000')
  +radiogroup({
    "title": "Пол",
    items: [
      {value: "female", label: "Жен."},
      {value: "male", label: "Муж."}
    ]
  })(name='sex' data-validations='required')
  +input()(name="password" placeholder="Пароль" type="password" data-validations='required,password')
  +input()(name="confirm-password" placeholder="Повторите пароль" type="password" data-validations='required,equal:password:Введенные пароли не совпадают')
  +checkbox()(name="agree" value="1" data-validations='required') я согласен с #[a(href='#' target='_blank') условиями акции]

  +button()(type='submit') Отправить
```
