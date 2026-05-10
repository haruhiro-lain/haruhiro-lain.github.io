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
	fetchedAt: "2026-05-10T23:20:47.459Z",
	totalRecentTwoWeeksHours: 29.3,
	totalRecentTwoWeeksText: "29.3 hours",
	games: [
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
		{
			name: "Z.A.T.O. // I Love the World and Everything In It",
			appId: 4122860,
			appUrl: "https://steamcommunity.com/app/4122860",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122860/c88030f4113af2ea12d714084d16115689c9a361/capsule_184x69.jpg?t=1762815652",
			coverImageLocalPath: "Z.A.T.O._I_Love_the_World_and_Everything_In_It-4122860.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 0.1,
			totalHoursText: "0.1 hrs",
			lastPlayedText: "10 May",
		},
		{
			name: "Senren＊Banka",
			appId: 1144400,
			appUrl: "https://steamcommunity.com/app/1144400",
			coverImageUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1144400/capsule_184x69.jpg?t=1752128014",
			coverImageLocalPath: "Senren_Banka-1144400.jpg",
			lastTwoWeeksHours: null,
			lastTwoWeeksText: "",
			totalHours: 0.2,
			totalHoursText: "0.2 hrs",
			lastPlayedText: "10 May",
		},
	],
};
