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

Результат `router.getState()`

```js
{
	host: "online.moysklad.ru",
	app: "app",
	section: "demand"
	queryString: {},
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
	host: "online.moysklad.ru",
	app: "app",
	section: "demand",
	action: "edit"
	queryString: {},
	query: {
		id: "0f698528-0b8d-11e5-7a40-e897000af75f"
	}		
}
```


### router.navigate(state, [isPatch=false]) : this
**Перенаправление приложения в новое состояние.**

- `state` - объект описывающий новое состояние
- `isPatch` - `true`, если необходимо частичное обновление текущего состояния. В этом случае значение параметра `state` накладывается на активное состояние приложения.

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


### router.replaceState(state, [isPatch=false]) : this
**Замена текущего состояния приложения.**

Аналогично `router.navigate`, за тем исключением, что для установки состояния используется метод `history.replaceState`


### router.refresh() : this
**Обновление текущей страницы приложения (без перезагрузки).**

Добавляет в hash активного состояния приложения	ключ `refresh` с числовым значением текущего времени, тем самым заставляя приложение МойСклад обновить страницу. 


### router.getHashPath() : String
**Возвращает `path` для текущего #hash.**

```js
router.getHashPath() 
// → 'customerorder/edit'
```


## События `router`

`router` реализует интерфейс `EventEmitter` и генерирует следующие события:

- Запуск роутера
  `router.on('start', (router) => {...})` 

- Остановка роутера
  `router.on('stop', (router) => {...})` 
  
- Изменение текущего состояния
  `router.on('route', (state) => {...})` 






