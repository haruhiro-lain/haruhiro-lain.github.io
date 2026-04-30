/**
 * 重大变更日志（手动维护）
 *
 * 维护规则：
 * 1) 仅记录重大变更：框架更换、功能上线、项目启动、结构性调整等。
 * 2) 按日期倒序维护（最新在最前）。
 * 3) 日期格式统一为 YYYY-MM-DD。
 *
 * 新增模板：
 * {
 *   date: '2026-04-19',
 *   title: '变更标题（简洁明确）',
 *   details: '可选补充说明（影响范围/背景）',
 * }
 */
export type LogEntry = {
	/** 日期：YYYY-MM-DD */
	date: string;
	/** 变更标题 */
	title: string;
	/** 可选补充说明 */
	details?: string;
};

export const LOG_ENTRIES: LogEntry[] = [
	{
		date: '2026-04-19',
		title: '该页面诞生',
	},
];
