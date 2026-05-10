---
title: 'Moonblast'
description: '甜味、女性化、惬意与加冰、调和风格'
pubDate: '2026-05-06'
heroImage: ./assets/2026--05--06_moonblast/16-Marblast.png
tags: ['甜味', '女性化', '惬意']
---

# <span style="color:#E6678A; font-weight:bold;">Moonblast</span>


**配料：**

白朗姆酒 1.5盎司        蓝橙利口酒 少许        单一糖浆 1盎司

石榴汁 1盎司        菠萝汁 0.25盎司        苏打水 2盎司

**制作步骤：**

1 将除苏打水外的所有配料放入装满冰块的摇壶中。

2 盖上摇壶用力摇和，然后过滤到玻璃杯中；如有需要，可以加入摇壶中的冰块。

3 加入苏打水，搅拌均匀。

```haskell
record DrinkMenu where
	constructor MkDrinkMenu
	spiritIngredients : List String
	allIngredients    : List String

myMoonblastMenu : DrinkMenu
myMoonblastMenu = MkDrinkMenu
	["白朗姆酒", "蓝橙利口酒"]
	["白朗姆酒", "蓝橙利口酒", "单一糖浆", "石榴汁", "菠萝汁", "苏打水"]

```

![Moonblast](./assets/2026--05--06_moonblast/16-Marblast.png)
