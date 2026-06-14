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
	fetchedAt: "2026-06-14T22:40:06.324Z",
	totalRecentTwoWeeksHours: 26.9,
	totalRecentTwoWeeksText: "26.9 hours",
	games: [
		{
			name: "Slay the Spire 2",
			appId: 2868840,
			appUrl: "https://steamcommunity.com/app/2868840",
			coverImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2868840/fb0ad136e9eaa4297a1ab3440d88ecb7209f44a2/capsule_184x69.jpg?t=1776735385",
			coverImageLocalPath: "Slay_the_Spire_2-2868840.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 92,
			totalHoursText: "92 hrs",
			lastPlayedText: "14 Jun",
		},
		{
			name: "ELDEN RING NIGHTREIGN",
			appId: 2622380,
			appUrl: "https://steamcommunity.com/app/2622380",
			coverImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2622380/8ebc4260af27bc55ba8b88982fd7eb7f970d43c9/capsule_184x69.jpg?t=1773099036",
			coverImageLocalPath: "ELDEN_RING_NIGHTREIGN-2622380.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 673,
			totalHoursText: "673 hrs",
			lastPlayedText: "14 Jun",
		},
		{
			name: "MONSTER HUNTER RISE",
			appId: 1446780,
			appUrl: "https://steamcommunity.com/app/1446780",
			coverImageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1446780/capsule_184x69.jpg?t=1768870444",
			coverImageLocalPath: "MONSTER_HUNTER_RISE-1446780.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 198,
			totalHoursText: "198 hrs",
			lastPlayedText: "13 Jun",
		},
	],
};
