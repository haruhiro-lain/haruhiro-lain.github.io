---
title: 'Blue Fairy'
description: '甜味、女性化、温和与陈化、调和风格'
pubDate: '2026-05-06'
heroImage: ./assets/2026--05--06_blue-fairy/5-BlueFairy.png
tags: ['甜味', '女性化', '温和']
---

# <span style="color:#87CEFA">Blue Fairy</span>


**配料：**

潘诺酒 1盎司        蓝橙利口酒 1盎司        柠檬汁 1盎司        水 2盎司

**制作步骤：**

1 将所有配料放入装满冰块的摇壶中。

2 盖上摇壶用力摇和，然后过滤到玻璃杯中；如有需要，可以加入摇壶中的冰块。

3 无酒精版需要将八角放入热且不沸的水中，浸泡10分钟后过滤，放置冷却。

4 冷却后，将2盎司的八角水与单一糖浆、柠檬汁、蓝色可食用色素和水一起放入装满冰块的摇壶中，重复步骤2。



**无酒精版**

八角 4-5颗        柠檬汁 1盎司        热水（冲泡用） 8盎司

水 2盎司        单一糖浆 0.5盎司        蓝色可食用色素 1滴

```haskell
record DrinkMenu where
	constructor MkDrinkMenu
	spiritIngredients : List String
	allIngredients    : List String

myBlueFairyMenu : DrinkMenu
myBlueFairyMenu = MkDrinkMenu
	["潘诺酒", "蓝橙利口酒"]
	["潘诺酒", "蓝橙利口酒", "柠檬汁", "水", "热水", "单一糖浆", "蓝色可食用色素"]

```

![Blue Fairy](./assets/2026--05--06_blue-fairy/5-BlueFairy.png)
