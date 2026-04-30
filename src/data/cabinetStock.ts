export interface CabinetStockEntry {
	/** 酒名 */
	name: string;
	/** 最近日期（补货/开瓶等） */
recentDate: string;
	/** 购买日期 */
	purchaseDate: string;
	/** 参考价格 */
	referencePrice: string;
	/** 是否有剩余 */
	hasRemaining: boolean;
	/** 备注 */
	note: string;
}

export const cabinetStockList: CabinetStockEntry[] = [
	{ name: '格兰威特12年',      recentDate: '2026-04-22', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '野牛仙踪威士忌',      recentDate: '2026-04-28', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '尊美醇威士忌',        recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '尊尼获加黑方',        recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '波本威士忌',          recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '百加得白朗姆',        recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '摩根船长金朗姆',      recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '摩根船长黑朗姆',      recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '皮斯科白兰地',        recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '伏特加',              recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '龙舌兰金',            recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '添加利干金酒',        recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '润金金酒',            recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '安高天娜苦精',        recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '茴香酒',              recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '甘蔗酒',              recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '苦艾酒',              recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '君度力娇酒',          recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '杜林标力娇酒',        recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '法勒纳姆糖浆利口酒',  recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '蓝橙利口酒',          recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '紫罗兰利口酒',        recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '蜜瓜利口酒',          recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '杏仁利口酒',          recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
	{ name: '樱桃利口酒',          recentDate: '2026-04-19', purchaseDate: '', referencePrice: '', hasRemaining: true, note: '' },
];
