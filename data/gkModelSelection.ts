export type GkModelHit = {
	id: number;
	name: string;
	link: string;
	image: string;
	maker?: string;
	series?: string;
	/** 从产品页面抓取的所有属性字段 */
	tags?: string[];
};

export type GkAutoSelectRule = {
	/** 制作字段包含该文本时命中（不区分大小写） */
	makerIncludes?: string;
	/** 系列字段包含该文本时命中（不区分大小写） */
	seriesIncludes?: string;
};

export type GkModelSelection = {
	/** 由 sync-hpoi 脚本自动填充，不要手动修改 */
	allModels: GkModelHit[];
	/** 按 HPOI 链接指定要展示的条目，空数组 = 不按链接筛选 */
	selectedLinks: string[];
	/** 按名称指定要展示的条目，空数组 = 不按名称筛选 */
	selectedNames: string[];
	/** 根据 制作+系列 条件自动追加 selectedNames（不会删除手动项） */
	autoSelectRules: GkAutoSelectRule[];
	/** 最多展示条数，0 = 不限制 */
	maxVisible: number;
};

export const gkModelSelection: GkModelSelection = {
	// @@ALLMODELS_START
	allModels: [
		{ id: 54, name: "30MP 后藤独", link: "https://www.hpoi.net/hobby/101146", image: "https://rfx.hpoi.net/gk/cover/n/2025/02/eba5b4b99c724919b763142f69738595.jpg", maker: "BANDAI SPIRITS", series: "30MP", tags: ["30MP 後藤ひとり","女 、 比例人形 、 观感安心 、 需拼装 、 可动","2025年3月22日","Non","BANDAI SPIRITS","30MP","后藤独","孤独摇滚！"] },
		{ id: 53, name: "粘土人#2242 孤独摇滚！ 伊地知虹夏", link: "https://www.hpoi.net/hobby/82023", image: "https://rfx.hpoi.net/gk/cover/n/2023/09/8e36733ce7e340b58a44849f7fec19a4.jpg", maker: "良笑", series: "粘土人", tags: ["ねんどろいど ぼっち・ざ・ろっく！ いじちにじか","女 、 Q版人形 、 观感安心 、 可动","2025/9/25 , 7,500日元（税）","Non","良笑","粘土人","Nendoron 、 dogu","伊地知虹夏","孤独摇滚！","塑料","H=100mm"] },
		{ id: 52, name: "命运-冠位指定 盾兵-玛修·基列莱特", link: "https://www.hpoi.net/hobby/41350", image: "https://rfx.hpoi.net/gk/cover/n/2022/10/d13a63220bbf4b29b16b29afa86e6d03.jpg", maker: "Stronger", series: "", tags: ["Fate/Grand Order シールダー/マシュ・キリエライト","女 、 比例人形 、 观感安心","2022/11 , 21,900日元（税）","1/7","Stronger","デイラ","玛修·基列莱特","命运-冠位指定","H=310mm","PVC, ABS"] },
		{ id: 51, name: "30MS SIS-N00 苍丽[配色B]", link: "https://www.hpoi.net/hobby/101160", image: "https://rfx.hpoi.net/gk/cover/n/2025/02/3f4b9d68bd9d460d8ce2c9ab28300349.jpg", maker: "BANDAI SPIRITS", series: "30MS", tags: ["30MS SIS-N00 ソウレイ[カラーB]","女 、 比例人形 、 观感安心 、 可动 、 需拼装","2,750日元 （含税，118元）","2025年2月15日","Non","BANDAI SPIRITS","30MS"] },
		{ id: 50, name: "Fate/Grand Order 贞德[Alter] 制服", link: "https://www.hpoi.net/hobby/49346", image: "https://rfx.hpoi.net/gk/cover/n/2019/05/a1fb40df263b4cae871ac9d6372d1140.jpg", maker: "", series: "", tags: ["フェイト/グランドオーダー ジャンヌ・ダルク [オルタ] ユニホーム","女 、 比例人形 、 观感温和 、 GK","2019/4/30 , 15,000日元（税）","Non","Grizzry Panda","贞德 [Alter]","命运-冠位指定"] },
		{ id: 49, name: "Fate/Grand Order 阿尔托莉雅[Alter] 礼服ver.", link: "https://www.hpoi.net/hobby/41862", image: "https://rfx.hpoi.net/gk/cover/n/2018/02/e205532693e54a2fa3da546feb42568e.jpg", maker: "", series: "Wonder Festival 2018[冬]", tags: ["Fate/Grand Order アルトリア[オルタ] ドレスver.","女 、 比例人形 、 观感安心 、 GK","2018/12/16 , 17,000日元（税）","1/7","Primal Heart","Wonder Festival 2018[冬]","桥本凉","阿尔托莉雅·潘德拉贡（Alter）","命运-冠位指定"] },
		{ id: 48, name: "命运-冠位指定 爱尔奎特·布伦史塔德", link: "https://www.hpoi.net/hobby/81957", image: "https://rfx.hpoi.net/gk/cover/n/2023/02/3c51d4496fe849d9a2f75ede56924142.jpg", maker: "Grizzly Panda", series: "", tags: ["フェイト/グランドオーダ アルクェイド・ブリュンスタッド","女 、 比例人形 、 观感安心 、 需拼装 、 未上色 、 GK","2023年2月12日","Non","Grizzly Panda","Grizzry Panda","爱尔奎特·布伦史坦德","命运-冠位指定","树脂"] },
		{ id: 47, name: "Chitocerium VI-carbonia adamas", link: "https://www.hpoi.net/hobby/44348", image: "https://rfx.hpoi.net/gk/cover/n/2019/07/f6e2b2b4b2b747f7a3ab9de93f8185b5.jpg", maker: "良笑", series: "Chitocerium", tags: ["チトセリウム オリジナル キャラクター"] },
		{ id: 46, name: "赛马娘 目白麦昆", link: "https://www.hpoi.net/hobby/69321", image: "https://rfx.hpoi.net/gk/cover/n/2021/10/6d376eb6166246429effc9e361686cf6.jpg", maker: "", series: "", tags: ["ウマ娘 メジロマックイーン","女 、 比例人形 、 观感安心 、 GK 、 未上色 、 需拼装","2021年10月9日","Non","Origin Corporation","目白麦昆","赛马娘Pretty Derby"] },
		{ id: 45, name: "女神装置 朱罗 弓兵 绊", link: "https://www.hpoi.net/hobby/80894", image: "https://rfx.hpoi.net/gk/cover/n/2024/02/c82af96367b644b6b7b8f1a0e10d70e3.jpg", maker: "寿屋", series: "女神装置", tags: ["メガミデバイス 朱羅 弓兵 絆(きずな)"] },
		{ id: 44, name: "阿尔卡纳蒂亚 薇儿蕾特", link: "https://www.hpoi.net/hobby/61513", image: "https://rfx.hpoi.net/gk/cover/n/2022/05/9f63b89f74af4d56a361d30c38d33ba3.jpg", maker: "寿屋", series: "阿尔卡纳蒂亚", tags: ["アルカナディア ヴェルルッタ"] },
		{ id: 43, name: "赛马娘 北部玄驹", link: "https://www.hpoi.net/hobby/75567", image: "https://rfx.hpoi.net/gk/cover/n/2022/07/44ed88d93a3c4686afa6d7cff9f0e5c2.jpeg", maker: "Crea Mode", series: "", tags: ["ウマ娘 プリティーダービー キタサンブラック","女 、 比例人形 、 观感安心 、 GK 、 未上色 、 需拼装","2022年7月24日","1/7","Crea Mode","真边菜月","北部玄驹","赛马娘Pretty Derby","树脂"] },
		{ id: 42, name: "赛马娘 里见光钻", link: "https://www.hpoi.net/hobby/76025", image: "https://rfx.hpoi.net/gk/cover/n/2022/07/5e2c2fe4f8f0493b94f900305bb2e5e4.jpg", maker: "Crea Mode", series: "", tags: ["ウマ娘 プリティーダービー サトノダイヤモンド","女 、 比例人形 、 观感安心 、 未上色 、 需拼装 、 GK","2022年7月24日","1/7","Crea Mode","真边菜月","里见光钻","赛马娘Pretty Derby","树脂"] },
		{ id: 41, name: "Fate/Grand Order 阿尔托莉雅 Alter 制服Ver.", link: "https://www.hpoi.net/hobby/50744", image: "https://rfx.hpoi.net/gk/cover/n/2019/07/f63935f55907464bae59cd243521f611.jpg", maker: "Grizzly Panda", series: "", tags: ["フェイト/グランドオーダー アルトリアオルタ 制服ver.","女 、 比例人形 、 观感安心 、 需拼装 、 未上色 、 GK","2019/12/1 , 15,000日元","Non","Grizzly Panda","Grizzry Panda","阿尔托莉雅·潘德拉贡（Alter）","命运-冠位指定","树脂"] },
		{ id: 40, name: "粘土人 #195 电波女与青春男 艾莉欧", link: "https://www.hpoi.net/hobby/6919", image: "https://rfx.hpoi.net/gk/cover/n/2015/03/d9150c87c81944a485a482885fc91ddc.jpg", maker: "良笑", series: "粘土人", tags: ["ねんどろいど 電波女と青春男 エリオ"] },
		{ id: 39, name: "VOCALOID 初音未来 10周年纪念Ver.", link: "https://www.hpoi.net/hobby/38669", image: "https://rfx.hpoi.net/gk/cover/n/2017/11/4529a640b8ac4994a138cf2cf68333ef.jpg", maker: "良笑", series: "", tags: ["VOCALOID 初音ミク 10th Anniversary Ver.","女 、 比例人形 、 观感安心","2019/5/23 , 25,000日元（税） , 画集同捆","1/7","良笑","河原隆幸","KEI","初音未来","VOCALOID","H=270mm","PVC, ABS"] },
		{ id: 38, name: "粘土人#2368 葬送的芙莉莲 菲伦", link: "https://www.hpoi.net/hobby/91144", image: "https://rfx.hpoi.net/gk/cover/n/2023/12/fe95b624cbfa44788d49b5f04a6444a5.jpg", maker: "良笑", series: "粘土人", tags: ["ねんどろいど 葬送のフリーレン フェルン"] },
		{ id: 37, name: "粘土人#1970 吉尔·斯汀雷", link: "https://www.hpoi.net/hobby/75271", image: "https://rfx.hpoi.net/gk/cover/n/2022/09/36045d918d2740d3b93f340d1bd84a9d.jpg", maker: "良笑", series: "粘土人", tags: ["ねんどろいど ジル・スティングレイ"] },
		{ id: 36, name: "苏菲的炼金工房 ～不可思议书的炼金术士～ 普拉芙妲", link: "https://www.hpoi.net/hobby/37999", image: "https://rfx.hpoi.net/gk/cover/n/2017/08/54c16764ae824698ad29ed7898f443d3.jpg", maker: "Alter", series: "", tags: ["ソフィーのアトリエ ～不思議な本の錬金術士～ プラフタ","女 、 比例人形 、 观感安心","2022/1/7 , 19,580日元（税）","1/7","Alter","槙尾宗利","铁森七方","普拉芙妲","苏菲的炼金工房 ～不可思议书的炼金术士～","H=130mm","ABS, PVC"] },
		{ id: 35, name: "女神装置 弹丸骑士 驱魔人 寡妇", link: "https://www.hpoi.net/hobby/66139", image: "https://rfx.hpoi.net/gk/cover/n/2021/05/606c420768ee42c983a4f172f5e37750.jpg", maker: "寿屋", series: "弹丸骑士 、 女神装置", tags: ["メガミデバイス BULLET KNIGHTS エクソシスト"] },
		{ id: 34, name: "赛马娘趴趴4", link: "https://www.hpoi.net/hobby/77206", image: "https://rfx.hpoi.net/gk/cover/n/2023/08/d73bc65d9a9f4eff907aab89660cce1b.jpg", maker: "FuRyu", series: "方块趴趴", tags: ["ウマ娘 プリティーダービー ひっかけフィギュアVol.4"] },
		{ id: 33, name: "迷你黏土人 VOCALOID 初音未来 深海少女", link: "https://www.hpoi.net/hobby/23836", image: "https://rfx.hpoi.net/gk/cover/n/2016/04/d3371559f4684d46a204e0772e58ebc1.jpg", maker: "良笑", series: "迷你黏土人 初音未来 セレクション 、 迷你粘土人", tags: ["ねんどろいど ぷち VOCALOID 初音ミク 深海少女"] },
		{ id: 32, name: "女神装置 10 弹丸骑士 炮兵", link: "https://www.hpoi.net/hobby/42213", image: "https://rfx.hpoi.net/gk/cover/n/2018/12/a419c1072e3247e1a3261b2c7d4b6b87.jpeg", maker: "寿屋", series: "弹丸骑士 、 女神装置", tags: ["メガミデバイス (10) BULLET KNIGHTS ランチャー"] },
		{ id: 31, name: "赛马娘 米浴", link: "https://www.hpoi.net/hobby/75584", image: "https://rfx.hpoi.net/gk/cover/n/2022/07/206c113d8da647cf9e0c9340af98a677.jpg", maker: "", series: "", tags: ["ウマ娘 プリティーダービー ライスシャワー","女 、 比例人形 、 观感安心 、 未上色 、 需拼装 、 GK","2021年12月11日","1/7","黒川りく","米浴","赛马娘Pretty Derby","树脂"] },
		{ id: 30, name: "MG 1/100 巴巴托斯高达", link: "https://www.hpoi.net/hobby/50611", image: "https://rfx.hpoi.net/gk/cover/n/2020/12/b77744f6af5342bba3a609a506eaf3c1.jpg", maker: "BANDAI SPIRITS", series: "MG", tags: ["MG 1/100 ガンダムバルバトス"] },
		{ id: 29, name: "碧蓝航线 圣路易斯", link: "https://www.hpoi.net/hobby/44117", image: "https://rfx.hpoi.net/gk/cover/n/2018/08/ae04c3bf5ce14feb91a71d5bb9a00446.png", maker: "", series: "", tags: ["アズールレーン セントルイス","女 、 比例人形 、 观感安心 、 需拼装 、 未上色 、 GK","2018/12/16 , 19,000日元（税）","1/7","桥本凉","圣路易斯","碧蓝航线"] },
		{ id: 28, name: "东方Project 十六夜咲夜", link: "https://www.hpoi.net/hobby/61769", image: "https://rfx.hpoi.net/gk/cover/n/2020/10/48e789a130af47d186baae90fdd09c0f.jpg", maker: "", series: "", tags: ["東方Project 十六夜咲夜","女 、 比例人形 、 观感安心 、 GK 、 未上色 、 需拼装","2020年10月3日","1/7","子木","奶牛","十六夜咲夜","东方Project"] },
		{ id: 27, name: "女神装置 朱罗 玉藻前", link: "https://www.hpoi.net/hobby/63381", image: "https://rfx.hpoi.net/gk/cover/n/2020/12/90b56457400c4646be8c5a337d4e4b4a.jpg", maker: "寿屋", series: "女神装置", tags: ["メガミデバイス 朱羅 玉藻ノ前"] },
		{ id: 26, name: "命运-冠位指定 制服玛修", link: "https://www.hpoi.net/hobby/75572", image: "https://rfx.hpoi.net/gk/cover/n/2022/07/07e53bd9298b4b7b959d8ddf4ab5db28.jpeg", maker: "Grizzly Panda", series: "", tags: ["フェイト/グランドオーダー 制服マシュ","女 、 比例人形 、 观感安心 、 需拼装 、 未上色 、 GK","2022年7月24日","Non","Grizzly Panda","Grizzry Panda","玛修·基列莱特","命运-冠位指定","树脂"] },
		{ id: 25, name: "RG#21 GNT-0000 量子型00高达", link: "https://www.hpoi.net/hobby/20014", image: "https://rfx.hpoi.net/gk/cover/n/2026/03/afac90f9a6674210ae42a05963729b4f.jpg", maker: "万代", series: "RG", tags: ["RG 1/144 GNT-0000 ダブルオークアンタ"] },
		{ id: 24, name: "粘土人#725 为美好的世界献上祝福！2 惠惠", link: "https://www.hpoi.net/hobby/34973", image: "https://rfx.hpoi.net/gk/cover/n/2017/01/c5774051855846aeaa12070447ecb04a.jpg", maker: "良笑", series: "粘土人", tags: ["ねんどろいど #725 この素晴らしい世界に祝福を！2 めぐみん"] },
		{ id: 23, name: "阿尔托莉雅·潘德拉贡", link: "https://www.hpoi.net/hobby/44125", image: "https://rfx.hpoi.net/gk/cover/n/2018/07/a351b9383fc44b96a9f7c557f46e25cd.jpg", maker: "", series: "", tags: ["アルトリア・ペンドラゴン","女 、 比例人形 、 观感安心 、 GK","2018年7月29日","Non","Fio","阿尔托莉雅·潘德拉贡"] },
		{ id: 22, name: "RG#32 RX-93  ν高达", link: "https://www.hpoi.net/hobby/49074", image: "https://rfx.hpoi.net/gk/cover/n/2026/03/414bd7a281a84ac4872fb9a6d3bca68e.jpeg", maker: "BANDAI SPIRITS", series: "RG", tags: ["RG 1/144 νガンダム"] },
		{ id: 21, name: "MG 1/100 机动战士高达UC RX-0 独角兽高达2号机 报丧女妖", link: "https://www.hpoi.net/hobby/9982", image: "https://rfx.hpoi.net/gk/cover/n/2020/04/a78113e0138247548a6481e8d55ff119.jpg", maker: "万代", series: "MG", tags: ["MG 1/100 機動戦士ガンダムUC RX-0 ユニコーンガンダム2号機 バンシィ"] },
		{ id: 20, name: "伤物语 忍野忍 姬丝秀忒 刃下心 小忍 少女ver.", link: "https://www.hpoi.net/hobby/38030", image: "https://rfx.hpoi.net/gk/cover/n/2017/12/429b2151804c4e07839a1bb42b2b5acf.jpg", maker: "良笑", series: "", tags: ["傷物語 キスショット・アセロラオリオン・ハートアンダーブレード 少女Ver.","女 、 比例人形 、 观感安心","2019年4月24日","1/8","良笑","jarel","終","忍野忍","伤物语 、 伤物语III 冷血篇","H=200mm","PVC, ABS"] },
		{ id: 19, name: "女神装置  机甲爱丽丝 金潟直美​", link: "https://www.hpoi.net/hobby/51486", image: "https://rfx.hpoi.net/gk/cover/n/2021/01/b582dbf2950c4260899f732f284e8b39.jpeg", maker: "寿屋", series: "女神装置", tags: ["メガミデバイス アリス・ギア・アイギ 金潟すぐみ"] },
		{ id: 18, name: "东方Project 魂魄妖梦", link: "https://www.hpoi.net/hobby/50795", image: "https://rfx.hpoi.net/gk/cover/n/2019/07/c7f84dff7dd04ecba076380166021fbb.jpg", maker: "Flat Work!", series: "", tags: ["東方Project 魂魄妖夢","女 、 比例人形 、 观感安心 、 GK","2019年7月28日","Non","Flat Work!","ぱっとん","魂魄妖梦","东方Project","树脂"] },
		{ id: 17, name: "赛马娘 无声铃鹿", link: "https://www.hpoi.net/hobby/69317", image: "https://rfx.hpoi.net/gk/cover/n/2021/10/a82c3b8e4049411f8cfb262c4d3d0462.jpg", maker: "", series: "", tags: ["プリティーダービー サイレンススズカ","女 、 比例人形 、 观感安心 、 未上色 、 GK 、 需拼装","2021年10月9日","1/7","Sakaki Workshops","デイラ","无声铃鹿","赛马娘Pretty Derby"] },
		{ id: 16, name: "女神装置 皇巫 须佐之男", link: "https://www.hpoi.net/hobby/46838", image: "https://rfx.hpoi.net/gk/cover/n/2021/05/6a96db7c06cb4876b26dc301c33142a6.jpg", maker: "寿屋", series: "女神装置", tags: ["メガミデバイス 皇巫 スサノヲ"] },
		{ id: 15, name: "龙王的工作 空银子", link: "https://www.hpoi.net/hobby/44889", image: "https://rfx.hpoi.net/gk/cover/n/2018/09/c40be7212be245528b04e008f39237d0.jpg", maker: "", series: "", tags: ["りゅうおうのおしごと！ 空銀子","女 、 比例人形 、 观感安心 、 GK","2018年7月29日","Non","空银子","龙王的工作"] },
		{ id: 14, name: "女神装置 朱罗 弓兵", link: "https://www.hpoi.net/hobby/38434", image: "https://rfx.hpoi.net/gk/cover/n/2018/04/25c50042d260445699a3f18d9e4adade.jpg", maker: "寿屋", series: "女神装置", tags: ["メガミデバイス 朱羅 弓兵"] },
		{ id: 13, name: "女神装置 朱罗 忍者", link: "https://www.hpoi.net/hobby/38433", image: "https://rfx.hpoi.net/gk/cover/n/2018/04/53b1c22e2eea4846bfe9f4b277a90c68.jpg", maker: "寿屋", series: "女神装置", tags: ["メガミデバイス"] },
		{ id: 12, name: "Fate/Grand Order 弗兰肯斯坦 泳装ver.", link: "https://www.hpoi.net/hobby/41839", image: "https://rfx.hpoi.net/gk/cover/n/2018/02/49edfebba07d44e4ac6771b3b28b5bc1.jpg", maker: "アリヌとsaiの工作部屋", series: "Wonder Festival 2018[冬]", tags: ["フェイト/グランドオーダー フランケンシュタイン Swimsuit ver."] },
		{ id: 11, name: "公主连结Re:Dive 可可萝", link: "https://www.hpoi.net/hobby/57181", image: "https://rfx.hpoi.net/gk/cover/n/2020/02/d5399777c474434ea853bc86d7ec0d85.jpg", maker: "鹤之馆", series: "", tags: ["プリンセスコネクト！Re:Dive コッコロ","女 、 比例人形 、 观感安心 、 GK","2020年2月9日","1/8","鹤之馆","可可萝","公主连结 与你重逢"] },
		{ id: 10, name: "VOCALOID角色系列 01 初音未来 深海少女ver.", link: "https://www.hpoi.net/hobby/732", image: "https://rfx.hpoi.net/gk/cover/n/2020/09/cd8efaeea86249199422bad03495c105.jpg", maker: "良笑", series: "", tags: ["キャラクター・ボーカル・シリーズ01 初音ミク 深海少女ver.","女 、 比例人形 、 观感安心","2021/11/11 , 16,500日元（税）","1/8","良笑","石长樱子","はるよ","初音未来","VOCALOID","H=160mm","PVC"] },
		{ id: 9, name: "狼与香辛料 赫萝 10周年 婚纱ver.", link: "https://www.hpoi.net/hobby/35229", image: "https://rfx.hpoi.net/gk/cover/n/2018/04/7e61623e663c4541a0f3b7fe8ff26343.jpg", maker: "Myethos", series: "", tags: ["狼と香辛料 ホロ wedding Dress.ver","女 、 比例人形 、 观感安心","2018年1月","1/8","Myethos","东京宅","赫萝","狼与香辛料","H=240mm","PVC, ABS"] },
		{ id: 8, name: "BEATLESS -没有心跳的少女- 蕾西亚 2018 〈黑色秘棺〉 展开ver.", link: "https://www.hpoi.net/hobby/42052", image: "https://rfx.hpoi.net/gk/cover/n/2019/04/43069cee39f04376b0cfc75a53e264fb.jpg", maker: "良笑", series: "", tags: ["Beatless レイシア 2018 BLACK MONOLITH 展開ver.","女 、 比例人形 、 观感安心","2021年4月7日","1/8","良笑","上連小夜子","イワビツ","redjuice","蕾西亚","BEATLESS -没有心跳的少女-","H=200mm","PVC, ABS"] },
		{ id: 7, name: "粘土人#1067 关于我转生后成为史莱姆的那件事 利姆鲁·特恩佩斯特", link: "https://www.hpoi.net/hobby/45533", image: "https://rfx.hpoi.net/gk/cover/n/2019/01/571831b62d324d9a8cf61ecee86b26b9.jpg", maker: "良笑", series: "粘土人", tags: ["ねんどろいど 転生したらスライムだった件 リムル・テンペスト"] },
		{ id: 6, name: "figma#396 重兵装型女高中生 壹", link: "https://www.hpoi.net/hobby/39207", image: "https://rfx.hpoi.net/gk/cover/n/2019/12/d3c966646a6948649f8fdbf4a9ad0c52.png", maker: "Max Factory", series: "figma", tags: ["フィグマ #396 重兵装型女子高生 壱"] },
		{ id: 5, name: "我的青春恋爱物语果然有问题。 续 雪之下雪乃", link: "https://www.hpoi.net/hobby/10200", image: "https://rfx.hpoi.net/gk/cover/n/2015/07/0d16593794ea44679bcd066d518993d1.jpg", maker: "寿屋", series: "", tags: ["やはり俺の青春ラブコメはまちがっている。続 雪ノ下雪乃","女 、 比例人形 、 观感安心","2021/5/17 , 9,200日元","1/8","寿屋","小笠原健人","雪之下雪乃","我的青春恋爱物语果然有问题 续","H=135mm","ABS, PVC"] },
		{ id: 4, name: "迷你黏土人 电波女与青春男 藤和艾莉欧", link: "https://www.hpoi.net/hobby/24235", image: "https://rfx.hpoi.net/gk/cover/n/2016/04/f1edfa8f38b44ab2b903e74afc84e5ec.jpg", maker: "良笑", series: "迷你粘土人", tags: ["ねんどろいど ぷち 電波女と青春男 藤和エリオ"] },
		{ id: 3, name: "路人女主的养成方法 加藤恵 和服版", link: "https://www.hpoi.net/hobby/34161", image: "https://rfx.hpoi.net/gk/cover/n/2016/09/f9f2ae741d4649a2b14531edcf82c6d6.jpg", maker: "ANIPLEX+", series: "", tags: ["冴えない彼女の育てかた 加藤恵 和服ver.","女 、 比例人形 、 观感安心","2018年1月20日","1/8","ANIPLEX+","Design COCO 、 Ampere (Revolve)","MIC","深崎暮人","加藤惠","路人女主的养成方法","H=220mm","ATBC-PVC"] },
		{ id: 2, name: "VOCALOID 初音未来 中秋明月版", link: "https://www.hpoi.net/hobby/38674", image: "https://rfx.hpoi.net/gk/cover/n/2017/10/29a0ac0d81d54a9b9bea6904012cd1c4.jpg", maker: "良笑", series: "", tags: ["VOCALOID 初音ミク Harvest Moon Ver.","女 、 比例人形 、 观感安心","2018年11月26日","1/8","良笑","SUZU(ATOMIC-BOM)","えこし（Ekoshi）","Rella","初音未来","VOCALOID","H=220mm","PVC, ABS"] },
		{ id: 1, name: "偶像大师灰姑娘女孩 二宫飞鸟 IDOL Fragment Ver.", link: "https://www.hpoi.net/hobby/42072", image: "https://rfx.hpoi.net/gk/cover/n/2019/02/5e022dcf6ce74082bdbcc96e6cb63df5.jpg", maker: "Alter", series: "", tags: ["アイドルマスターシンデレラガールズ 二宮飛鳥 《偶像》のフラグメントver.","女 、 比例人形 、 观感安心","2019年11月26日","1/7","Alter","本宫あまと","星名咏美","二宫飞鸟","偶像大师 灰姑娘女孩","总高=320mm 头顶高=220mm"] },
	],
	// @@ALLMODELS_END
	selectedLinks: [],
	selectedNames: ["30MS SIS-N00 苍丽[配色B]", "Fate/Grand Order 贞德[Alter] 制服", "命运-冠位指定 爱尔奎特·布伦史塔德", "Chitocerium VI-carbonia adamas", "赛马娘 目白麦昆", "女神装置 朱罗 弓兵 绊", "阿尔卡纳蒂亚 薇儿蕾特", "Fate/Grand Order 阿尔托莉雅[Alter] 礼服ver.", "赛马娘 北部玄驹", "赛马娘 里见光钻", "Fate/Grand Order 阿尔托莉雅 Alter 制服Ver."],
	autoSelectRules: [
		{ makerIncludes: "BANDAI SPIRITS", seriesIncludes: "30MS" },
		{ makerIncludes: "寿屋", seriesIncludes: "女神装置" },
		{ makerIncludes: "寿屋", seriesIncludes: "阿尔卡纳蒂亚" },
		{ makerIncludes: "寿屋", seriesIncludes: "弹丸骑士 、 女神装置" },
		{ makerIncludes: "万代", seriesIncludes: "RG" },
		{ makerIncludes: "BANDAI SPIRITS", seriesIncludes: "RG" },
		{ makerIncludes: "万代", seriesIncludes: "MG" },
		{ makerIncludes: "良笑", seriesIncludes: "Chitocerium" },
		// 自动选择包含"GK"的产品
		{ makerIncludes: "GK" },
		{ seriesIncludes: "GK" },
	],
	maxVisible: 0,
};
