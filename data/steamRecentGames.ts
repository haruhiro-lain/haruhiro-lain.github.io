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
	fetchedAt: "2026-08-04T05:32:24.200Z",
	totalRecentTwoWeeksHours: 35.8,
	totalRecentTwoWeeksText: "35.8 hours",
	games: [
		{
			name: "ELDEN RING NIGHTREIGN",
			appId: 2622380,
			appUrl: "https://steamcommunity.com/app/2622380",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2622380/8ebc4260af27bc55ba8b88982fd7eb7f970d43c9/capsule_184x69.jpg?t=1773099036",
			coverImageLocalPath: "ELDEN_RING_NIGHTREIGN-2622380.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 702,
			totalHoursText: "702 hrs",
			lastPlayedText: "Aug 3",
		},
		{
			name: "Slay the Spire 2",
			appId: 2868840,
			appUrl: "https://steamcommunity.com/app/2868840",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2868840/fb0ad136e9eaa4297a1ab3440d88ecb7209f44a2/capsule_184x69.jpg?t=1776735385",
			coverImageLocalPath: "Slay_the_Spire_2-2868840.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 139,
			totalHoursText: "139 hrs",
			lastPlayedText: "Aug 2",
		},
		{
			name: "Hades II",
			appId: 1145350,
			appUrl: "https://steamcommunity.com/app/1145350",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/10c9138570a8d7ac9144f601ab0f2ccbc820337e/capsule_184x69.jpg?t=1779901265",
			coverImageLocalPath: "Hades_II-1145350.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 18.7,
			totalHoursText: "18.7 hrs",
			lastPlayedText: "Jul 28",
		},
	],
};
