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
	fetchedAt: "2026-04-30T05:40:51.098Z",
	totalRecentTwoWeeksHours: 18.4,
	totalRecentTwoWeeksText: "18.4 hours",
	games: [
		{
			name: "Revue Starlight El Dorado",
			appId: 2849960,
			appUrl: "https://steamcommunity.com/app/2849960",
			coverImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2849960/capsule_184x69.jpg?t=1723042903",
			coverImageLocalPath: "Revue_Starlight_El_Dorado-2849960.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 3.5,
			totalHoursText: "3.5 hrs",
			lastPlayedText: "29 Apr",
		},
		{
			name: "The Coffin of Andy and Leyley",
			appId: 2378900,
			appUrl: "https://steamcommunity.com/app/2378900",
			coverImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2378900/c7f95ad56ad862fe5366fa0d7813ff74b3a421bd/capsule_184x69.jpg?t=1774434375",
			coverImageLocalPath: "The_Coffin_of_Andy_and_Leyley-2378900.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 4.7,
			totalHoursText: "4.7 hrs",
			lastPlayedText: "29 Apr",
		},
		{
			name: "ELDEN RING NIGHTREIGN",
			appId: 2622380,
			appUrl: "https://steamcommunity.com/app/2622380",
			coverImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2622380/8ebc4260af27bc55ba8b88982fd7eb7f970d43c9/capsule_184x69.jpg?t=1773099036",
			coverImageLocalPath: "ELDEN_RING_NIGHTREIGN-2622380.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 629,
			totalHoursText: "629 hrs",
			lastPlayedText: "26 Apr",
		},
	],
};
