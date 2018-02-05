jQuery.namespace("fdm.models");
jQuery.namespace("fdm.constants");
jQuery.namespace("fdm.views");

fdm.constants.UINT_MAX = 0xffffffff;

//fdm.models.TempDownloadError = {
//	Unknown: 0,
//	EmptyUrl: 1,
//	InvalidUrl: 2,
//	FailedQueryFileSize: 3,
//	IdenticalTorrent: 4
//};

fdm.models.UpdateBehaviour = {
	Automatic: 0,
	Notify: 1,
	TurnOff: 2
};

// see UpdateMgrState enum in fsUpdateMgr.h
fdm.models.AppUpdaterState = {
	NoUpdate: 0,
	NewVerExists: 1,
	Downloading: 2,
	Checking: 3,
	Stoped: 4,
	Error: 5
};

fdm.models.MessageBoxIconType = {
	NoIcon: 0,
	Information: 1,
	Warning: 2,
	Error: 3
};

fdm.models.DeleteDownloadReaction = {
	Ask: 0,
	DoNotDelete: 1,
	Delete: 2
};

// see SettingsManager.h
fdm.models.SizeUnit = {
	Bytes: 0,
	Kb: 1,
	Mb: 2
};

// traffic usage mode (tum). see vmsTrafficUsageModeMgr.h
fdm.models.NetworkSpeedMode = {
	Low: 0,
	Medium: 1,
	High: 2,
	Custom: 3
};

fdm.models.NewDownloadDefaultFolder = {
	NotSet: 0, // clear!
	AutoDetected: 1, // depends on detected group automatically
	LastSelected: 2, // last chosen folder
	System: 3, // default system folder for downloads
	Monitoring: 4
};

fdm.models.DownloadType = {
	Regular: 0,
	Trt: 1,
	TransferProtocol: 2,
	YouTubeVideo: 3,
	File: 4,
	FlashVideo: 5,
	InfoRequest: 6,
	batchDownload: 7
};

fdm.models.PeerInfoFlags = {
	interesting: 0x1,
	choked: 0x2,
	remote_interested: 0x4,
	remote_choked: 0x8,
	supports_extensions: 0x10,
	local_connection: 0x20,
	handshake: 0x40,
	connecting: 0x80,
	queued: 0x100,
	on_parole: 0x200,
	seed: 0x400,
	optimistic_unchoke: 0x800,
	snubbed: 0x1000,
	upload_only: 0x2000,
	endgame_mode: 0x4000,
	holepunched: 0x8000,
	rc4_encrypted: 0x100000,
	plaintext_encrypted: 0x200000
};

// reflection of the  fsDownloadMgr_EventDescType enum (see: fsDownloadMgr.h)
fdm.models.EventDescType = {
	Request: 0,				// request to server
	Success: 1,				// successful response or some operation
	Fail: 2,				// unsuccessful response or some operation
	Done: 3,				// some operation completed
	Warning: 4,				// warning to user
	Request2: 5,			// request2 (use more light color)
	ResponseSuccess2: 6	// successful response2 (use more light color)
};


fdm.views.BottomPanelTab = {
	General: 0,
	Files: 1,
	Trackers: 2,
	Peers: 3,
	Log: 4,
	Progress: 5
};