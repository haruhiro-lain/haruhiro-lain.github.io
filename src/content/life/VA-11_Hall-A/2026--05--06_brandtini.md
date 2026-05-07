---
title: 'Brandtini'
description: '烂酒罐配方记录：甜味、时尚、惬意与陈化、调和风格的 Brandtini。'
pubDate: '2026-05-06'
heroImage: ./assets/2026--05--06_brandtini/6-Brandtini.png
tags: ['VA-11 Hall-A', '调酒', '配方']
---

# <span style="color:#DC143C; font-weight:bold;">Brandtini</span>

口味：甜味        类型：时尚、惬意        调制方式：陈化、调和

**配料：**

伏特加 0.75盎司        金酒 0.75盎司        橙味利口酒 0.5盎司        单一糖浆 0.5盎司

青柠汁 0.75盎司        橙汁 0.75盎司        蔓越莓汁 2盎司

**制作步骤：**

1 将所有配料放入装满冰块的摇壶中。

2 盖上摇壶用力摇和。

3 将过滤的酒液倒入玻璃杯中，玻璃杯越漂亮酒就越好喝。 ;)

```haskell
record DrinkMenu where
	constructor MkDrinkMenu
	spiritIngredients : List String
	allIngredients    : List String

myBrandtiniMenu : DrinkMenu
myBrandtiniMenu = MkDrinkMenu
	["伏特加", "金酒", "橙味利口酒"]
	["伏特加", "金酒", "橙味利口酒", "单一糖浆", "青柠汁", "橙汁", "蔓越莓汁"]

```

![Brandtini](./assets/2026--05--06_brandtini/6-Brandtini.png)
