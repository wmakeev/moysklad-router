moysklad-router
===============

[![npm](https://img.shields.io/npm/v/moysklad-router.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/moysklad-router) [![Travis](https://img.shields.io/travis/wmakeev/moysklad-router.svg?maxAge=2592000&style=flat-square)](https://travis-ci.org/wmakeev/moysklad-router) [![Coveralls](https://img.shields.io/coveralls/wmakeev/moysklad-router.svg?maxAge=2592000&style=flat-square)](https://coveralls.io/github/wmakeev/moysklad-router) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/) [![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Библиотека для управления текущим url приложения МойСклад.

TODO https://github.com/RichardLitt/standard-readme/blob/master/spec.md

## Использование

- [Создание экземпляра](#Создание-экземпляра)
- [router.start() : this](#routerstart--this)
- [router.stop() : this](#routerstop--this)
- [router.getState() : Object](#routergetstate--object)
- [router.navigate(state, [isPatch=false]) : this](#routernavigatestate-ispatchfalse--this)
- [router.navigate(path, [query|uuid], [isPatch=false]) : this](#routernavigatepath-queryuuid-ispatchfalse--this)
- [router.replaceState(args...) : this](#routerreplacestateargs--this)
- [router.refresh() : this](#routerrefresh--this)
- [router.getPath() : String](#routergetpath--string)
- [router.getSection() : String](#routergetsection--string)
- [router.getAction() : String](#routergetaction--string)
- [router.getQuery() : Object](#routergetquery--object)
- [События](#События-router)

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
| `state`  | `Object` | объект описывающий новое состояние | обязательный
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


### router.getPath() : String
**Возвращает текущий `path` состояния**

```js
// #customerorder/edit?id=123-456-789

router.getPath()
// → 'customerorder/edit'
```

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

### router.getQuery() : Object
**Возвращает текущий `query` состояния**

```js
// #customerorder/edit?id=123-456-789

router.getQuery()
// → { id: '123-456-789' }
```


## События `router`

`router` реализует интерфейс `EventEmitter` и генерирует следующие события:

- Запуск роутера
  `router.on('start', (router) => {...})`

- Остановка роутера
  `router.on('stop', (router) => {...})`

- Изменение текущего состояния
  `router.on('route', (state, router) => {...})`
