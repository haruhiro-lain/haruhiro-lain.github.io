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
	fetchedAt: "2026-05-14T16:04:36.056Z",
	totalRecentTwoWeeksHours: 32.3,
	totalRecentTwoWeeksText: "32.3 hours",
	games: [
		{
			name: "Slay the Spire 2",
			appId: 2868840,
			appUrl: "https://steamcommunity.com/app/2868840",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2868840/fb0ad136e9eaa4297a1ab3440d88ecb7209f44a2/capsule_184x69.jpg?t=1776735385",
			coverImageLocalPath: "Slay_the_Spire_2-2868840.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 78,
			totalHoursText: "78 hrs",
			lastPlayedText: "14 May",
		},
		{
			name: "3DMark",
			appId: 223850,
			appUrl: "https://steamcommunity.com/app/223850",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/223850/a759dd4110ed54411715bdb8cb6f5e917d20a9a9/capsule_184x69.jpg?t=1756127655",
			coverImageLocalPath: "3DMark-223850.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 1,
			totalHoursText: "1 hrs",
			lastPlayedText: "11 May",
		},
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
	],
};
