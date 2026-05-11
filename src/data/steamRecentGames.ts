export type SteamRecentGame = {
	name: string;
	appId: number | null;
	appUrl: string;
	coverImageUrl: string;
	coverImageLocalPath: string;
	lastTwoWeeksHours: number | null;
	lastTwoWeeksText: string;
	totalHours: number | null;
	totalHoursText: string;
	lastPlayedText: string;
};

export type SteamRecentGamesData = {
	profileUrl: string;
	fetchedAt: string;
	totalRecentTwoWeeksHours: number | null;
	totalRecentTwoWeeksText: string;
	games: SteamRecentGame[];
};

export const steamRecentGamesData: SteamRecentGamesData = {
	profileUrl: "https://steamcommunity.com/profiles/76561199036753865/",
	fetchedAt: "2026-05-11T05:23:38.301Z",
	totalRecentTwoWeeksHours: 29.5,
	totalRecentTwoWeeksText: "29.5 hours",
	games: [
		{
			name: "Wallpaper Engine",
			appId: 431960,
			appUrl: "https://steamcommunity.com/app/431960",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/431960/capsule_184x69.jpg?t=1777723277",
			coverImageLocalPath: "Wallpaper_Engine-431960.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 117,
			totalHoursText: "117 hrs",
			lastPlayedText: "10 May",
		},
		{
			name: "VA-11 Hall-A: Cyberpunk Bartender Action",
			appId: 447530,
			appUrl: "https://steamcommunity.com/app/447530",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/447530/capsule_184x69.jpg?t=1730740610",
			coverImageLocalPath: "VA-11_Hall-A_Cyberpunk_Bartender_Action-447530.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 14.9,
			totalHoursText: "14.9 hrs",
			lastPlayedText: "10 May",
		},
		{
			name: "3DMark",
			appId: 223850,
			appUrl: "https://steamcommunity.com/app/223850",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/223850/a759dd4110ed54411715bdb8cb6f5e917d20a9a9/capsule_184x69.jpg?t=1756127655",
			coverImageLocalPath: "3DMark-223850.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 0.2,
			totalHoursText: "0.2 hrs",
			lastPlayedText: "10 May",
		},
	],
};
