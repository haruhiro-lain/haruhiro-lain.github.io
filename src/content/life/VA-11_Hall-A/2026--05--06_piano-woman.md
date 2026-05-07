---
title: 'Piano Woman'
description: '烂酒罐配方记录：甜味、宣传、惬意与陈化、调和风格的 Piano Woman。'
pubDate: '2026-05-06'
heroImage: ./assets/2026--05--06_piano-woman/18-PianoWoman.png
tags: ['VA-11 Hall-A', '调酒', '配方']
---

# <span style="color:#3A6EA5; font-weight:bold;">Piano Woman</span>

口味：甜味        类型：宣传、惬意        调制方式：陈化、调和

**配料：**

黑朗姆酒 0.75盎司        蓝橙利口酒 0.5盎司        紫罗兰利口酒 0.5盎司

单一糖浆 0.75盎司        青柠汁 0.5盎司        汤力水 1盎司

**制作步骤：**

1 将除汤力水外的所有配料放入装满冰块的摇壶中。

2 盖上摇壶用力摇和，然后过滤到玻璃杯中；如有需要，可以加入摇壶中的冰块。

3 加入1.5盎司汤力水，搅拌均匀。

```haskell
record DrinkMenu where
	constructor MkDrinkMenu
	spiritIngredients : List String
	allIngredients    : List String

myPianoWomanMenu : DrinkMenu
myPianoWomanMenu = MkDrinkMenu
	["黑朗姆酒", "蓝橙利口酒", "紫罗兰利口酒"]
	["黑朗姆酒", "蓝橙利口酒", "紫罗兰利口酒", "单一糖浆", "青柠汁", "汤力水"]

```

![Piano Woman](./assets/2026--05--06_piano-woman/18-PianoWoman.png)
