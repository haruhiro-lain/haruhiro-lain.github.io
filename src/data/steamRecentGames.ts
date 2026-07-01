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
	fetchedAt: "2026-07-01T05:29:33.740Z",
	totalRecentTwoWeeksHours: 31.7,
	totalRecentTwoWeeksText: "31.7 hours",
	games: [
		{
			name: "Wallpaper Engine",
			appId: 431960,
			appUrl: "https://steamcommunity.com/app/431960",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/431960/capsule_184x69.jpg?t=1779452230",
			coverImageLocalPath: "Wallpaper_Engine-431960.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 118,
			totalHoursText: "118 hrs",
			lastPlayedText: "30 Jun",
		},
		{
			name: "WITCH ON THE HOLY NIGHT",
			appId: 2052410,
			appUrl: "https://steamcommunity.com/app/2052410",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2052410/capsule_184x69.jpg?t=1753952335",
			coverImageLocalPath: "WITCH_ON_THE_HOLY_NIGHT-2052410.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 0.8,
			totalHoursText: "0.8 hrs",
			lastPlayedText: "30 Jun",
		},
		{
			name: "MONSTER HUNTER RISE",
			appId: 1446780,
			appUrl: "https://steamcommunity.com/app/1446780",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1446780/capsule_184x69.jpg?t=1768870444",
			coverImageLocalPath: "MONSTER_HUNTER_RISE-1446780.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 199,
			totalHoursText: "199 hrs",
			lastPlayedText: "30 Jun",
		},
	],
};
