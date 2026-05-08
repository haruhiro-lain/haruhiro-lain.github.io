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
	fetchedAt: "2026-05-08T05:46:20.926Z",
	totalRecentTwoWeeksHours: 29.8,
	totalRecentTwoWeeksText: "29.8 hours",
	games: [
		{
			name: "Wallpaper Engine",
			appId: 431960,
			appUrl: "https://steamcommunity.com/app/431960",
			coverImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/431960/capsule_184x69.jpg?t=1777723277",
			coverImageLocalPath: "Wallpaper_Engine-431960.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 117,
			totalHoursText: "117 hrs",
			lastPlayedText: "7 May",
		},
		{
			name: "Magical Princess",
			appId: 3562120,
			appUrl: "https://steamcommunity.com/app/3562120",
			coverImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3562120/1ffbf0704551c1585a73d56599f6da08a8e227c6/capsule_184x69.jpg?t=1777348229",
			coverImageLocalPath: "Magical_Princess-3562120.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 0.2,
			totalHoursText: "0.2 hrs",
			lastPlayedText: "7 May",
		},
		{
			name: "ELDEN RING NIGHTREIGN",
			appId: 2622380,
			appUrl: "https://steamcommunity.com/app/2622380",
			coverImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2622380/8ebc4260af27bc55ba8b88982fd7eb7f970d43c9/capsule_184x69.jpg?t=1773099036",
			coverImageLocalPath: "ELDEN_RING_NIGHTREIGN-2622380.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 644,
			totalHoursText: "644 hrs",
			lastPlayedText: "4 May",
		},
	],
};
