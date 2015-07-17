moysklad-router
===============

Библиотека для управления текущим url приложения МойСклад.

## Использование

### Создание экземпляра

```js
var router = MoyskladRouter();
```

### router.start() : this
**Включает отслеживание текущего состояния.**


### router.stop() : this
**Выключает отслеживание состояния.**


### router.getState() : Object
**Возвращает копию текущего состояния.**

Пример url состояния для раздела "Отгрузки" с примененным фильтром "Проведенные отгрузки с 01.06.2015 00:00":

```
https://online.moysklad.ru/app/#demand?global_periodFilter=01.06.2015%2000:00:00,&global_operationApprovalState=1
```

Результат вызова `router.getState()`,

```js
{
	path: 'demand',
	query: {
		global_periodFilter: ["01.06.2015 00:00:00",""],
		global_operationApprovalState: "1"
	}
}
```

или пример для отдельного документа "Отгрузка"

```
https://online.moysklad.ru/app/#demand/edit?id=0f698528-0b8d-11e5-7a40-e897000af75f
```

```js
{
	path: 'demand/edit',
	query: {
		id: "0f698528-0b8d-11e5-7a40-e897000af75f"
	}		
}
```


### router.navigate(state, [isPatch=false]) : this
**Перенаправляет приложение в новое состояние (новое состояние добавляется в историю навигации браузера).**

| Аргумент | Тип      | Описание | Значение по умолчанию
-----------|----------|----------|----------------------
| `state`  | `String` | объект описывающий новое состояние | обязательный
| `isPatch`| `Boolean`| `true`, если необходимо частичное обновление состояния `query`. В этом случае значение параметра `state` накладывается на активное состояние приложения. | false

Пример вызова: 

```js
var curState = router.getState();
curState.query.id = '0f698528-0b8d-11e5-7a40-e897000af75f';
router.navigate(curState);
```

аналогичная запись с флагом `isPatch` = `true` 

```js
router.navigate({
	query: {
		id: '0f698528-0b8d-11e5-7a40-e897000af75f'
	}
}, true)
```

### router.navigate(path, [query|uuid], [isPatch=false]) : this
**Перенаправляет приложение в новое состояние (новое состояние добавляется в историю навигации браузера).**

| Аргумент | Тип      | Описание | Значение по умолчанию
-----------|----------|----------|----------------------
| `path`   | `String` | значение ключа `path` состояния приложения | обязательный
| `query`  | `Object` | значение ключа `query` состояния приложения | { }
| `uuid`   | `String` | идентификатор документа для раздела `path`,  аналогично `query` со значением `{id: uuid}` | нет
| `isPatch`| `Boolean`| `true`, если необходимо частичное обновление состояния `query`. В этом случае значение параметра `query` накладывается на активное значение `query` состояния приложения. | false

Все три вызова `navigate` показанные ниже аналогичны:

```js
router.navigate({ 
	path: 'customerorder/edit', 
	query: { id: uuid }
});
	
router.navigate('customerorder/edit', uuid)

router.navigate('customerorder/edit', { id: uuid })
```

Если вы находитесь на странице редактирования заказа, то перейти к другому заказу можно следующим вызовом:

```js
router.navigate({ 
	query: { id: uuid }
}, true);
```


### router.replaceState(args...) : this
**Перенаправляет приложение в новое состояние (новое состояние НЕ добавляется в историю навигации браузера).**

Вызов метода аналогичен вызову `router.navigate`, за тем исключением, что для установки состояния используется метод `history.replaceState` (т.е. не затрагивается история навигации).


### router.refresh() : this
**Обновляет текущую страницу приложения без перезагрузки.**

Своего рода "хак", который позволяет реализовать обновление текущей страницы приложения МойСклад без перезагрузки страницы в браузере.

Реализуется через добавление в hash url ключа `refresh` с числовым значением текущего времени, тем самым заставляя МойСклад обновить страницу.


### router.getSection() : String
**Возвращает текущий раздел**

```js
// #customerorder/edit

router.getSection() 
// → 'customerorder'
```

### router.getAction() : String
**Возвращает текущую операцию**

```js
// #customerorder/edit

router.getAction() 
// → 'edit'
```


## События `router`

`router` реализует интерфейс `EventEmitter` и генерирует следующие события:

- Запуск роутера
  `router.on('start', (router) => {...})` 

- Остановка роутера
  `router.on('stop', (router) => {...})` 
  
- Изменение текущего состояния
  `router.on('route', (state, router) => {...})` 
