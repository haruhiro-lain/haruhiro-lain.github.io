---
title: 'Bleeding Jane'
description: '烂酒罐配方记录：辛辣、经典、解酒与调和风格的 Bleeding Jane。'
pubDate: '2026-05-06'
heroImage: ./assets/2026--05--06_bleeding-jane/3-BleedingJane.png
tags: ['VA-11 Hall-A', '调酒', '配方']
---

# <span style="color:#B22222; font-weight:bold;">Bleeding Jane</span>

口味：辛辣        类型：经典、解酒        调制方式：调和

**配料：**

蔬菜汁 6盎司        辣根 0.5茶匙        番茄酱 1茶匙        辣酱 少许

柠檬汁 1茶匙        酸泡菜汁 1盎司        椒盐 适量

**制作步骤：**

1 将所有配料放入装满冰块的摇壶中。

2 盖上摇壶用力摇和。

3 将过滤的酒液倒入玻璃杯中；如有需要，可以加入摇壶中的冰块。

```haskell
record DrinkMenu where
	constructor MkDrinkMenu
	spiritIngredients : List String
	allIngredients    : List String

myBleedingJaneMenu : DrinkMenu
myBleedingJaneMenu = MkDrinkMenu
	[]
	["蔬菜汁", "辣根", "番茄酱", "辣酱", "柠檬汁", "酸泡菜汁", "椒盐"]

```

![Bleeding Jane](./assets/2026--05--06_bleeding-jane/3-BleedingJane.png)
