/** @type {import("prettier").Config} */
export default {
	// 每行最大字符数
	printWidth: 100,
	// 使用分号
	semi: true,
	// 使用单引号
	singleQuote: true,
	// 制表符宽度
	tabWidth: 2,
	// 尾随逗号：所有位置都添加
	trailingComma: 'all',
	// 使用制表符而不是空格
	useTabs: true,
	// 插件：Astro文件格式化插件
	plugins: ['prettier-plugin-astro'],
	// 文件特定覆盖配置
	overrides: [
		{
			// 配置文件、Markdown、TOML、YAML文件
			files: ['.*', '*.md', '*.toml', '*.yml'],
			options: {
				// 这些文件使用空格而不是制表符
				useTabs: false,
			},
		},
		{
			// Astro文件
			files: ['**/*.astro'],
			options: {
				// 使用Astro解析器
				parser: 'astro',
			},
		},
	],
};
