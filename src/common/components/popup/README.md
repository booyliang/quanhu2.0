`Popup` 是一个基类组件，不要直接使用它，请使用已提供的继承它的组件，如 [`Toast`](../toast)、[`Dialog`](../dialog)、[`Menu`](../menu)、[`Modal`](../modal) 等。具体使用方法见于该组件文档。

以下内容均针对继承了 `Popup` 的组件。

## Methods

声明式调用时，组件有如下方法：

| 名称		| 说明			|
| ---		| ---			|
| `close`	| 关闭弹出层。	|
| `open`	| 打开弹出层。	|

## `options`

可传入一个 `options` 对象进行配置。该配置对象有如下属性：

| 名称				| 类型																| 说明																							| 默认值		|
| ---				| ---																| ---																							| ---
| `autoClose`		| `Boolean` / `Number`												| 自动关闭。若类型为 `Number`，以毫秒为单位，弹出层将在该时间后关闭；若值为 `true`，效果等同于 `3000`。	| `false`	|
| `blankClose`		| `Boolean`															| 点击空白区域可关闭。																				| `true`	|
| `transparentMask`	| `Boolean`															| 遮罩层透明。																					| `false`	|
| `trigger`			| `String` / `Vue` / `Element`<br>`Array<String / Vue / Element>` 	| 能够触发弹出层打开的元素。可接受值为 CSS 选择器的字符串、Vue 实例、DOM 元素，以及由上述类型组成的数组。	| -			|

> 以上默认值都可能在继承了 `Popup` 的组件内被覆盖，以该组件文档为准。