---
title: 'Marsblast'
description: '烂酒罐配方记录：辛辣、男性化、强烈与调和风格的 Marsblast。'
pubDate: '2026-05-06'
heroImage: ./assets/2026--05--06_marsblast/14-Marsblast.png
tags: ['VA-11 Hall-A', '调酒', '配方']
---

# <span style="color:#FFC107; font-weight:bold;">Marsblast</span>

口味：辛辣        类型：男性化、强烈        调制方式：调和

**配料：**

龙舌兰 2盎司        柠檬汁 1盎司        橙汁 3盎司

苦精 2酹        辣酱 1/4茶匙        汤力水 1盎司

**制作步骤：**

1 将除汤力水外的所有配料放入装满冰块的摇壶中。

2 盖上摇壶用力摇和，然后过滤到玻璃杯中；如有需要，可以加入摇壶中的冰块。

3 加入汤力水，搅拌均匀。

```haskell
record DrinkMenu where
	constructor MkDrinkMenu
	spiritIngredients : List String
	allIngredients    : List String

myMarsblastMenu : DrinkMenu
myMarsblastMenu = MkDrinkMenu
	["龙舌兰"]
	["龙舌兰", "柠檬汁", "橙汁", "辣酱", "汤力水"]

```

![Marsblast](./assets/2026--05--06_marsblast/14-Marsblast.png)
