---
title: 'Sunshine Cloud'
description: '烂酒罐配方记录：苦味、女性化、温和与加冰、调和风格的 Sunshine Cloud。'
pubDate: '2026-05-06'
heroImage: ./assets/2026--05--06_sunshine-cloud/22-SunshineCloud.png
tags: ['VA-11 Hall-A', '调酒', '配方']
---

# <span style="color:#F4A460; font-weight:bold;">Sunshine Cloud</span>

口味：苦味        类型：女性化、温和        调制方式：加冰、调和

**配料：**

伏特加 1.5盎司        可可利口酒 1盎司        波本威士忌 1盎司

苦精 3酹        全脂牛奶 2.5盎司

**制作步骤：**

1 将所有配料放入装满冰块的摇壶中。

2 盖上摇壶用力摇和。

3 将酒液和冰块一起倒入杯中。

```haskell
record DrinkMenu where
	constructor MkDrinkMenu
	spiritIngredients : List String
	allIngredients    : List String

mySunshineCloudMenu : DrinkMenu
mySunshineCloudMenu = MkDrinkMenu
	["伏特加", "波本威士忌"]
	["伏特加", "可可利口酒", "波本威士忌", "全脂牛奶"]

```

![Sunshine Cloud](./assets/2026--05--06_sunshine-cloud/22-SunshineCloud.png)
