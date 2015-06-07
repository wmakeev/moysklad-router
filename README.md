moysklad-router
===============

Библиотека для управления текущим url приложения МойСклад.

## Использование

### Создание экземпляра

```js
var router = MoyskladRouter();
```

###  router.start()
Включает отслеживание текущего состояния.

#### returns `this`

###  router.stop()
Выключает отслеживание состояния.

#### returns `this`

###  router.getState()
Возвращает копию текущего состояния.

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

#### returns `Object`

###  router.navigate(state, [isPatch=false])
Перенаправление приложения в новое состояние.

`state` - объект описывающий новое состояние
`isPatch` - `true`, если необходимо частичное обновление текущего состояния. В этом случае значение параметра `state` накладывается на активное состояние приложения.

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

#### returns `this`

###  router.replaceState(state, [isPatch=false])
Замена текущего состояния приложения.

Аналогично `router.navigate`, за тем исключением, что для установки состояния используется метод `history.replaceState`

#### returns `this`


###  router.refresh()
Обновление текущей страницы приложения (без перезагрузки).

Добавляет в hash активного состояния приложения	ключ `refresh` с числовым значением текущего времени, тем самым заставляя приложение МойСклад обновить страницу. 

#### returns `this`

###  router.getHashPath()
Возвращает `path` для текущего #hash.

```js
router.getHashPath() 
// → 'customerorder/edit'
```

#### returns `String`

## События `router`

`router` реализует интерфейс `EventEmitter` и генерирует следующие события:

- Запуск роутера
  `router.on('start', (router) => {...})` 

- Остановка роутера
  `router.on('stop', (router) => {...})` 
  
- Изменение текущего состояния
  `router.on('route', (state) => {...})` 






