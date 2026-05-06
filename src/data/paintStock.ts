export interface PaintStockEntry {
	name: string;
	brand: string;
	/** 用途分类：如打底/罩光/稀释/脱漆/清洁 等 */
	usageCategory?: string;
}

export const paintStock: PaintStockEntry[] = [
	{ name: 'S03 黑补土', brand: '削刻', usageCategory: '底漆' },
	{ name: 'S02 灰补土', brand: '削刻', usageCategory: '底漆' },
	{ name: 'MP01底漆液', brand: '匠域', usageCategory: '底漆' },
	{ name: 'GX-100 超级光油', brand: '郡士', usageCategory: '保护漆' },
	{ name: 'GX-114 超光滑透明消光', brand: '郡士', usageCategory: '保护漆' },
	{ name: 'CT01 基准稀释剂', brand: '匠域', usageCategory: '稀释剂' },
	{ name: 'CT04 脱漆剂', brand: '匠域', usageCategory: '脱漆' },
	{ name: 'X20 珐琅稀释剂', brand: '田宫', usageCategory: '稀释剂' },
	{ name: '04M 洗笔液', brand: '星影', usageCategory: '洗笔液' },
	{ name: 'JW012 消光', brand: '匠域', usageCategory: '保护漆' },
	{ name: 'JWEM11 杜拉铝', brand: '匠域', usageCategory: '金属漆' },
	{ name: 'JWEM02 耀金', brand: '匠域', usageCategory: '金属漆' },
	{ name: 'JWEM05 铁', brand: '匠域', usageCategory: '金属漆' },
	{ name: 'JWEM01 光银', brand: '匠域', usageCategory: '金属漆' },
];