// init fake external object to get it work
if (!window.external)
	window.external = {}

fakes = {
	_callMappedAsync: function(url, data, callback) {
		var call_function  = fakes.mapUrlToFakeFunction[url];
		var result;
		if (call_function && typeof call_function === "function"){
			result = call_function.apply(this, data, callback);
		}
		else if (call_function && call_function !=="function"){
			result = call_function;
		}
		
		if(callback && typeof callback === "function"){
			callback(result);
		}
	},
	checkIsSettingProperty: function(url) {
		if (url.indexOf("http://api/settings/") != -1 && !fakes.mapUrlToFakeFunction.hasOwnProperty(url)){
			return true;
		}
		return false;
	},
	rpcSync: function(url, data){
		if (fakes.checkIsSettingProperty(url)){
			nameSettingProperty = url.replace("http://api/settings/", "");
			return window.fdmAppFakes.settings[nameSettingProperty];
		}
		
		if (fakes.mapUrlToFakeFunction.hasOwnProperty(url)) {
			var call_function  = fakes.mapUrlToFakeFunction[url];
			if (call_function && typeof call_function === "function"){
				return call_function.apply(this, data);
			}
		}
		return null;
	},
	rpc: function(url, data, callback){
		setTimeout(_.bind(fakes._callMappedAsync, fakes, url, data, callback), 10);
	},
	mapUrlToFakeFunction: {}
};


(function () {

	function getPureRandom() {
		return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
	}

	function getRandom(min, max) {
		return Math.floor(getPureRandom() * (max - min + 1) + min);
	}

	function getNormalRandom(mean, stdev) {
		var result;
		while((result = Math.round(getPureRandom()*stdev+mean)) < 0){}
		return result;
	}

	function populateDownloads(){
		if (window.fdmAppFakes.downloads) {
			return;
		}
		var downloads;

		window.fdmAppFakes.downloads = {
			_populateData: function() {
				window.fdmAppFakes.downloads.__static_items__ = [//];[
					{
						
						fileName: "Screen Shot 2013-07-23 at 11.03.16.pngScreen Shot 2013-07-23 at 11.03.16.pngScreen Shot 2013-07-23 at 11.03.16.pngScreen Shot 2013-07-23 at 11.03.16.png",
						totalBytes: 23000,
						downloadedBytes: 1100.4,
						thumb: "./file.png",
						downloadSpeedBytes: 256,
						time: 53,
						createdDate: new Date("October 13, 2012 11:13:00"),
						completionDate: new Date("October 13, 2012 11:13:00"),
						outputFilePath: "Users/ludmila/Downloads/Screen Shot 2013-07-23 at 11.03.16.png",
						rootPath: "Users/ludmila/Downloads/Screen Shot 2013-07-23 at 11.03.16.png",
						domain: "pix.cs.olemiss.edu",
						url: "http://pix.cs.olemiss.edu/Screen Shot 2013-07-23 at 11.03.16.png",
						state: fdm.models.DownloadState.Completed,
						errorText: "Unknown error",
						downloadType: fdm.models.DownloadType.Regular,
						tags: [{id:2, name: 'youtube', system: true, 'colorR': 10, 'colorG': 255, 'colorB': 0}],
						isMovable: false
					}, {
						fileName: "111111 Screen Shot 2013-07-23 at 11.03.16.pngScreen Shot 2013-07-23 at 11.03.16.pngScreen Shot 2013-07-23 at 11.03.16.pngScreen Shot 2013-07-23 at 11.03.16.png",
						totalBytes: 23000,
						downloadedBytes: 1100.4,
						thumb: "./file.png",
						downloadSpeedBytes: 256,
						time: 53,
						createdDate: new Date("October 13, 2012 11:13:00"),
						completionDate: new Date("October 12, 2012 11:13:00"),
						outputFilePath: "Users/ludmila/Downloads/Screen Shot 2013-07-23 at 11.03.16.png",
						rootPath: "Users/ludmila/Downloads/Screen Shot 2013-07-23 at 11.03.16.png",
						domain: "pix.cs.olemiss.edu",
						url: "pix.cs.olemiss.edu/Screen Shot 2013-07-23 at 11.03.16.png",
                        isScheduled: true,
						state: fdm.models.DownloadState.Completed,
						errorText: "Unknown error",
						downloadType: fdm.models.DownloadType.InfoRequest,
						tags: [{id:2, name: 'youtube', system: true, 'colorR': 10, 'colorG': 255, 'colorB': 0}],
						isMovable: false
					}, {
						fileName: "111222 Screen Shot 2013-07-23 at 11.03.16.pngScreen Shot 2013-07-23 at 11.03.16.pngScreen Shot 2013-07-23 at 11.03.16.pngScreen Shot 2013-07-23 at 11.03.16.png",
						totalBytes: 23000,
						downloadedBytes: 1100.4,
						thumb: "./file.png",
						downloadSpeedBytes: 256,
						time: 53,
						createdDate: new Date("October 13, 2012 11:13:00"),
						outputFilePath: "Users/ludmila/Downloads/Screen Shot 2013-07-23 at 11.03.16.png",
						rootPath: "Users/ludmila/Downloads/Screen Shot 2013-07-23 at 11.03.16.png",
						domain: "pix.cs.olemiss.edu",
						url: "http://pix.cs.olemiss.edu/Screen Shot 2013-07-23 at 11.03.16.png",
						state: fdm.models.DownloadState.Error,
						errorText: "Unknown error",
						downloadType: fdm.models.DownloadType.InfoRequest,
						tags: [{id:2, name: 'youtube', system: true, 'colorR': 10, 'colorG': 255, 'colorB': 0}],
						isMovable: false
					}, {
						fileName: "Cafe_Del_Mar_Volumen_Diecinueve-REAL.FLAC",
						totalBytes: 600000.5,
						downloadedBytes: 600000.1,
						thumb: "folder.png",
						downloadSpeedBytes: 349,
						progress: 10,
						time: 53,
						createdDate: new Date("October 13, 2012 11:13:01"),
						rootPath: "Users/ludmila/Downloads/Cafe_Del_Mar_Volumen_Diecinueve-REAL.FLAC",
						outputFilePath: "Users/ludmila/Downloads/Cafe_Del_Mar_Volumen_Diecinueve-REAL.FLAC",
						domain: "rutracker.org",
						url: "http://rutracker.org/Cafe_Del_Mar_Volumen_Diecinueve-REA...FLAC",
						state: fdm.models.DownloadState.Paused,
						isMovable: true,
						isMoving: true,
                        moveProgress: 25,
						isScheduled: true,
						downloadType: fdm.models.DownloadType.Completed,
						dhtNodes: 123,
						tags: [{'id':103, 'name': 'important', system: false, 'colorR': 180, 'colorG': 255, 'colorB': 0}],
						uploadedBytes: 70000,
						seedsCount: 3,
						peersCount: 5,
						uploadSpeedBytes: 500,
						uploadSpeedLimitBytes: 600,
						shareRatio: 1.23,
						seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
						availability: 0.543,
						comment: "comment",
						seedingEnabled: true,
						trackers: [{ip: "200.100.4.7", url: "DHT.com", name: "[DHT]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 20, peers: 25, downloaded: 2},
							{ip: "200.100.4.7", url: "Foreign.com", name: "Foreign server", status: 1, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2}],
						peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
							{ip: "200.100.4.7", client: "MyTorrent", flags: 2106419, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
					}, {
						fileName: "123123123.png",
                        missingStorage: true,
						totalBytes: 21301223300,
						downloadedBytes: 1100,
						thumb: "./file.png",
						downloadSpeedBytes: 25,
						seedingEnabled: true,
						progress: 30,
						time: 53,
						createdDate: +new Date(),
						outputFilePath: "Users/ludmila/Downloads/Screen Shot 2013-07-23 at 11.03.16.png",
						rootPath: "Users/ludmila/Downloads/Screen Shot 2013-07-23 at 11.03.16.png",
						domain: "pix.cs.olemiss.edu",
						url: "pix.cs.olemiss.edu/Screen Shot 2013-07-23 at 11.03.16.png",
						state: fdm.models.DownloadState.Completed,
						downloadType: fdm.models.DownloadType.Regular,
						tags: [{id:2, name: 'youtube', system: true, 'colorR': 10, 'colorG': 255, 'colorB': 0}],
						isMovable: false
					}, {
						fileName: "torrent123123123.FLAC",
                        missingStorage: true,
						totalBytes: 600012300,
						downloadedBytes: 300000,
						thumb: "folder.png",
						downloadSpeedBytes: 34,
						time: 53,
						createdDate: +new Date(),
						rootPath: "Users/ludmila/Downloads/Cafe_Del_Mar_Volumen_Diecinueve-REAL.FLAC",
						outputFilePath: "Users/ludmila/Downloads/Cafe_Del_Mar_Volumen_Diecinueve-REAL.FLAC",
						domain: "rutracker.org",
						url: "http://rutracker.org/Cafe_Del_Mar_Volumen_Diecinueve-REA...FLAC",
						state: fdm.models.DownloadState.Downloading,
						isMovable: false,
						isMoving: false,
						isScheduled: false,
						downloadType: fdm.models.DownloadType.Trt,
						dhtNodes: 123,
						tags: [{'id':103, 'name': 'important', system: false, 'colorR': 180, 'colorG': 255, 'colorB': 0}],
						torrent: {
							uploadedBytes: 70000,
							seedsCount: 3,
							peersCount: 5,
							uploadSpeedBytes: 500,
							uploadSpeedLimitBytes: 600,
							shareRatio: 1.23,
							seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
							availability: 0.543,
							comment: "comment",
							seedingEnabled: true,
							trackers: [{ip: "200.100.4.7", url: "DHT.com", name: "[DHT]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 20, peers: 25, downloaded: 2},
										{ip: "200.100.4.7", url: "Foreign.com", name: "Foreign server", status: 1, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2}],
							peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "200.100.4.7", client: "MyTorrent", flags: 2106419, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						}
					}, {
						fileName: "torrent234234234.FLAC",
						progress: 55,
						totalBytes: 600012300,
						downloadedBytes: 3000000,
						thumb: "folder.png",
						downloadSpeedBytes: 34,
						time: 53,
						createdDate: +new Date() + 1,
						rootPath: "Users/ludmila/Downloads/Cafe_Del_Mar_Volumen_Diecinueve-REAL.FLAC",
						outputFilePath: "Users/ludmila/Downloads/Cafe_Del_Mar_Volumen_Diecinueve-REAL.FLAC",
						domain: "rutracker.org",
						url: "http://rutracker.org/Cafe_Del_Mar_Volumen_Diecinueve-REA...FLAC",
						state: fdm.models.DownloadState.Downloading,
						isMovable: false,
						isMoving: false,
						isScheduled: false,
						isQueued: true,
						downloadType: fdm.models.DownloadType.Trt,
						dhtNodes: 123,
						tags: [{'id':103, 'name': 'important', system: false, 'colorR': 180, 'colorG': 255, 'colorB': 0}],
						torrent: {
							uploadedBytes: 70000,
							seedsCount: 3,
							peersCount: 5,
							uploadSpeedBytes: 500,
							uploadSpeedLimitBytes: 600,
							shareRatio: 1.23,
							seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
							availability: 0.543,
							comment: "comment",
							seedingEnabled: true,
							trackers: [{ip: "200.100.4.7", url: "DHT.com", name: "[DHT]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 20, peers: 25, downloaded: 2},
										{ip: "200.100.4.7", url: "Foreign.com", name: "Foreign server", status: 1, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2}],
							peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "200.100.4.7", client: "MyTorrent", flags: 2106419, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						}
					}, {
						fileName: "torrent345345345.FLAC",
						progress: 55,
						totalBytes: -1,
						downloadedBytes: 3000000,
						thumb: "folder.png",
						downloadSpeedBytes: 34,
						time: 53,
						createdDate: +new Date() + 1,
						rootPath: "Users/ludmila/Downloads/Cafe_Del_Mar_Volumen_Diecinueve-REAL.FLAC",
						outputFilePath: "Users/ludmila/Downloads/Cafe_Del_Mar_Volumen_Diecinueve-REAL.FLAC",
						domain: "rutracker.org",
						url: "http://rutracker.org/Cafe_Del_Mar_Volumen_Diecinueve-REA...FLAC",
						state: fdm.models.DownloadState.Downloading,
						isMovable: false,
						isMoving: false,
						isQueued: true,
						downloadType: fdm.models.DownloadType.Trt,
						dhtNodes: 123,
						tags: [{'id':103, 'name': 'important', system: false, 'colorR': 180, 'colorG': 255, 'colorB': 0}],
						torrent: {
							uploadedBytes: 70000,
							seedsCount: 3,
							peersCount: 5,
							uploadSpeedBytes: 500,
							uploadSpeedLimitBytes: 600,
							shareRatio: 1.23,
							seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
							availability: 0.543,
							comment: "comment",
							seedingEnabled: true,
							trackers: [{ip: "200.100.4.7", url: "DHT.com", name: "[DHT]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 20, peers: 25, downloaded: 2},
										{ip: "200.100.4.7", url: "Foreign.com", name: "Foreign server", status: 1, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2}],
							peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "200.100.4.7", client: "MyTorrent", flags: 2106419, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						}
					}, {
						fileName: "Music-Player.zip",
						totalBytes: 2300000,
						downloadedBytes: 190000.3,
						thumb: "./thumbnail.png",
						downloadSpeedBytes: 256,
						time: 53,
						createdDate: new Date(1182139360000), // milliseconds from Jan 1 1970
						rootPath: "d:/Downloads/Music-Player.zip",
						outputFilePath: "d:/Downloads/Music-Player.zip",
						domain: "MusicPlayer.com",
						url: "MusicPlayer.com/Music-Player.zip",
						state: fdm.models.DownloadState.Reconnecting,
						progress: 55,
						isMovable: false,
						errorText: "Internal server errorInternal server errorInternal server errorInternal server errorInternal server errorInternal server errorInternal server errorInternal server error",
						downloadType: fdm.models.DownloadType.batchDownload,
						tags: [{'id':2, 'name': 'youtube', 'system': true, 'colorR': 10, 'colorG': 0, 'colorB': 255},
							{id:104, name: 'tag4', system: false, colorR: 255, colorG: 255, colorB: 215},
							{id:105, name: 'tag5', system: false, colorR: 20, colorG: 155, colorB: 225},
							{id:106, name: 'tag6', system: false, colorR: 30, colorG: 135, colorB: 205},
							{id:103, name: 'w_important', system: false, colorR: 180, colorG: 255, colorB: 0},
							{id:107, name: 'tag7', system: false, colorR: 40, colorG: 225, colorB: 105},
							{id:108, name: 'tag8', system: false, colorR: 50, colorG: 215, colorB: 155},
							{id:109, name: 'tag9', system: false, colorR: 60, colorG: 205, colorB: 55},
							{id:110, name: 'asdfasdf', system: false, colorR: 60, colorG: 205, colorB: 55},
							{id:111, name: 'asdfasdfasd', system: false, colorR: 60, colorG: 205, colorB: 55},
							{id:112, name: 'asdfasdfs', system: false, colorR: 60, colorG: 205, colorB: 55},
							{id:113, name: '1asdfasdfd', system: false, colorR: 60, colorG: 205, colorB: 55},
							{id:114, name: '2asdfasdfd', system: false, colorR: 60, colorG: 205, colorB: 55},
						]
					}, {
						fileName: "Music-Player3.zip",
						totalBytes: 2300000,
						downloadedBytes: 190000.3,
						thumb: "./thumbnail.png",
						downloadSpeedBytes: 256,
						time: 53,
						createdDate: new Date(1401942258335), // milliseconds from Jan 1 1970
						rootPath: "d:/Downloads/Music-Player.zip",
						outputFilePath: "d:/Downloads/Music-Player.zip",
						domain: "MusicPlayer.com",
						url: "MusicPlayer.com/Music-Player.zip",
						state: fdm.models.DownloadState.Reconnecting,
						isMoving: false,
						errorText: "HTTP Error 406: Not Acceptable",
						downloadType: fdm.models.DownloadType.batchDownload,
						tags: [{'id':103, 'name': 'important', system: false, 'colorR': 180, 'colorG': 255, 'colorB': 0}]
					}, {
						fileName: "Music-Player2.zip",
						totalBytes: 2300000,
						downloadedBytes: 190000.3,
						thumb: "./thumbnail.png",
						downloadSpeedBytes: 256,
						time: 53,
						createdDate: new Date(1401942158335), // milliseconds from Jan 1 1970
						rootPath: "d:/Downloads/Music-Player.zip",
						outputFilePath: "d:/Downloads/Music-Player.zip",
						domain: "MusicPlayer.com",
						url: "MusicPlayer.com/Music-Player.zip",
						state: fdm.models.DownloadState.Completed,
						isMoving: true,
                        moveProgress: 10,
						isMovable: false,
						downloadType: fdm.models.DownloadType.Regular,
						tags: [{'id':103, 'name': 'important', system: false, 'colorR': 180, 'colorG': 255, 'colorB': 0}]
					}, {
						fileName: "Qu.est.ce.qu.on.a.fait.au.Bon.Dieu. (2014) BDRip 1080p.mkv",
						totalBytes: 6547114737,
						downloadedBytes: 2127487248,
						thumb: "./thumbnail.png",
						downloadSpeedBytes: 888888880,
						uploadSpeedBytes: 888888800,
						time: 53,
						createdDate: new Date(1401942058335), // milliseconds from Jan 1 1970
						rootPath: "C:\\Downloads\\Qu.est.ce.qu.on.a.fait.au.Bon.Dieu. (2014) BDRip 1080p.mkv",
						outputFilePath: "C:\\Downloads\\Qu.est.ce.qu.on.a.fait.au.Bon.Dieu. (2014) BDRip 1080p.mkv",
						domain: "http://rutor.org",
						url: "http://rutor.org/torrent/380219",
						state: fdm.models.DownloadState.Paused,// getRandom(0, 3),
						isMovable: true,
						errorText: "",
						downloadType: fdm.models.DownloadType.Trt,
						tags: [],
						dhtNodes: 357,
						torrent: {
							uploadedBytes: 7000000,
							seedsCount: 3,
							peersCount: 5,
							uploadSpeedBytes: 500,
							uploadSpeedLimitBytes: 600,
							shareRatio: 1.23,
							seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
							availability: 1,
							comment: "comment",
							seedingEnabled: true,
							trackers: [{ip: "200.100.4.7", url: "DHT.com", name: "[DHT]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 20, peers: 25, downloaded: 2},
								{ip: "200.100.4.7", url: "Foreign.com", name: "Foreign server", status: 1, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2}],
							peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "200.100.4.7", client: "MyTorrent", flags: 2106419, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						}
					}, {
						fileName: "Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music",
						fileExt: "mp4",
						totalBytes: 42300000,
						downloadedBytes: 42300000,
						thumb: "folder.png",
						downloadSpeedBytes: 0,
						completedTime: (+new Date() + 10000000),
						createdDate: new Date(), // current
						rootPath: "Users/ludmila/Downloads/Archie Shepp - Fire Music",
						outputFilePath: "Users/ludmila/Downloads/",
						domain: "music4free.net",
						url: "music4free.net/Archie Shepp - Fire Music",
						state:  fdm.models.DownloadState.Completed,
						isMovable: true,
						errorText: "This singer is banned in your country by the Russian Orthodox Church",
						downloadType: fdm.models.DownloadType.Trt,
						dhtNodes: 123,
						tags: [],
						filesCount: 100000,
						seedingEnabled: true,
						filesChosenCount: 90,
						torrent: {
							uploadedBytes:55000,
							seedsCount: 5,
							peersCount: 5,
							uploadSpeedBytes: 400,
							uploadSpeedLimitBytes: 600,
							shareRatio: 1.23,
							seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
							availability: 0.543,
							comment: "comment",
							seedingEnabled: true,
							trackers: [{ip: "200.100.4.7", url: "dht.com", name: "[DHT]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 20, peers: 25, downloaded: 2},
								{ip: "200.100.4.7", url: "Foreign.com", name: "Foreign server", status: 1, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2},
								{ip: "200.100.4.7", url: "Piratebay.es", name: "Pirate bay", status: 3, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2}],
							peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "104.72.32.0", client: "BitTorrent 1.0.2", flags: 2106419, progress: 12, downloadSpeed: 13000, uploadSpeed: 900, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "156.53.0.0", client: "opera", flags: 1057843, progress: 45, downloadSpeed: 1000, uploadSpeed: 500, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "200.100.4.7", client: "MyTorrent", flags: 1057843, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						}
					}, {
						fileName: "123 Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music",
						fileExt: "mp4",
						totalBytes: 42300000,
						downloadedBytes: 42300000,
						thumb: "folder.png",
						downloadSpeedBytes: 0,
						uploadSpeedBytes: 100,
						createdDate: new Date(), // current
						rootPath: "Users/ludmila/Downloads/Archie Shepp - Fire Music",
						outputFilePath: "Users/ludmila/Downloads/",
						domain: "music4free.net",
						url: "music4free.net/Archie Shepp - Fire Music",
						state:  fdm.models.DownloadState.Completed,
						isMovable: true,
						errorText: "This singer is banned in your country by the Russian Orthodox Church",
						downloadType: fdm.models.DownloadType.Trt,
						dhtNodes: 123,
						tags: [],
						filesCount: 100000,
						seedingEnabled: true,
						filesChosenCount: 90,
						torrent: {
							uploadedBytes:55000,
							seedsCount: 5,
							peersCount: 5,
							uploadSpeedBytes: 400,
							uploadSpeedLimitBytes: 600,
							shareRatio: 1.23,
							seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
							availability: 0.543,
							comment: "comment",
							seedingEnabled: true,
							trackers: [{ip: "200.100.4.7", url: "dht.com", name: "[DHT]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 20, peers: 25, downloaded: 2},
								{ip: "200.100.4.7", url: "Foreign.com", name: "Foreign server", status: 1, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2},
								{ip: "200.100.4.7", url: "Piratebay.es", name: "Pirate bay", status: 3, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2}],
							peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "104.72.32.0", client: "BitTorrent 1.0.2", flags: 2106419, progress: 12, downloadSpeed: 13000, uploadSpeed: 900, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "156.53.0.0", client: "opera", flags: 1057843, progress: 45, downloadSpeed: 1000, uploadSpeed: 500, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "200.100.4.7", client: "MyTorrent", flags: 1057843, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						}
					}, {
						fileName: "Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music Archie Shepp - Fire Music",
						fileExt: "mp4",
						totalBytes: 42300000,
						downloadedBytes: 42300000,
						thumb: "folder.png",
						downloadSpeedBytes: 300000,
						createdDate: new Date() - 10, // current
						rootPath: "Users/ludmila/Downloads/Archie Shepp - Fire Music",
						outputFilePath: "Users/ludmila/Downloads/",
						domain: "music4free.net",
						url: "music4free.net/Archie Shepp - Fire Music",
						state:  fdm.models.DownloadState.Completed,
						isMovable: true,
						isMoving: true,
                        moveProgress: 99,
						errorText: "This singer is banned in your country by the Russian Orthodox Church",
						downloadType: fdm.models.DownloadType.Trt,
						dhtNodes: 123,
						tags: [],
						filesCount: 100,
						filesChosenCount: 90,
						torrent: {
							uploadedBytes:55000,
							seedsCount: 5,
							peersCount: 5,
							uploadSpeedBytes: 400,
							uploadSpeedLimitBytes: 600,
							shareRatio: 1.23,
							seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
							availability: 0.543,
							comment: "comment",
							seedingEnabled: true,
							trackers: [{ip: "200.100.4.7", url: "dht.com", name: "[DHT]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 20, peers: 25, downloaded: 2},
								{ip: "200.100.4.7", url: "Foreign.com", name: "Foreign server", status: 1, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2},
								{ip: "200.100.4.7", url: "Piratebay.es", name: "Pirate bay", status: 3, nextAnnounce: new Date("February 22, 2014 11:02:31"), seeds: 20, peers: 25, downloaded: 2}],
							peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "104.72.32.0", client: "BitTorrent 1.0.2", flags: 2106419, progress: 12, downloadSpeed: 13000, uploadSpeed: 900, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "156.53.0.0", client: "opera", flags: 1057843, progress: 45, downloadSpeed: 1000, uploadSpeed: 500, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "200.100.4.7", client: "MyTorrent", flags: 1057843, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						}
					}, {
						fileName: "Microsoft Office 2011 14.0.0 Final fMicrosoft Office 2011 14.0.0 Final fMicrosoft Office 2011 14.0.0 Final fMicrosoft Office 2011 14.0.0 Final fMicrosoft Office 2011 14.0.0 Final f ... Licensed)",
						totalBytes: 512000000,
						downloadedBytes: 423000000,
						thumb: "folder.png",
						downloadSpeedBytes: 256000,
						time: 53,
						createdDate: (new Date()).setDate(new Date().getDate()-1), // yesterday
						rootPath: "d:/Downloads/Microsoft Office 2011 14.0.0 Final f ... Licensed)",
						outputFilePath: "d:/Downloads/",
						domain: "microsoft.com",
						url: "microsoft.com/Microsoft Office 2011 14.0.0 Final f ... Licensed",
						state:  fdm.models.DownloadState.Completed,
						isMovable: true,
						errorText: "Torrent is not available in your country.",
						downloadType: fdm.models.DownloadType.Trt,
						tags: [{'id':1, 'name': 'torrent', system: true, 'colorR': 10, 'colorG': 255, 'colorB': 0}],
						dhtNodes: 123,
						filesCount: 100,
						filesChosenCount: 100,
						uploadedBytes: 3300000,
						seedsCount: 10,
						peersCount: 5,
						uploadSpeedBytes: 440,
						uploadSpeedLimitBytes: 600,
						shareRatio: 1.23,
						seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
						availability: 0.543,
						comment: "comment",
						seedingEnabled: true,
						trackers: [{ip: "200.100.4.7", url: "china.com", name: "China", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 44, peers: 23, downloaded: 2},
							{ip: "200.100.4.7", url: "Piratebay.es", name: "Pirate bay", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 48, peers: 3, downloaded: 2},
							{ip: "200.100.4.7", url: "exbomb.com", name: "[bomb]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 55, peers: 6, downloaded: 2},
							{ip: "200.100.4.7", url: "china2.com", name: "China 2", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 53, peers: 34, downloaded: 2}],
						peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
							{ip: "104.72.32.0", client: "BitTorrent 1.0.2", flags: 1, progress: 12, downloadSpeed: 13000, uploadSpeed: 900, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
							{ip: "156.53.0.0", client: "opera", flags: 2106419, progress: 45, downloadSpeed: 1000, uploadSpeed: 500, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
							{ip: "200.100.4.7", client: "MyTorrent", flags: 1057843, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						
					}, {
						fileName: "hs-1996-38-b-full_tif.tif",
						totalBytes: 21800,
						downloadedBytes: 8000,
						thumb: "thumbnail.png",
						downloadSpeedBytes: 3490,
						time: 53,
						createdDate: (new Date()).setDate(new Date().getDate()-2),
						rootPath: "d:/Downloads/hs-1996-38-b-full_tif.tif",
						outputFilePath: "d:/Downloads/hs-1996-38-b-full_tif.tif",
						domain: "rutracker.org",
						url: "rutracker.org/hs-1996-38-b-full_tif.tif",
						state: getRandom(3, 2),
						isMovable: true,
						errorText: "This picture is reserved by licence agreement.This picture is reserved by licence agreement.This picture is reserved by licence agreement.This picture is reserved by licence agreement.",
						downloadType: fdm.models.DownloadType.Regular,
						tags: []
					}, {
						fileName: "Expose123.png",
						totalBytes: 69000,
						downloadedBytes: 68000,
						thumb: "thumbnail.png",
						downloadSpeedBytes: 3490,
						time: 53,
						createdDate: new Date(1374984020000), // milliseconds from Jan 1 1970
						rootPath: "d:/Downloads/Expose.png",
						outputFilePath: "d:/Downloads/Expose.png",
						domain: "iconfinder.com",
						url: "iconfinder.com/Expose.png",
						state: fdm.models.DownloadState.Error ,
						isMovable: true,
						isMoving: true,
						errorText: "We knew you are not 18.",
						downloadType: fdm.models.DownloadType.Regular,
						tags: []
					}, {
						fileName: "Expose2.png",
						totalBytes: 69000,
						downloadedBytes: 68000,
						thumb: "thumbnail.png",
						downloadSpeedBytes: 3490,
						time: 53,
						createdDate: new Date(1374984020000), // milliseconds from Jan 1 1970
						rootPath: "d:/Downloads/Expose.png",
						outputFilePath: "d:/Downloads/Expose.png",
						domain: "iconfinder.com",
						url: "iconfinder.com/Expose.png",
						state: fdm.models.DownloadState.Error ,
						progress: 10,
						isMovable: true,
						isMoving: false,
						errorText: "We knew you are not 18.",
						downloadType: fdm.models.DownloadType.Regular,
						tags: []
					}, {
						fileName: "Expose3.png",
						totalBytes: 69010,
						downloadedBytes: 69000,
						thumb: "thumbnail.png",
						downloadSpeedBytes: 3490,
						time: 53,
						createdDate: new Date(1374984020000), // milliseconds from Jan 1 1970
						rootPath: "d:/Downloads/Expose.png",
						outputFilePath: "d:/Downloads/Expose.png",
						domain: "iconfinder.com",
						url: "iconfinder.com/Expose.png",
						state: fdm.models.DownloadState.Error ,
						progress: 100,
						isMovable: true,
						isMoving: false,
						errorText: "We knew you are not 18.",
						downloadType: fdm.models.DownloadType.Regular,
						tags: []
					}, {
						fileName: "Expose4.png",
						totalBytes: 69000,
						downloadedBytes: 1000,
						thumb: "thumbnail.png",
						downloadSpeedBytes: 3490,
						time: 53,
						createdDate: new Date(1374984020000), // milliseconds from Jan 1 1970
						rootPath: "d:/Downloads/Expose.png",
						outputFilePath: "d:/Downloads/Expose.png",
						domain: "iconfinder.com",
						url: "iconfinder.com/Expose.png",
						state: fdm.models.DownloadState.Downloading,
						progress: 0,
						isMovable: true,
						isMoving: false,
						isPreallocating: true,
						errorText: "We knew you are not 18.",
						downloadType: fdm.models.DownloadType.Regular,
						tags: []
					}, {
						fileName: "Enric Sala: Journey to the Pitcairn Island",
						totalBytes: 600000000.5,
						downloadedBytes: 30000000.1,
						thumb: "thumbnail.png",
						downloadSpeedBytes: 34900,
						time: 53,
						createdDate:(new Date()).setDate(new Date().getDate()-4), // 2 days before
						rootPath: "d:/Downloads/Enric Sala: Journey to the Pitcairn Island",
						outputFilePath: "d:/Downloads/",
						domain: "rutracker.org",
						url: "rutracker.org/Enric Sala: Journey to the Pitcairn Island",
						//state: fdm.models.DownloadState.Downloading,
						state: fdm.models.DownloadState.FileProcessing,
						isMovable: true,
						downloadType: fdm.models.DownloadType.Trt,
						dhtNodes: 123,
						torrent: {
							uploadedBytes: 330000,
							seedsCount: 10,
							peersCount: 5,
							uploadSpeedBytes: 440,
							uploadSpeedLimitBytes: 600,
							shareRatio: 1.23,
							seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
							availability: 0.543,
							comment: "comment",
							seedingEnabled: true,
							trackers: [{ip: "200.100.4.7", url: "china.com", name: "China", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 44, peers: 23, downloaded: 2},
								{ip: "200.100.4.7", url: "Piratebay.es", name: "Pirate bay", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 48, peers: 3, downloaded: 2},
								{ip: "200.100.4.7", url: "exbomb.com", name: "[bomb]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 55, peers: 6, downloaded: 2},
								{ip: "200.100.4.7", url: "china2.com", name: "China 2", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 53, peers: 34, downloaded: 2}],
							peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "156.53.0.0", client: "opera", flags: 1057843, progress: 45, downloadSpeed: 1000, uploadSpeed: 500, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "200.100.4.7", client: "MyTorrent", flags: 1057843, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						}
					}, {
						fileName: "Enric Sala2: Journey to the Pitcairn Island",
						totalBytes: 600000000.5,
						downloadedBytes: 30000000.1,
						thumb: "thumbnail.png",
						downloadSpeedBytes: 34900,
						progress: 10,
						time: 53,
						createdDate:(new Date()).setDate(new Date().getDate()-4), // 2 days before
						rootPath: "d:/Downloads/Enric Sala: Journey to the Pitcairn Island",
						outputFilePath: "d:/Downloads/",
						domain: "rutracker.org",
						url: "rutracker.org/Enric Sala: Journey to the Pitcairn Island",
						//state: fdm.models.DownloadState.Downloading,
						state: fdm.models.DownloadState.Checking,
                        checking: fdm.models.CheckingState.Queued,
						checkingProgress: 1,
						isMovable: true,
						downloadType: fdm.models.DownloadType.Trt,
						dhtNodes: 123,
						torrent: {
							uploadedBytes: 330000,
							seedsCount: 10,
							peersCount: 5,
							uploadSpeedBytes: 440,
							uploadSpeedLimitBytes: 600,
							shareRatio: 1.23,
							seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
							availability: 0.543,
							comment: "comment",
							seedingEnabled: true,
							trackers: [{ip: "200.100.4.7", url: "china.com", name: "China", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 44, peers: 23, downloaded: 2},
								{ip: "200.100.4.7", url: "Piratebay.es", name: "Pirate bay", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 48, peers: 3, downloaded: 2},
								{ip: "200.100.4.7", url: "exbomb.com", name: "[bomb]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 55, peers: 6, downloaded: 2},
								{ip: "200.100.4.7", url: "china2.com", name: "China 2", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 53, peers: 34, downloaded: 2}],
							peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "156.53.0.0", client: "opera", flags: 1057843, progress: 45, downloadSpeed: 1000, uploadSpeed: 500, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "200.100.4.7", client: "MyTorrent", flags: 1057843, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						}
					}, {
						fileName: "2 holl.mov",
						totalBytes: 218000000,
						downloadedBytes: 0,//218000000,
						thumb: "thumbnail.png",
						downloadSpeedBytes: 34900,
						time: 53,
						createdDate: (new Date()).setDate(new Date().getDate()-3), // 3 days before
						rootPath: "d:/Downloads/2 hall.mov",
						outputFilePath: "d:/Downloads/2 hall.mov",
						domain: "rfei.ru",
						state: fdm.models.DownloadState.Completed,
						isMoving: true,
						moveProgress: 10,
						isMovable: true,
						downloadType: fdm.models.DownloadType.Regular,
						tags: []
					}, {
						fileName: "Expose2.png",
						totalBytes: 69000,
						downloadedBytes: 69000,
						thumb: "thumbnail.png",
						downloadSpeedBytes: 3490,
						time: 53,
						createdDate: new Date(1374984200000), // milliseconds from Jan 1 1970
						rootPath: "d:/Downloads/Expose2.png",
						outputFilePath: "d:/Downloads/Expose2.png",
						domain: "iconfinder.com",
						url: "iconfinder.com/path/Expose2.png",
						state: fdm.models.DownloadState.Completed,
						completedTime: (+new Date() + 10000000),
						isMoving: true,
						isMovable: true,
						downloadType: fdm.models.DownloadType.Regular,
						tags: []
					}, {
						fileName: "Interior design ideas full package",
						totalBytes: 65000000,
						downloadedBytes: 65000000,
						thumb: "folder.png",
						downloadSpeedBytes: 34900,
						time: 53,
						createdDate: new Date(1374984400000), // milliseconds from Jan 1 1970
						rootPath: "d:/Downloads/Interior design ideas full package",
						outputFilePath: "d:/Downloads/Interior design ideas full package",
						domain: "rutracker.org",
						url: "rutracker.org/Interior+design+ideas+full+package",
						state: fdm.models.DownloadState.Completed,
						isMovable: true,
						downloadType: fdm.models.DownloadType.Regular,
						tags: []
					}, {
						fileName: "Scorpions all albums (full discography). Also super long file name, to test markup. wwwwwwwwwwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww ",
						totalBytes: 6000000000.5,
						downloadedBytes: 30000000.1,
						thumb: "thumbnail.png",
						downloadSpeedBytes: 34900,
						time: 53,
						createdDate:(new Date()).setDate(new Date().getDate()-4), // 2 days before
						rootPath: "d:/Downloads/Scorpions all albums (full discography)",
						outputFilePath: "d:/Downloads/",
						domain: "rutracker.org",
						url: "rutracker.org/Scorpions%20all%20albums%20(full%20discography)",
						//state: fdm.models.DownloadState.Downloading,
						state: fdm.models.DownloadState.FileProcessing,
						isMovable: true,
						downloadType: fdm.models.DownloadType.Trt,
						dhtNodes: 123,
						tags: [{'id':103, 'name': 'important', system: false, 'colorR': 180, 'colorG': 255, 'colorB': 0}],
						torrent: {
							uploadedBytes: 330000,
							seedsCount: 10,
							peersCount: 5,
							uploadSpeedBytes: 440,
							uploadSpeedLimitBytes: 600,
							shareRatio: 1.23,
							seedsConnectedStat:10,seedsAllStat:20,peersConnectedStat:30,peersAllStat:150,
							availability: 0.543,
							comment: "comment",
							seedingEnabled: true,
							trackers: [{ip: "200.100.4.7", url: "china.com", name: "China", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 44, peers: 23, downloaded: 2},
								{ip: "200.100.4.7", url: "Piratebay.es", name: "Pirate bay", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 48, peers: 3, downloaded: 2},
								{ip: "200.100.4.7", url: "exbomb.com", name: "[bomb]", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 55, peers: 6, downloaded: 2},
								{ip: "200.100.4.7", url: "china2.com", name: "China 2", status: 1, nextAnnounce: new Date("May 13, 2014 11:13:01"), seeds: 53, peers: 34, downloaded: 2}],
							peers: [{ip: "192.168.1.1", client: "uTorrent 3.3.2", flags: 1, progress: 54, downloadSpeed: 20000, uploadSpeed: 5000, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "156.53.0.0", client: "opera", flags: 1057843, progress: 45, downloadSpeed: 1000, uploadSpeed: 500, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000},
								{ip: "200.100.4.7", client: "MyTorrent", flags: 1057843, progress: 3, downloadSpeed: 7000, uploadSpeed: 200, requests: 12, downloadedBytes: 8000, uploadedBytes: 5000}]
						}
					}];
				data = window.fdmAppFakes.downloads.__static_items__;
				//data = data.concat(_.map(data, _.clone));
				//data = data.concat(_.map(data, _.clone)); // 60
				//data = data.concat(_.map(data, _.clone)); // 120
				//data = data.concat(_.map(data, _.clone));
				//data = data.concat(_.map(data, _.clone)); // 480

				/*data[data.length - 10] = {
					fileName: "Family photo album",
					totalBytes: 65000000,
					downloadedBytes: 65000000,
					thumb: "folder1.png",
					downloadSpeedBytes: 34900,
					time: 53,
					createdDate: new Date(1374984400000), // milliseconds from Jan 1 1970
					rootPath: "d:/Downloads/Family photo album",
					outputFilePath: "d:/Downloads/Family photo album",
					domain: "rutracker.org",
					url: "rutracker.org/Family_photo_album",
					state: fdm.models.DownloadState.Completed,
					isMovable: true,
					downloadType: fdm.models.DownloadType.Regular,
//					tags: [],
					tags: [{id:104, name: 'family', system: false, colorR: 10, colorG: 255, colorB: 255}]
				};*/

				downloads = [];
				for(var i=0,l=data.length; i<l; i++) {
					var download = _.clone(data[i]);
					this._addDownload(download);
				}
				window.fdmApp.downloads.onDownloadListBuilt();
			},

			calcRemainingSec: function(rawItem){
				var remainingBytes = rawItem.totalBytes - rawItem.downloadedBytes;
				remainingBytes = remainingBytes > 0 ? remainingBytes : 0;
				var remainingSec = undefined;
				if(remainingBytes && rawItem.downloadSpeedBytes) {
					remainingSec = remainingBytes / rawItem.downloadSpeedBytes;
				}
				remainingSec = remainingSec != undefined ? remainingSec * 1000 : -1;
				return remainingSec;
			},

			_disableUiRefresh: false,
			_updateData: function (){
				if(fdmAppFakes.downloads._disableUiRefresh) return;

				if(!downloads) {
					this._populateData();
				}
				// fix speeds for already completed downloads
				var completed = _.where(downloads, {state: fdm.models.DownloadState.Completed});
				for(var i=0; i < completed.length; ++i) {
					if(completed[i].downloadSpeedBytes > 0 || completed[i].downloadSpeedLimit > 0)
					{
						completed[i].downloadSpeedBytes = 0;
						completed[i].downloadSpeedLimit = 0;
						this.onSpeedChanged(completed[i].id);
					}
				}

				// fix speeds for already paused downloads
				var paused = _.where(downloads, {state: fdm.models.DownloadState.Paused});
				for(var i=0; i < paused.length; ++i) {
					if(paused[i].downloadSpeedBytes > 0 || paused[i].downloadSpeedLimit > 0)
					{
						paused[i].downloadSpeedBytes = 0;
						paused[i].downloadSpeedLimit = 0;
						this.onSpeedChanged(paused[i].id);
					}
				}

				// increase progress to simulate a downloading process
				var inProgress = _.where(downloads, {state: fdm.models.DownloadState.Downloading});
				var l = Math.min(fdmAppFakes._getMaxTasks(), inProgress.length);
				for(var i=0; i < l; ++i) {
					var download = inProgress[i];
					var progress = download.progress;
					if(progress < 100) {
						progress += 1;
						download.downloadedBytes = (download.totalBytes * (progress)) / 100;
						//download.remainingTime = this.calcRemainingSec(download);
						download.__update_files();

						this.onLogMessages(download.id, [{text: download.totalBytes + " bytes are downloaded.", time: new Date(), type: 1}]);
						this.onItemProgressChanged(download.id);
						this.onItemChanged2(download.id, {
							downloadedBytes: (download.totalBytes * (progress)) / 100
							//remainingTime: download.remainingTime,
						});
					}
					else {
						download.state = fdm.models.DownloadState.Completed;
						download.downloadSpeedBytes = 0;
						download.downloadSpeedLimit = 0;
						download.__update_files(100);

						this.onLogMessages(download.id, [{text: "The download is completed", time: new Date(), type: 3}]);
						this.onItemChanged(download.id);
						this.onItemChanged2(download.id, {
							state:fdm.models.DownloadState.Completed,
							downloadSpeedBytes:0,
							downloadSpeedLimit:0,
						});
						this.onItemCompleted(download.id);
					}
				}
				return downloads;
			},
			_updateSpeed: function(){
				if(fdmAppFakes.downloads._disableUiRefresh) return;

				if(!downloads) {
					this._populateData();
				}
				var totalDownloadSpeed = 0, totalUploadSpeed = 0;
				// increase progress to simulate a downloading process
				var inProgress = _.where(downloads, {state: fdm.models.DownloadState.Downloading});
				for(var i=0, l = Math.min(fdmAppFakes._getMaxTasks(), inProgress.length); i < l; ++i) {
					var download = inProgress[i];

					download.downloadSpeedBytes = getNormalRandom(download.downloadSpeedBytes, download.downloadSpeedBytes * 0.15);
					download.downloadSpeedLimit = getNormalRandom(download.downloadSpeedBytes, download.downloadSpeedBytes * 0.1);

					totalDownloadSpeed += download.downloadSpeedBytes;
					this.onSpeedChanged(download.id);
				}
				var torrents = _.where(downloads, {downloadType: fdm.models.DownloadType.Trt});
				for(var i=0, l = Math.min(fdmAppFakes._getMaxTasks(), torrents.length); i < l; ++i) {
					var download = torrents[i];
					if(download.state != fdm.models.DownloadState.Error && download.uploadSpeedBytes > 0) {
						download.uploadSpeedBytes = getNormalRandom(download.uploadSpeedBytes, download.uploadSpeedBytes * 0.15);
						download.uploadSpeedLimitBytes = getNormalRandom(download.uploadSpeedBytes, download.uploadSpeedBytes * 0.1);

						totalUploadSpeed += download.uploadSpeedBytes;
						this.onSpeedChanged(download.id);
					}
				}
				this.onTotalSpeedChanged(totalDownloadSpeed, totalUploadSpeed);

			},
			_fetch: function() {
				this._populateData();

				// _fetch is called once so that we can use bindAll here.
				_.bindAll(this, "_updateData", "_updateSpeed");

				setInterval(this._updateData, 1000);
				setInterval(this._updateSpeed, 1000);
			},
			_addDownload: function(download){
				var self = this;
				_.extend(download, {
					//calculated members
					id: downloads.length + 1,//download.fileName + getRandom(1, 100),
					downloadSpeedLimit: 400000,
					domain: fdm.urlUtils.extractDomain(download.url),
					checkingProgress: 0,

					//methods
					play: function(){
						console.log("play");
						this.state = fdm.models.DownloadState.Downloading;
						this.downloadSpeedBytes = getNormalRandom(500000, 500000 * 0.15);
						this.downloadSpeedLimit = getNormalRandom(500000, 500000 * 0.1);
						self.onItemChanged(this.id);
						self.onItemChanged2(this.id, {
							state: this.state,
							downloadSpeedBytes: this.downloadSpeedBytes,
							downloadSpeedLimit: this.downloadSpeedLimit,
						});
					},
					pause: function(){
						console.log("pause");
						this.state = fdm.models.DownloadState.Paused;
						this.downloadSpeedBytes = 0;
						this.downloadSpeedLimit = 0;
						self.onItemChanged(this.id);
						self.onItemChanged2(this.id, {
							state: this.state,
							downloadSpeedBytes: this.downloadSpeedBytes,
							downloadSpeedLimit: this.downloadSpeedLimit,
						});
					},
					restart: function(){
						this.errorText = "";
						this.createdDate = new Date();
						console.log("restart");
						this.play();
					},
					launch: function(){console.log("launch");},
					addTag: function(tagId){
						if(!_.findWhere(this.tags, {id: tagId})){
							var tag = _.findWhere(fdmAppFakes.tagManager.__tags__, {id: tagId});
							var tags = this.tags;
							tags.push(_.clone(tag));
							this.tags = tags;
							fdmAppFakes.tagManager.onTagsChanged(this.id);
						}
					},
					removeTag: function(tagId){
						var tags = this.tags;
						var index = _.findIndex(tags, {id: tagId});
						if(index >= 0){
							var tags = this.tags;
							tags.splice(index, 1);
							tags = _.map(tags, _.clone);
							this.tags = tags;
							fdmAppFakes.tagManager.onTagsChanged(this.id);
						}
					},
					getDownloadProperties: function(properties, torrentProperties, callback){
						callback(this);
						return this;
					},
					openFolder: function(){console.log("openFolder");alert("The download is opened! :)");}
				});

				Object.defineProperties(download, {
					progress: {get: function () {
						return Math.min( Math.round(this.downloadedBytes * 100 / this.totalBytes), 100);
					}},
					fileTree: {get: function () {
						this.files[0].name = this.fileName;
						var tree = fdm.fileUtils.fileListToFileTree(this.files);
						return tree;
					}},
					comment: {get: function () {
						return "some comment of '" + this.fileName + "' file";
					}}
				});
				if(!download.errorText){
					download.errorText = "";
				}
				if(!download.sections){
					download.sections = 10;
				}
				download.files = fdm.fileUtils.fileListToFileTree(window.fdmAppFakes.downloadWizard.__static_files__);

				download.__update_files = function(forcedPercent){
					var result = [];
					var files = window.fdmAppFakes.downloadWizard.__static_files__;
					for(var i= 0, l = files.length; i < l; i++) {
						var file = _.clone(files[i]);
						file.progress = forcedPercent != null ? forcedPercent : getRandom(10, 90);
						file.priority = "high";//_.sample(["high", "low", "medium", "urgent"]);
						//file.name = file.name.substr(0, file.name.length - 4) + " - " + getRandom(0, 9);
						result.push(file);
					}
					this.files = fdm.fileUtils.fileListToFileTree(result);
				};
				/*download.properties.tags = JSON.stringify(download.properties.tags || []);
				if(download.properties.torrent){
					download.properties.torrent.peers = JSON.stringify(download.properties.torrent.peers || []);
					download.properties.torrent.trackers = JSON.stringify(download.properties.torrent.trackers || []);
				}*/
				downloads.push(download);

				window.fdmApp.downloads.onItemAdded(download.id, download.downloadType, download);
			},
			getItem: function(index){
				return downloads[index];
			},
			getItemById: function(itemId){
				var index = itemId;
				return downloads[index];
			},
			deleteItem: function(itemId){
				_.defer(_.bind(function() {
					var index = itemId;
					downloads.slice(index, 1);
					fdmAppFakes.downloads.onItemDeleted(itemId);
				}, this));
			},
			deleteByIds: function(itemIds){
				_.defer(_.bind(function() {
					for(var i=0; i < itemIds.length; i++) {
						var itemId = itemIds[i];
						var index = itemId;
						downloads.slice(index, 1);
						fdmAppFakes.downloads.onItemDeleted(itemId);
					}
				}, this));
			},
			getTotalDownloadSpeed: function() {
				return 1000 + Math.random() * 5000000;
			},
			getTotalUploadSpeed: function() {
				return 1000 + Math.random() * 500000;
			},
			onItemAdded: function(item){},
			onItemChanged: function(itemId){},
			onItemChanged2: function(itemId, changes){

				var d = {};
				d[itemId] = changes;

				fakes.MessageCallback("downloads.onItemChanged2", d);
			},
			onItemDeleted: function(itemId){fakes.MessageCallback("downloads.onItemDeleted", itemId);},
			onLogMessages: function(itemId, messages){
				fakes.MessageCallback("downloads.onLogMessages", itemId, messages);
			},
			onItemProgressChanged: function(itemId){
				fakes.MessageCallback("downloads.onItemProgressChanged", itemId);
			},
			onItemCheckingProgressChanged: function(itemId){},
			onItemPriorityChanged: function(itemId){},
			onSpeedChanged: function(itemId){
				fakes.MessageCallback("downloads.onSpeedChanged", itemId);
			},
			onTotalSpeedChanged: function(downSpeed, upSpeed){
				fakes.MessageCallback("downloads.onTotalSpeedChanged", downSpeed, upSpeed);
			},
			onItemCompleted: function(itemId){
				fakes.MessageCallback("downloads.onItemCompleted", itemId);
			},
			startAll: function(){
				var inProgress = _.where(downloads, {state: fdm.models.DownloadState.Paused});
				for(var i=0; i < inProgress.length; ++i) {
					var download = inProgress[i];
					//download.state = fdm.models.DownloadState.Downloading;
					this.onLogMessages(download.id, [{text: "The download is started", time: new Date(), type: 1}]);
					this.onItemChanged(download.id);
					this.onItemChanged2(download.id, {state:fdm.models.DownloadState.Downloading});
				}
			},
			stopAll: function(){
				var inProgress = _.where(downloads, {state: fdm.models.DownloadState.Downloading});
				for(var i=0; i < inProgress.length; ++i) {
					var download = inProgress[i];
					//download.state = fdm.models.DownloadState.Paused;
					this.onLogMessages(download.id, [{text: "The download is stopped", time: new Date(), type: 1}]);
					this.onItemChanged(download.id);
					this.onItemChanged2(download.id, {state:fdm.models.DownloadState.Paused});
				}
			},
			startByIds: function(ids){
				for(var i=0; i < downloads.length; ++i) {
					if(_.contains(ids, i)){
						var download = downloads[i];
						//download.state = fdm.models.DownloadState.Downloading;
						this.onLogMessages(download.id, [{text: "The download is started", time: new Date(), type: 1}]);
						this.onItemChanged2(download.id, {state:fdm.models.DownloadState.Downloading});
					}
				}
			},
			stopByIds: function(ids){
				for(var i=0; i < downloads.length; ++i) {
					if(_.contains(ids, i)){
						var download = downloads[i];
						//download.state = fdm.models.DownloadState.Paused;
						this.onLogMessages(download.id, [{text: "The download is stopped", time: new Date(), type: 1}]);
						this.onItemChanged2(download.id, {state:fdm.models.DownloadState.Paused});
					}
				}
			},
			moveToByIds: function(ids){
				var path = window.fdmAppFakes.system.openFolderDialog();
				for(var i=0; i < downloads.length; ++i) {
					if(_.contains(ids, i)){
						var download = downloads[i];
						//download.rootPath = path + "/" + download.fileName;
						//download.outputFilePath = path + "/" + download.fileName;
						this.onLogMessages(download.id, [{text: "The download is moved to '" + path + "'.", time: new Date(), type: 1}]);
						this.onItemChanged(download.id);
						this.onItemChanged2(download.id, {
							rootPath: download.rootPath,
							outputFilePath: download.outputFilePath
						});
					}
				}
			},
			getDHTNodes: function(){
				return [];
			},
			getDownloadsProperties: function(download_ids, properties, torrentProperties, callback){

				var downloads_static = window.fdmAppFakes.downloads.__static_items__;
				var downloads = [];
				for(var i=0; i < downloads_static.length; ++i) {
					var download = {};//downloads[i];
					_.extend(download, {
						id: i + 1,//download.fileName + getRandom(1, 100),
						properties: downloads_static[i]
					});
					download.properties['id'] = i + 1;
					downloads.push(download);
				}
				//callback(JSON.stringify(downloads));
				return downloads;
			},
            downloadsExistsOnDisk: function(download_ids, properties, callback){

				var r = [];
				for(var i=0; i < download_ids.length; ++i) {

					var id = download_ids[i];
                    r.push({
                        existsOnDisk: true,
						id: id
					});
				}

                return r;
			},

			play: function(id){
				//alert('123');
				console.log("play");
				//this.state = fdm.models.DownloadState.Downloading;
				//this.downloadSpeedBytes = getNormalRandom(500000, 500000 * 0.15);
				//this.downloadSpeedLimit = getNormalRandom(500000, 500000 * 0.1);
				//self.onItemChanged(this.id);
				fdmAppFakes.downloads.onItemChanged2(id, {
					state: fdm.models.DownloadState.Downloading,
					downloadSpeedBytes: getNormalRandom(500000, 500000 * 0.15),
					downloadSpeedLimit: getNormalRandom(500000, 500000 * 0.1),
				});
			},
			pause: function(id){
				console.log("pause");
				//this.state = fdm.models.DownloadState.Paused;
				//this.downloadSpeedBytes = 0;
				//this.downloadSpeedLimit = 0;
				//self.onItemChanged(this.id);
				fdmAppFakes.downloads.onItemChanged2(id, {
					state: fdm.models.DownloadState.Paused,
					downloadSpeedBytes: 0,
					downloadSpeedLimit: 0,
				});
			},
			restart: function(id){
				//this.errorText = "";
				//this.createdDate = new Date();
				//console.log("restart");
				fdmAppFakes.downloads.play(id);
			},
			launch: function(){console.log("launch");},

			openFolder: function(){console.log("openFolder");alert("The download is opened! :)");},

			getDownloadProperties: function(download_id, properties){

				var download = _.findWhere(window.fdmAppFakes.downloads.__static_items__, {id: download_id});
				if (!download)
					return false;

				var result = {};
				for(var i=0; i < properties.length; i++){
					var prop = properties[i];
					if (prop == 'files')
						result[prop] = JSON.stringify(fdm.fileUtils.fileListToFileTree(window.fdmAppFakes.downloadWizard.__static_files__));
					else
						result[prop] = download[prop];
				}

				return result;
			},
			listenToLogUpdates: function(download_id){

				fdmAppFakes.downloads.onLogMessages(download_id, [
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1},
					{text: "onLogMessages", time: new Date(), type: 1}
				]);
			},
            getProgressMap: function(download_id){

                var map = [1115,
                    69,
                    1050,
                    55,
                    1050,
                    87,
                    1068,
                    7,
                    1018,
                    57,
                    1069,
                    86,
                    1057,
                    13,
                    1018,
                    52,
                    1039,
                    102,
                    1039,
                    100];

                // for (var i = 0; i < 100; i++){
                //
                //     map.push(Math.round(Math.random()));
                // }

                return map;
			}

		};
		Object.defineProperties(window.fdmAppFakes.downloads, {
			size: {get: function(){return downloads.length;}}
		});
	}



	function populateBatchDownloads() {
		if (window.fdmAppFakes.batchDownloads) {
			return;
		};

		window.fdmAppFakes.batchDownloads = {
			getDownloadsIds: function(batch_id, callback) {

				return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,18,19];
			}
		};
	}

	function populateDownloadWizard() {
		if (window.fdmAppFakes.downloadWizard) {
			return;
		}
		window.fdmAppFakes.downloadWizard = {

			__static_urls__: [
				{data:{name:"summary file name1",url:"url1"},checked: true},
				{data:{name:"summary file name2",url:"url2"},checked: true},
				{data:{name:"summary file name3",url:"url3"},checked: true},
				{data:{name:"summary file name4",url:"url4"},checked: true},
				{data:{name:"summary file name5",url:"url5"},checked: true},
				{data:{name:"summary file name6",url:"url6"},checked: true},
				{data:{name:"summary file name7",url:"url7"},checked: true},
				{data:{name:"summary file name8",url:"url8"},checked: true}
			],

			__static_files__: [
				{index:0,parentIndex:-1,name:"summary file name",size:455032192,sizeFmt:"434 MB",progress:67, priority: "High"},
				{index:1,parentIndex:0,name:"some folder",size:145949596,sizeFmt:"139 MB",progress:67, priority: "High"},
				{index:2,parentIndex:1,name:"101-blank_and_jones_featis..._mix)-nb.flac",size:1159065,sizeFmt:"1132 KB",progress:67, priority: "High"},
				{index:3,parentIndex:1,name:"102-stelly_m-summer_breeze-nbflac.flac",size:7749233,sizeFmt:"7568 KB",progress:67, priority: "High"},
				{index:4,parentIndex:1,name:"103-gelka_feat_phoenix_pearle-byou-nbflac",size:1179962,sizeFmt:"1152 KB",progress:67, priority: "High"},
				{index:5,parentIndex:1,name:"104-afterlife-suddenly-nbflac.flac",size:8582019,sizeFmt:"8381 KB",progress:67, priority: "High"},
				{index:6,parentIndex:1,name:"105-moya-lost_and_found_(no_l)-nbflac.flac",size:12461726,sizeFmt:"11.9 MB",progress:67, priority: "High"},
				{index:7,parentIndex:1,name:"106-the_ramona_fl_many_colours-nbflac.flac",size:1011736,sizeFmt:"988 KB",progress:67, priority: "High"},
				{index:8,parentIndex:1,name:"107-ashley_height-painkillers-nbflac.flac",size:8772201,sizeFmt:"8567 KB",progress:67, priority: "High"},
				{index:9,parentIndex:0,name:"ben_onono-small_world-nbflac.flac",size:763062,"sizeFmt":"745 KB",progress:67, priority: "High"},
				{index:10,parentIndex:-1,name:"summary file name",size:455032192,sizeFmt:"434 MB",progress:67, priority: "High"},
				{index:11,parentIndex:10,name:"some folder",size:145949596,sizeFmt:"139 MB",progress:67, priority: "High"},
				{index:12,parentIndex:11,name:"101-blank_and_jones_featis..._mix)-nb.flac",size:1159065,sizeFmt:"1132 KB",progress:67, priority: "High"},
				{index:13,parentIndex:11,name:"102-stelly_m-summer_breeze-nbflac.flac",size:7749233,sizeFmt:"7568 KB",progress:67, priority: "High"},
				{index:14,parentIndex:11,name:"103-gelka_feat_phoenix_pearle-byou-nbflac",size:1179962,sizeFmt:"1152 KB",progress:67, priority: "High"},
				{index:15,parentIndex:11,name:"104-afterlife-suddenly-nbflac.flac",size:8582019,sizeFmt:"8381 KB",progress:67, priority: "High"},
				{index:16,parentIndex:11,name:"105-moya-lost_and_found_(no_l)-nbflac.flac",size:12461726,sizeFmt:"11.9 MB",progress:67, priority: "High"},
				{index:17,parentIndex:11,name:"106-the_ramona_fl_many_colours-nbflac.flac",size:1011736,sizeFmt:"988 KB",progress:67, priority: "High"},
				{index:18,parentIndex:11,name:"107-ashley_height-painkillers-nbflac.flac",size:8772201,sizeFmt:"8567 KB",progress:67, priority: "High"},
				{index:19,parentIndex:10,name:"ben_onono-small_world-nbflac.flac",size:763062,"sizeFmt":"745 KB",progress:67, priority: "High"},
				{index:20,parentIndex:0,name:"Pearle being",size:11290398,"sizeFmt":"10.8 MB",progress:67, priority: "High", url: "http://www.test.test"},
				{index:21,parentIndex:19,name:"some folder",size:145949596,sizeFmt:"139 MB",progress:67, priority: "High"},
				{index:22,parentIndex:21,name:"101-blank_and_jones_featis..._mix)-nb.flac",size:1159065,sizeFmt:"1132 KB",progress:67, priority: "High"},
				{index:23,parentIndex:21,name:"102-stelly_m-summer_breeze-nbflac.flac",size:7749233,sizeFmt:"7568 KB",progress:67, priority: "High"},
				{index:24,parentIndex:21,name:"103-gelka_feat_phoenix_pearle-byou-nbflac",size:1179962,sizeFmt:"1152 KB",progress:67, priority: "High"},
				{index:25,parentIndex:21,name:"104-afterlife-suddenly-nbflac.flac",size:8582019,sizeFmt:"8381 KB",progress:67, priority: "High"},
				{index:26,parentIndex:21,name:"105-moya-lost_and_found_(no_l)-nbflac.flac",size:12461726,sizeFmt:"11.9 MB",progress:67, priority: "High"},
				{index:27,parentIndex:21,name:"106-the_ramona_fl_many_colours-nbflac.flac",size:1011736,sizeFmt:"988 KB",progress:67, priority: "High"},
				{index:28,parentIndex:21,name:"107-ashley_height-painkillers-nbflac.flac",size:8772201,sizeFmt:"8567 KB",progress:67, priority: "High"},
				{index:29,parentIndex:0,name:"ben_onono-small_world-nbflac.flac",size:763062,"sizeFmt":"745 KB",progress:67, priority: "High"},
				{index:30,parentIndex:0,name:"Pearle being",size:11290398,"sizeFmt":"10.8 MB",progress:67, priority: "High", url: "http://www.test.test"},
				{index:31,parentIndex:0,name:"some folder",size:145949596,sizeFmt:"139 MB",progress:67, priority: "High"},
				{index:32,parentIndex:31,name:"101-blank_and_jones_featis..._mix)-nb.flac",size:1159065,sizeFmt:"1132 KB",progress:67, priority: "High"},
				{index:33,parentIndex:31,name:"102-stelly_m-summer_breeze-nbflac.flac",size:7749233,sizeFmt:"7568 KB",progress:67, priority: "High"},
				{index:34,parentIndex:31,name:"103-gelka_feat_phoenix_pearle-byou-nbflac",size:1179962,sizeFmt:"1152 KB",progress:67, priority: "High"},
				{index:35,parentIndex:31,name:"104-afterlife-suddenly-nbflac.flac",size:8582019,sizeFmt:"8381 KB",progress:67, priority: "High"},
				{index:36,parentIndex:31,name:"105-moya-lost_and_found_(no_l)-nbflac.flac",size:12461726,sizeFmt:"11.9 MB",progress:67, priority: "High"},
				{index:37,parentIndex:31,name:"106-the_ramona_fl_many_colours-nbflac.flac",size:1011736,sizeFmt:"988 KB",progress:67, priority: "High"},
				{index:38,parentIndex:31,name:"107-ashley_height-painkillers-nbflac.flac",size:8772201,sizeFmt:"8567 KB",progress:67, priority: "High"},
				{index:39,parentIndex:31,name:"ben_onono-small_world-nbflac.flac",size:763062,"sizeFmt":"745 KB",progress:67, priority: "High"},
				{index:40,parentIndex:31,name:"Pearle being",size:11290398,"sizeFmt":"10.8 MB",progress:67, priority: "High"},
				{index:41,parentIndex:31,name:"some folder",size:145949596,sizeFmt:"139 MB",progress:67, priority: "High"},
				{index:42,parentIndex:31,name:"101-blank_and_jones_featis..._mix)-nb.flac",size:1159065,sizeFmt:"1132 KB",progress:67, priority: "High"},
				{index:43,parentIndex:41,name:"102-stelly_m-summer_breeze-nbflac.flac",size:7749233,sizeFmt:"7568 KB",progress:67, priority: "High"},
				{index:44,parentIndex:41,name:"103-gelka_feat_phoenix_pearle-byou-nbflac",size:1179962,sizeFmt:"1152 KB",progress:67, priority: "High"},
				{index:45,parentIndex:41,name:"104-afterlife-suddenly-nbflac.flac",size:8582019,sizeFmt:"8381 KB",progress:67, priority: "High"},
				{index:46,parentIndex:41,name:"105-moya-lost_and_found_(no_l)-nbflac.flac",size:12461726,sizeFmt:"11.9 MB",progress:67, priority: "High"},
				{index:47,parentIndex:41,name:"106-the_ramona_fl_many_colours-nbflac.flac",size:1011736,sizeFmt:"988 KB",progress:67, priority: "High"},
				{index:48,parentIndex:41,name:"107-ashley_height-painkillers-nbflac.flac",size:8772201,sizeFmt:"8567 KB",progress:67, priority: "High"},
				{index:49,parentIndex:40,name:"ben_onono-small_world-nbflac.flac",size:763062,"sizeFmt":"745 KB",progress:67, priority: "High"},
				{index:50,parentIndex:41,name:"107-ashley_height-painkillers-nbflac.flac",size:8772201,sizeFmt:"8567 KB",progress:67},
				{index:51,parentIndex:40,name:"ben_onono-small_world-nbflac.flac",size:763062,"sizeFmt":"745 KB",progress:67},
				{index:52,parentIndex:0,name:"Pearle being",size:11290398,"sizeFmt":"10.8 MB"},
/**
				{index: 0, isChecked: true, name: "Orkestr.Savoy-Collectoin.mp3.320kbps", parentIndex: -1, priority: "", progress: -1, size: 455032192},
				{index: 1, isChecked: true, name: "Гербарий", parentIndex: 0, priority: "", progress: -1, size: 145949596},
				{index: 2, isChecked: true, name: "01 стих Весна.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 1048464}, // unusual size
				{index: 3, isChecked: true, name: "02 Гандоны.mp3", parentIndex: 1, priority: "Skip", progress: 0, size: 7749233},
				{index: 4, isChecked: true, name: "03 стих Лето.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 1179962},
				{index: 5, isChecked: true, name: "04 Кудрявый.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 8582019},
				{index: 6, isChecked: true, name: "05 Злая баба.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 12461726},
				{index: 7, isChecked: true, name: "06 стих Мой сон.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 1011736},
				{index: 8, isChecked: true, name: "07 Очень добрая песня.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 8772201},
				{index: 9, isChecked: true, name: "08 скороговорка Бодибилдинг.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 763062},
				{index: 10, isChecked: true, name: "09 Культуризм.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 8042851},
				{index: 11, isChecked: true, name: "10 Долбоёбы.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 6062771},
				{index: 12, isChecked: true, name: "11 стих Грязный тип.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 1241621},
				{index: 13, isChecked: true, name: "12 Шарманщик.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 11290398},
				{index: 14, isChecked: true, name: "13 стих Белая горячка.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 3798490},
				{index: 15, isChecked: true, name: "14 Семейная.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 9594527},
				{index: 16, isChecked: true, name: "15 стих Осень.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 1138168},
				{index: 17, isChecked: true, name: "16 Упаду.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 10755405},
				{index: 18, isChecked: true, name: "17 Шхуна.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 13450197},
				{index: 19, isChecked: true, name: "18 стих Бубубля.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 3472474},
				{index: 20, isChecked: true, name: "19 Полюса.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 11714622},
				{index: 21, isChecked: true, name: "20 стих Зима.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 904111},
				{index: 22, isChecked: true, name: "21 Виселица.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 10072044},
				{index: 23, isChecked: true, name: "22 Для февраля.mp3", parentIndex: 1, priority: "Normal", progress: 0, size: 12632049},
				{index: 24, isChecked: true, name: "cover.jpg", parentIndex: 1, priority: "Normal", progress: 0, size: 100864},
				{index: 25, isChecked: true, name: "Конъцертъ", parentIndex: 0, priority: "", progress: -1, size: 151943016},
				{index: 26, isChecked: false, name: "01 История.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 6470690},
				{index: 27, isChecked: false, name: "02 Паравоз.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 7490384},
				{index: 28, isChecked: false, name: "03 Ветерок.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 7630053},
				{index: 29, isChecked: false, name: "04 Гав-гав.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 6167197},
				{index: 30, isChecked: false, name: "05 До станции.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 9557082},
				{index: 31, isChecked: false, name: "06 Багрово бардовым.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 9412174},
				{index: 32, isChecked: false, name: "07 Машина.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 7223644},
				{index: 33, isChecked: false, name: "08 Четушечка.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 8388265},
				{index: 34, isChecked: false, name: "09 Танго.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 10918065},
				{index: 35, isChecked: false, name: "10 МВД.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 9665236},
				{index: 36, isChecked: false, name: "11 План нападения.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 7010482},
				{index: 37, isChecked: false, name: "12 Синичка.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 11981872},
				{index: 38, isChecked: false, name: "13 Шарик.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 12697018},
				{index: 39, isChecked: false, name: "14 Сон.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 9928823},
				{index: 40, isChecked: false, name: "15 Настойка валерианы.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 10206092},
				{index: 41, isChecked: false, name: "16 Матвиенко Тимофей.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 7953522},
				{index: 42, isChecked: false, name: "17 Я дирижёр.mp3", parentIndex: 25, priority: "Skip", progress: 0, size: 9167477},
				{index: 43, isChecked: false, name: "cover.jpg", parentIndex: 25, priority: "Skip", progress: 0, size: 74940},
				{index: 44, isChecked: true, name: "Оранжерея", parentIndex: 0, priority: "", progress: -1, size: 53570340},
				{index: 45, isChecked: false, name: "01 Песенка спирта.mp3", parentIndex: 44, priority: "Skip", progress: 0, size: 6496065},
				{index: 46, isChecked: false, name: "02 Гиппопотамы.mp3", parentIndex: 44, priority: "Skip", progress: 0, size: 8365324},
				{index: 47, isChecked: false, name: "03 Моряки.mp3", parentIndex: 44, priority: "Skip", progress: 0, size: 5383804},
				{index: 48, isChecked: false, name: "04 Мотоцикл.mp3", parentIndex: 44, priority: "Skip", progress: 0, size: 9088870},
				{index: 49, isChecked: false, name: "05 Песенка о здоровом образе жизни.mp3", parentIndex: 44, priority: "Skip", progress: 0, size: 7445434},
				{index: 50, isChecked: false, name: "06 Садомазохист.mp3", parentIndex: 44, priority: "Skip", progress: 0, size: 9697964},
				{index: 51, isChecked: false, name: "07 Пиджак.mp3", parentIndex: 44, priority: "Skip", progress: 0, size: 6984368},
				{index: 52, isChecked: false, name: "cover.jpg", parentIndex: 44, priority: "Skip", progress: 0, size: 108511},
				{index: 53, isChecked: true, name: "Плотниково", parentIndex: 0, priority: "", progress: -1, size: 103569240},
				{index: 54, isChecked: false, name: "01 Ать-два!.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 10333650},
				{index: 55, isChecked: false, name: "02 Банда.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 5893727},
				{index: 56, isChecked: false, name: "03 Его мысли.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 5263661},
				{index: 57, isChecked: false, name: "04 Развоенный.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 4821562},
				{index: 58, isChecked: false, name: "05 С бодуна.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 5796071},
				{index: 59, isChecked: false, name: "06 Самолёты.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 9823291},
				{index: 60, isChecked: false, name: "07 Шулаков.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 11004677},
				{index: 61, isChecked: false, name: "08 Трамвай.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 9933552},
				{index: 62, isChecked: false, name: "09 У универмага.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 9318190},
				{index: 63, isChecked: false, name: "10 Весна.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 7884761},
				{index: 64, isChecked: false, name: "11 ВМФ.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 8724855},
				{index: 65, isChecked: false, name: "12 Завтра.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 6197216},
				{index: 66, isChecked: false, name: "13 Звезда.mp3", parentIndex: 53, priority: "Skip", progress: 0, size: 8500135},
				{index: 67, isChecked: false, name: "cover.jpg", parentIndex: 53, priority: "Skip", progress: 0, size: 73892},
				{index: 68, isChecked: true, name: "Плотниково2", parentIndex: 53, priority: "", progress: -1, size: 103569240},
				{index: 69, isChecked: false, name: "07 Шулаков.mp3", parentIndex: 68, priority: "Skip", progress: 0, size: 11004677},
				{index: 70, isChecked: false, name: "08 Трамвай.mp3", parentIndex: 68, priority: "Skip", progress: 0, size: 9933552},
				{index: 71, isChecked: false, name: "09 У универмага.mp3", parentIndex: 68, priority: "Skip", progress: 0, size: 9318190},
				{index: 72, isChecked: false, name: "10 Весна.mp3", parentIndex: 68, priority: "Skip", progress: 0, size: 7884761},
				{index: 73, isChecked: false, name: "11 ВМФ.mp3", parentIndex: 68, priority: "Skip", progress: 0, size: 8724855},
				{index: 74, isChecked: false, name: "12 Завтра.mp3", parentIndex: 68, priority: "Skip", progress: 0, size: 6197216},
				{index: 75, isChecked: false, name: "13 Звезда.mp3", parentIndex: 68, priority: "Skip", progress: 0, size: 8500135},
				{index: 76, isChecked: false, name: "cover.jpg", parentIndex: 68, priority: "Skip", progress: 0, size: 73892},
				{index: 77, isChecked: true, name: "Плотниково3", parentIndex: 68, priority: "", progress: -1, size: 103569240},
				{index: 78, isChecked: false, name: "07 Шулаков.mp3", parentIndex: 77, priority: "Skip", progress: 0, size: 11004677},
				{index: 79, isChecked: false, name: "08 Трамвай.mp3", parentIndex: 77, priority: "Skip", progress: 0, size: 9933552},
				{index: 80, isChecked: false, name: "09 У универмага.mp3", parentIndex: 77, priority: "Skip", progress: 0, size: 9318190},

				{index: 81, isChecked: true, name: "01 стих Весна.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 1048464}, // unusual size
				{index: 82, isChecked: true, name: "02 Гандоны.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 7749233},
				{index: 83, isChecked: true, name: "03 стих Лето.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 1179962},
				{index: 84, isChecked: true, name: "04 Кудрявый.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 8582019},
				{index: 85, isChecked: true, name: "05 Злая баба.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 12461726},
				{index: 86, isChecked: true, name: "06 стих Мой сон.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 1011736},
				{index: 87, isChecked: true, name: "07 Очень добрая песня.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 8772201},
				{index: 88, isChecked: true, name: "08 скороговорка Бодибилдинг.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 763062},
				{index: 89, isChecked: true, name: "09 Культуризм.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 8042851},
				{index: 90, isChecked: true, name: "10 Долбоёбы.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 6062771},
				{index: 91, isChecked: true, name: "11 стих Грязный тип.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 1241621},
				{index: 92, isChecked: true, name: "12 Шарманщик.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 11290398},
				{index: 93, isChecked: true, name: "13 стих Белая горячка.mp3", parentIndex: 0, priority: "Normal", progress: 0, size: 3798490},

				{index: 94, isChecked: true, name: "Гербарий", parentIndex: -1, priority: "", progress: -1, size: 145949596},
				{index: 95, isChecked: true, name: "01 стих Весна.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 1048464}, // unusual size
				{index: 97, isChecked: true, name: "03 стих Лето.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 1179962},
				{index: 98, isChecked: true, name: "04 Кудрявый.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 8582019},
				{index: 99, isChecked: true, name: "05 Злая баба.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 12461726},
				{index: 100, isChecked: true, name: "03 стих Лето.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 1179962},
				{index: 101, isChecked: true, name: "04 Кудрявый.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 8582019},
				{index: 102, isChecked: true, name: "05 Злая баба.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 12461726},
				{index: 103, isChecked: true, name: "04 Кудрявый.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 8582019},
				{index: 104, isChecked: true, name: "05 Злая баба.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 12461726},
				{index: 105, isChecked: true, name: "03 стих Лето.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 1179962},
				{index: 106, isChecked: true, name: "04 Кудрявый.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 8582019},
				{index: 107, isChecked: true, name: "05 Злая баба.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 12461726},
				{index: 108, isChecked: true, name: "04 Кудрявый.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 8582019},
				{index: 109, isChecked: true, name: "05 Злая баба.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 12461726},
				{index: 110, isChecked: true, name: "03 стих Лето.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 1179962},
				{index: 111, isChecked: true, name: "04 Кудрявый.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 8582019},
				{index: 112, isChecked: true, name: "05 Злая баба.mp3", parentIndex: -1, priority: "Normal", progress: 0, size: 12461726}
*/
			],
			//__static_files__: [
			//	{index: 0, isChecked: true, name: "Orkestr.Savoy-Collectoin.mp3.320kbps", parentIndex: -1, priority: "", progress: -1, size: 455032192},
			//	{index: 1, isChecked: true, name: "mp3.320kbps", parentIndex: -1, priority: "", progress: -1, size: 45503},
			//],
			requestDownloadInfo: function(url, username, password, downloadType, baseInfoGotFn, successFn, failFn) {
				//console.log("window.fdmAppFakes.newDownload.requestDownloadInfo: %o", arguments);

				var fileInfo = {
					name: "some_file.name.some_file.name.some_file.name.some_file.name.some_file.name.some_file.name.some_file.name" +
					"some_file.name.some_file.name.some_file.name some_file.name.some_file.name.some_file.name",
					rootPath: "C:\\Downloads\\Music\\some_file.name",
					size: 654711473,
					dateFmt: "7 minutes 11 seconds",
					// files: (fdm.fileUtils.fileListToFileTree(window.fdmAppFakes.downloadWizard.__static_files__)),
					//filesCount: window.fdmAppFakes.downloadWizard.__static_files__.length,
					// files: window.fdmAppFakes.downloadWizard.__static_urls__,
					filesCount: window.fdmAppFakes.downloadWizard.__static_urls__.length,
					lastFolders: window.fdmAppFakes.downloadWizard.getLastFolders(),
					type: fdm.models.DownloadType.Regular,
					autoDetectedFolder: "C:\\Downloads\\Music\\",
                    suggestEquivalent: 4
				};
				
				var id = window.fdmAppFakes.downloads.__static_items__.length + 1;

				fileInfo = JSON.stringify(fileInfo);


				_.delay(
					function(){
						fakes.MessageCallback("downloadWizard.onRequestDownloadInfoSuccess", id, fileInfo);
						//fakes.MessageCallback("downloadWizard.addListLinks", id, fileInfo);
					},
					100
				);
				
				//_.delay(successFn, 1500, 12, fileInfo);
				
				return id;
			},

			createDownload: function(id, url, targetFolder, fileName, tags, selectedIds) {
				console.log("createDownload: %o", arguments);

					var download = _.clone(window.fdmAppFakes.downloads.__static_items__[0]);
					download.url = url;
					download.domain = url;
					download.fileName = fileName;
					download.rootPath = targetFolder + "/" + fileName;
					download.outputFilePath = targetFolder + "/" + fileName;
					download.createdDate = new Date();
					download.state = 2;
					download.filesCount = window.fdmAppFakes.downloadWizard.__static_files__.length;
					
					window.fdmAppFakes.downloads._addDownload(download);
					id = window.fdmAppFakes.downloads.__static_items__.length;

					download.suggestEquivalent = 4;
					download = JSON.stringify(download);
					fakes.MessageCallback("downloadWizard.onRequestDownloadInfoSuccess", id, download);
					
					fakes.MessageCallback("downloadWizard.onCreateDownloadSuccess");
			},

			downloadListLinks: function(id, targetFolder, selectedIds) {
				console.log("createDownload: %o", arguments);

					var download = _.clone(window.fdmAppFakes.downloads.__static_items__[0]);
					download.url = url;
					download.domain = url;
					download.fileName = fileName;
					download.rootPath = targetFolder + "/" + fileName;
					download.outputFilePath = targetFolder + "/" + fileName;
					download.createdDate = new Date();
					download.state = 2;
					download.filesCount = window.fdmAppFakes.downloadWizard.__static_files__.length;

					window.fdmAppFakes.downloads._addDownload(download);
					id = window.fdmAppFakes.downloads.__static_items__.length;

                	download.suggestEquivalent = 4;
					download = JSON.stringify(download);
					fakes.MessageCallback("downloadWizard.onRequestDownloadInfoSuccess", id, download);

					fakes.MessageCallback("downloadWizard.onCreateDownloadSuccess");
			},

			cancelCreation: function(url) {
			},

			_lastFolders: ["C:\\Downloads", "C:\\Downloads\\Software", "C:\\Downloads\\Video", "C:\\Downloads\\Software\\1111", "C:\\Downloads\\Video\\111", "C:\\Downloads\\Video\\222",
							"C:\\Downloads\\Software\\222", "C:\\Downloads\\Video\\333", "C:\\Downloads\\Video\\444", "C:\\Downloads\\Software\\333", "C:\\Downloads\\Video\\555",
							"C:\\Downloads\\Video", "C:\\Downloads\\Software", "C:\\Downloads\\Video", "C:\\Downloads\\Video", "C:\\Downloads\\Software", "C:\\Downloads\\Video",
							"C:\\Downloads\\Video", "C:\\Downloads\\Software", "C:\\Downloads\\Video", "C:\\Downloads\\Video", "C:\\Downloads\\Software", "C:\\Downloads\\Video",
							"C:\\Downloads\\Video", "C:\\Downloads\\Software", "C:\\Downloads\\Video", "C:\\Downloads\\Video", "C:\\Downloads\\Software", "C:\\Downloads\\Video" ],
			getLastFolders: function(){
				return window.fdmAppFakes.downloadWizard._lastFolders;
			},

			getFolderForDownloadType: function(downloadType){
				switch (downloadType){
					case fdm.models.DownloadType.Regular:
						return "C:\\Downloads\\Regular";
					case fdm.models.DownloadType.Trt:
						return "C:\\Downloads\\Torrents";
					case fdm.models.DownloadType.TransferProtocol:
						return "C:\\Downloads\\";
					case fdm.models.DownloadType.YouTubeVideo:
						return "C:\\Downloads\\Video";
					case fdm.models.DownloadType.File:
						return "C:\\Downloads\\";
					case fdm.models.DownloadType.FlashVideo:
						return "C:\\Downloads\\FlashVideo";
				}
				return "C:\\Downloads\\";
			},

            calcSizeOnDiskForSelection: function(){

                return 1212312321;
            },
		};
	}

	function populateSystem() {
		if (window.fdmAppFakes.system) {
			return;
		}
		window.fdmAppFakes.system = {
			openFileDialog: function(filters) {
				return prompt("You choose following file:", "c:\\[rutracker.org].t4461878.torrent");
			},
			openFolderDialog: function(folder, type) {
				var n_folder = prompt("You choose following folder:", folder || "c:\\Downloads\\");
				fakes.MessageCallback("system.openFolderCallback", n_folder, type);
			},
			screenDensityFactor: function() {
				return 1;
			},
			calcDiskFreeSpace: function(currentFolder) {
				return 2000000;
			},
			generateFilePreview: function(source, id, width, height, progress, priority, force, callback) {
				//console.log("generateFilePreview: %o", arguments);
				var imagePath = "folder.png";
				if(width == 24) { // 24x24 icon is requested for multiple-file download (e.g. torrent)
					imagePath = "file.png";
				}
				fakes.MessageCallback("system.onThumbnailGenerated", source, id, imagePath, width, height, force);

			},
			generateBorderlessFilePreview: function(idOrOutputFilePath, maxWidth, maxHeight, progress, priority, force, callback) {
				//console.log("generateBorderlessFilePreview: %o", arguments);
				var imagePath = "folder.png";

				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');
				var imageObj = new Image();

				var id = -1;
				var outputFilePath = "";
				if(_.isNumber(idOrOutputFilePath)){
					id = idOrOutputFilePath;
				}
				else{
					outputFilePath = idOrOutputFilePath;
				}

				imageObj.onload = function() {
					canvas.width = maxWidth;
					canvas.height = maxHeight;
					context.drawImage(imageObj, 0, 0, maxWidth, maxHeight);
					var result = canvas.toDataURL();
//					_.delay(fdm.Events.onMessage, _.random(500, 2000), messageId, imagePath + "?t="+Date.now(), maxWidth, maxHeight);
					_.delay(callback, _.random(500, 2000), result, maxWidth, maxHeight, id);
				};
				imageObj.src = imagePath;
			},
			getDefaultTargetFolder: function() {
				return "C:\\Users\\user\\Downloads";
			},
			getFileKind: function(path) {
				return "Unknown JPEG image";
			},
			getFileModifiedDate: function(path) {
				return moment().subtract({'days' : getRandom(0, 50)}).toDate();
			},
			getFileLastAccessDate: function(path) {
				return moment().subtract({'days' : getRandom(0, 50)}).toDate();
			},
			getClipboardText: function(){
				return "http://some_clipboard_text.com"
			},
			validateFolder: function(folderPath, fileName, resultFn){
				if(folderPath == ""){
					return [false, "Target path cannot be empty."];
					//resultFn(false, "Target path cannot be empty.");
					
				}
				if(folderPath.toLowerCase().indexOf("a:") == 0){
					//resultFn(false, "Target drive is not available.");
					return [false, "Target drive is not available."];
				}
				//resultFn(true);
				return [true, ""];
			},
			messageBox: function(title, text, type){
				alert(title + "\n\n" +text);
			},
			prompt: function(title, text, value){
				prompt(title + "\n\n" +text, value);
			},
			getMaximumAllowedFileSize: function(){
				return 1234567;
			}
		};
	}

	function populateMenu() {
		if (window.fdmAppFakes.menuManager) {
			return;
		}
		window.fdmAppFakes.menuManager = {
			onAddDownload: function() {},
			onShowSettings: function() {},
			onOpenTorrentFile: function() {}
		};
	}

	function populateUpdater() {
		if (window.fdmAppFakes.updater) {
			return;
		}
		window.fdmAppFakes.updater = {

			s:{
				getStage: 0,
				getState: 0,
				updatesAvailable: 0,
				getRestartRequired: 0,
				getPreInstallCheckFailureReason: 0
			},

			next: function() {

				if (fdmAppFakes.updater.s.getState <= fdm.models.UpdaterStates.in_progress){
					fdmAppFakes.updater.s.getState++;
				}
				else if (fdmAppFakes.updater.s.getState == fdm.models.UpdaterStates.failed){
					if (fdmAppFakes.updater.s.getStage == fdm.models.UpdaterStages.pre_install_check){
						if (!fdmAppFakes.updater.s.getPreInstallCheckFailureReason){
							fdmAppFakes.updater.s.getPreInstallCheckFailureReason++;
						}
						else {
							fdmAppFakes.updater.s.getPreInstallCheckFailureReason = 0;
							fdmAppFakes.updater.s.getState++;
						}
					}
					else{
						fdmAppFakes.updater.s.getState++;
					}
				}
				else if (fdmAppFakes.updater.s.getState == fdm.models.UpdaterStates.finished){
					if (fdmAppFakes.updater.s.getState == fdm.models.UpdaterStages.check_updates){
						if (!fdmAppFakes.updater.s.updatesAvailable){
							fdmAppFakes.updater.s.updatesAvailable++;
						}
						else {
							fdmAppFakes.updater.s.updatesAvailable = 0;
							fdmAppFakes.updater.s.getState = 0;
							fdmAppFakes.updater.s.getStage++;
						}

					}
					else if (fdmAppFakes.updater.s.getState == fdm.models.UpdaterStages.install_updates){
						if (fdmAppFakes.updater.s.getRestartRequired < fdm.models.UpdaterRestartType.os){
							fdmAppFakes.updater.s.getRestartRequired++;
						}
						else {
							fdmAppFakes.updater.s.getRestartRequired = 0;
							fdmAppFakes.updater.s.getState = 0;
							fdmAppFakes.updater.s.getStage = 0;
						}

					}
					else{
						fdmAppFakes.updater.s.getState = 0;
						fdmAppFakes.updater.s.getStage++;
					}
				}


				app.controllers.updater.onItemChanged(0);

			},


			getStage: function() {

				return fdmAppFakes.updater.s.getStage;
			},
			getState: function() {

				return fdmAppFakes.updater.s.getState;
			},
			getProgress: function() {

				var max = _.random(0, 100);
				var current = _.random(0, max);

				return {current:current, max:max};
			},
			updatesAvailable: function() {

				return fdmAppFakes.updater.s.updatesAvailable;
			},
			getRestartRequired: function() {

				return fdmAppFakes.updater.s.getRestartRequired;
			},
			getPreInstallCheckFailureReason: function() {

				return fdmAppFakes.updater.s.getPreInstallCheckFailureReason;
			}

		};
	}

	function populateLocalization() {
		if (window.fdmAppFakes.localization) {
			return;
		}
		window.fdmAppFakes.localization = {

			tr: function(string, context, number) {

				var regN = new RegExp("%n", "gm");
				return string.replace(regN, number);
			},
			installedTranslations: function(){

				return ["da", "de", "el", "es", "fr", "it", "nl", "pl", "pt", "ro", "ru", "sv", "zh", "en", "ja", "ar"];
			},
			systemLocale: function(){

				return "en";
			},
			getAllStrings: function(l){

				var s = FakesStrings.strings[l];
				if (!s)
					return {};

				var r = {};

				_.each(s, function(v, k){

					r[k.replace('RPCLocalization|', '')] = v[1];
				});

				return r;

			}
		};
	}

	function populateSharer() {
		if (window.fdmAppFakes.sharer) {
			return;
		}
		window.fdmAppFakes.sharer = {

            showShareDialog: function(){

            	return true;
			}
		};
	}

	function populateAppInfo() {
		if (window.fdmAppFakes.appInfo) {
			return;
		}
		window.fdmAppFakes.appInfo = {

            featureDisabled: function(){

            	return true;
			}
		};
	}

	function populateSettings() {
		if (window.fdmAppFakes.settings) {
			return;
		}
		window.fdmAppFakes.settings = {
			getAgentsToIdentity: function() {
				return [
					{ id: 0, text: "Free Download Manager" },
					{ id: 1, text: "Microsoft Internet Explorer" },
					{ id: 2, text: "Netscape Communicator" },
					{ id: 3, text: "Opera" }
				];
			},
			clearFolderHistory: function() {
				window.fdmAppFakes.downloadWizard._lastFolders = [];
				alert("History of folders is clean.");
			},
			clearDownloadHistory: function() {
				alert("History of downloads is clean.");
			},
			getAntiViruses: function() {
				return [
					{ id: 0, name: "Avira Antivirus", args: "/GUIMODE=1 /PATH=%file%" },
					{ id: 1, name: "NOD32", args: "%file%" },
					{ id: 2, name: "Kaspersky", args: "%file% /silent /wait /minimize" },
					{ id: 3, name: "McAfee", args: "/nomem /all %file%" }
				];
			},
			getLocales: function() {
				return [
					{ value: "en", text: "English (United States)" },
					{ value: "ru", text: "Russian (Russia)" }
				];
			},
            onDialogInit: function() {
                console.log("Settings shown");
            },
            onDialogApply: function() {
                console.log("Settings applied");
            },
			checkAntivirusPathSettings: function() {
                return true;
            },
			checkAntivirusCustomArgSettings: function() {
                return true;
            },
			checkAntivirusExtSettings: function() {
				return true;
			},
			setConnectionTrafficLimit: function(enabled, value, unit, isDownload){
				if(isDownload){
					this["connection-traffic-limit-enabled"] = enabled;
					this["connection-traffic-limit-value"] = value;
					this["connection-traffic-limit-unit"] = unit;
				}
				else{
					this["connection-traffic-limit-upload-enabled"] = enabled;
					this["connection-traffic-limit-upload-value"] = value;
					this["connection-traffic-limit-upload-unit"] = unit;
				}
			},

			checkDefaultTorrentClient: function(){

				return false;
			},

			"check-default-torrent-client-at-startup": true,

            "general-load-on-startup": true,
			"general-update-behaviour": fdm.models.UpdateBehaviour.Notify,
			"new-download-default-folder-source": 1,

			// General -> Monitoring
			"monitoring-ie-enabled": false,
			"monitoring-ff-enabled": true,
			"monitoring-chrome-enabled": true,
			"monitoring-opera-enabled": false,
			"monitoring-safari-enabled": false,
			"monitoring-alt-pressed": false,
			"monitoring-allow-download": true,
			"monitoring-skip-smaller-enabled": true,
			"monitoring-skip-smaller-value": 1000,
			"monitoring-skip-extensions-enabled": true,
			"monitoring-skip-extensions-value": 'pls m3u',
			"monitoring-add-to-menu": true,
			"monitoring-menu-this": true,
			"monitoring-menu-page": true,
			"monitoring-menu-all": false,
			"monitoring-menu-selected": true,
			"monitoring-menu-video": true,
			"monitoring-silent": false,

			// General -> Notifications
			"notifications-balloon-enabled": true,
			"notifications-balloon-timeout": 2,
			"notifications-popup-on-finish-enabled": true,
			"notifications-popup-autohiding-on-finish-enabled": true,
			"notifications-popup-autohiding-on-finish-timeout": 1,
			"notifications-disabled-for-batch": true,
			"notifications-show-tips": true,

			// General -> History
			"folder-history-enabled": true,
			"folder-history-keep-records-enabled": true,
			"folder-history-keep-records-value": 3,
			"folder-history-max-records-enabled": true,
			"folder-history-max-records-value": 10,
			"download-history-enabled": true,
			"download-history-keep-records-enabled": true,
			"download-history-keep-records-value": 0,
			"download-history-completed-only": true,

			"confirmation-timeout-hang-up": 5,
			"confirmation-timeout-exit": 15,
			"confirmation-timeout-shutdown": fdm.constants.UINT_MAX,
			"confirmation-timeout-launch-download": 60,

			"target-folder-is-user-defined": true,
			"target-folder-user-defined-value": "C:\\Downloads",
			"auto-save-interval": 5, // minutes

			// General -> Languages
			"locale-value": "en",
			
			// Appearance -> Floating windows
			"floating-window-drop-box-enabled": true,
			"floating-window-drop-box-transparency": 70,
			"floating-window-extra-info-enabled": true,
			"floating-window-extra-info-transparency": 50,
			"floating-window-hide-in-fullscreen": true,

			// Downloads -> Essential
			"downloads-logs-disabled": false,
			"downloads-auto-delete-completed": false,
			"downloads-delete-uncompleted-reaction": fdm.models.DeleteDownloadReaction.Delete,
			"downloads-detailed-log-enabled": true,
			"downloads-show-progress-window": true,
			"downloads-sizes-in-bytes": false,
			"file-cache-writing-enabled": false,
			"file-cache-writing-size": 5,
			"downloads-prevent-standing": true,

			"virus-check-enabled": false,
			"virus-check-predefined-app-enabled": false,
			"virus-check-predefined-app-value": 2,
			"virus-check-custom-app-path": "",
			"virus-check-custom-app-args": "%file%",
			"virus-check-file-extensions": "exe com bat msi zip",

			"downloads-time-limits-enabled": false,
			"downloads-time-limits-begin": 0,
			"downloads-time-limits-end": 0,


			// Network -> speed-mode
			"tum-low-restriction-absolute": 64 * 1024, // 100Kb/s
			"tum-low-restriction-percentage": 10,
			"tum-low-restriction-type": 1, // absolute
			"tum-low-upload-restriction": 64 * 1024,
			//"tum-low-max-connections-auto": false,
			"tum-low-max-connections-value": 4,
			//"tum-low-max-connections-per-server-auto": false,
			//"tum-low-max-connections-per-server-value": 2,
			//"tum-low-max-tasks-auto": false,
			"tum-low-max-tasks-value": 10,

			"tum-medium-restriction-absolute": 1024 * 1024, // 1Mb/s
			"tum-medium-restriction-percentage": 100,
			"tum-medium-restriction-type": 0, // unlimited
			"tum-medium-upload-restriction": 128 * 1024, // 100Kb/s
			//"tum-medium-max-connections-auto": false,
			"tum-medium-max-connections-value": 8,
			//"tum-medium-max-connections-per-server-auto": false,
			//"tum-medium-max-connections-per-server-value": 4,
			//"tum-medium-max-tasks-auto": false,
			"tum-medium-max-tasks-value": 15,

			"tum-high-restriction-absolute": 10 * 1024 * 1024, // 1Mb/s
			"tum-high-restriction-percentage": 100,
			"tum-high-restriction-type": 0, // unlimited
			"tum-high-upload-restriction": -1,
			//"tum-high-max-connections-auto": false,
			"tum-high-max-connections-value": 16,
			//"tum-high-max-connections-per-server-auto": false,
			//"tum-high-max-connections-per-server-value": 8,
			//"tum-high-max-tasks-auto": false,
			"tum-high-max-tasks-value": 20,

			"speed-mode-browser-activity-manage-enabled": true,
			"speed-mode-browser-activity-manage-value": 2,

			// Network -> bittorrent
			"bittorrent-enable-dht": true,
			"bittorrent-enable-local-peer-discovery": true,
			"bittorrent-enable-upnp": true,
			"bittorrent-enable-nat-pmp": true,
			"bittorrent-enable-utpex": false,
			"bittorrent-limit-local-traffic": false,

			// Network -> New Download -> Connection
			"connection-attempt-pause": 3,
			"connection-max-attempts-enabled": true,
			"connection-max-attempts-value": 10,
			"connection-timeout": 5,
			"connection-section-restart-if-low-speed-enabled": true,
			"connection-section-restart-if-low-speed-value": 12,
			"connection-traffic-limit-enabled": true,
			"connection-traffic-limit-value": 1,
			"connection-traffic-limit-unit": 2,//mb
			"connection-traffic-limit-upload-enabled": true,
			"connection-traffic-limit-upload-value": 300,
			"connection-traffic-limit-upload-unit": 1,//kb
			"connection-ignore-all-restrictions": true,

			// Network -> New Download -> Protocol
			"new-download-browser-agent": 1,
			"new-download-referer": "",
			"new-download-http11-enabled": true,
			"new-download-cookies-enabled": true,
			"new-download-ftp-passive-mode-enabled": true,
			"new-download-ftp-file-date-retrieving-disabled": false,
			"new-download-ftp-transfer-mode": 1,
			"new-download-ftp-transfer-mode-ascii-extensions": "txt htm html",

			// Network -> New Download -> Proxy
			"proxy-settings-source": 2,
			"proxy-http-settings-address": "http.com",
			"proxy-http-settings-port": "80",
			"proxy-http-settings-login-required": true,
			"proxy-http-settings-login-name": "",
			"proxy-http-settings-login-password": "",
			"proxy-https-settings-address": "https.com",
			"proxy-https-settings-port": "47",
			"proxy-https-settings-login-required": true,
			"proxy-https-settings-login-name": "https-user",
			"proxy-https-settings-login-password": "https-password",
			"proxy-ftp-settings-address": "ftp.com",
			"proxy-ftp-settings-port": "221",
			"proxy-ftp-settings-login-required": true,
			"proxy-ftp-settings-login-name": "ftp-user",
			"proxy-ftp-settings-login-password": "ftp-password",

			"new-download-proxy-settings-error-rollback": true,
			"new-download-proxy-settings-error-rollback-bytes": 3000,

			// Network -> New Download -> Integrity
			"integrity-check-enabled": true,
			"integrity-check-action": 1,

			// Network -> New Download -> Miscellaneous
			"file-already-exists-action": 1,
			"file-already-exists-rename-at-restart": false,
			"reserve-disk-downloading-file-space": true,
			"retrieve-file-date-from-server": true,
			"uncompleted-file-extension-enabled": false,
			"uncompleted-file-extension-value": "",
			"hide-uncompleted-file": false,
			"create-file-extension-enabled": false,
			"create-file-extension-value": "bin",
			"append-comment-to-completed-file": false,
			"run-completed-file": false,
			"generate-file-description": true,

			"restart-disabled-if-server-resume-unsupported": true,
			"server-file-size-changed-action": 2,
			"stop-on-file-not-found": true,
			"stop-on-access-denied": true,
			"check-updates-interval": 60*60*24,
			"shutdown-when-done": true,
			"prevent-sleep-action": 1,
            "monitoring-alt-pressed-behaviour": 1
		};
	}


	function populateApp() {
		if (window.fdmAppFakes) {
			// fdm fake global object is initialized
			return;
		}
		if(false && window.external && window.external.addMessageCallback) {
			return;
		}
		window.fdmAppFakes = {
			isFake: true,
			start: function() {
				console.log("The Application is started.");
				window.fdmAppFakes.downloads._fetch();
			},
			speedMode: function(){
				return fdm.models.NetworkSpeedMode.High;
			},
			
			getLocaleText: function(value){return value;},
			onFocusLost: function(){},
			onClose: function(){},
			readViewState: function(){
				var sessionState = sessionStorage.getItem("viewState");

				var ss = false;

				try {
					ss = JSON.parse(sessionState);
				}
				catch (e) {}

				if(ss){
					return ss;
				}
				// return default state
				return {
					version: 1,
					tagsPanel: {
						visible: true,
						expanded: true,
						selectedTagId: null
					},
					downloads: {
						sort: {
							modelProp: "fileName",//"createdDate",
							descending: true
						}
					},
					bottomPanel: {
						height: fdm.viewModels.BottomPanel_MinHeight,
						visible: true,
						tabs: [{
							id: fdm.views.BottomPanelTab.General,
							columns: []
						},{
							id: fdm.views.BottomPanelTab.Files,
							columns: [
								{id: ".file-name", width: 400},
								{id: ".file-size", width: 120},
								{id: ".file-progress", width: 197},
								{id: ".file-priority", width: 151}
							]
						},{
							id: fdm.views.BottomPanelTab.Trackers,
							columns: [
								{id: ".tracker-name", width: 350},
								{id: ".tracker-status", width: 235},
								{id: ".tracker-update-in", width: 145}
							]
						},{
							id: fdm.views.BottomPanelTab.Peers,
							columns: [
								{id: ".peer-ip", width: 152},
								{id: ".peer-client", width: 136},
								{id: ".peer-flags", width: 99},
								{id: ".peer-percents", width: 50},
								{id: ".peer-down-speed", width: 101},
								{id: ".peer-up-speed", width: 101},
								{id: ".peer-reqs", width: 50},
								{id: ".peer-downloaded", width: 115},
								{id: ".peer-uploaded", width: 115}
							]
						},{
							id: fdm.views.BottomPanelTab.Log,
							columns: [
								{id: ".log-date", width: 103},
								{id: ".log-time", width: 70},
								{id: ".log-information", width: 400}
							]
						}]
					}
				};
			},
			writeViewState: function(vsString){
				sessionStorage.setItem("viewState", vsString);
			},
			_getMaxTasks: function(){
				var s = fdmAppFakes.settings;
				switch(fdmAppFakes.speedMode){
				case fdm.models.NetworkSpeedMode.Low:
					return s["tum-low-max-tasks-value"];
				case fdm.models.NetworkSpeedMode.Medium:
					return s["tum-medium-max-tasks-value"];
				case fdm.models.NetworkSpeedMode.High:
					return s["tum-high-max-tasks-value"];
				case fdm.models.NetworkSpeedMode.Custom:
					return 30;
				}
				return 10;
			},
			addMessageCallback: function(){}
		};
		$(window).unload(function (){
			if(window.fdmAppFakes.onClose)
				window.fdmAppFakes.onClose();
		});
	}
	
	function populateTags() {
		if (window.fdmAppFakes.tagManager) {
			return;
		}
		fdmAppFakes.tagManager = {
			__tags__: [
				{id:1, name: 'Torrent', system: true, colorR: 0, colorG: 177, colorB: 122},
				{id:2, name: 'YouTube', system: true, colorR: 232, colorG: 89, colorB: 89},
				{id:104, name: 'tag4', system: false, colorR: 255, colorG: 255, colorB: 215},
				{id:105, name: 'tag5', system: false, colorR: 20, colorG: 155, colorB: 225},
				{id:106, name: 'tag6', system: false, colorR: 30, colorG: 135, colorB: 205},
				{id:103, name: 'w_important', system: false, colorR: 180, colorG: 255, colorB: 0},
				{id:107, name: 'tag7', system: false, colorR: 40, colorG: 225, colorB: 105},
				{id:108, name: 'tag8', system: false, colorR: 50, colorG: 215, colorB: 155},
				{id:109, name: 'tag9', system: false, colorR: 60, colorG: 205, colorB: 55},
				{id:110, name: 'asdfasdf', system: false, colorR: 60, colorG: 205, colorB: 55},
				{id:111, name: 'asdfasdfasd', system: false, colorR: 60, colorG: 205, colorB: 55},
				{id:112, name: 'asdfasdfs', system: false, colorR: 60, colorG: 205, colorB: 55},
				{id:113, name: '1asdfasdfd', system: false, colorR: 60, colorG: 205, colorB: 55},
				{id:114, name: '2asdfasdfd', system: false, colorR: 60, colorG: 205, colorB: 55},
				{id:115, name: '3asdfasdfd', system: false, colorR: 60, colorG: 205, colorB: 55},
				{id:116, name: '4asdfasdfd', system: false, colorR: 60, colorG: 205, colorB: 55}
			],
			createTag: function(name, colorR, colorG, colorB){
				var resultId = fdmAppFakes.tagManager.__tags__.length + 105;
				fdmAppFakes.tagManager.__tags__.push({
					id: resultId,
					name: name,
					system: false,
					colorR: colorR,
					colorG: colorG,
					colorB: colorB
				});
				if(fdmAppFakes.tagManager.onTagsDialogChanged){
					fdmAppFakes.tagManager.onTagsDialogChanged();
				}
				if(fdmAppFakes.tagManager.onTagsChanged){
					fdmAppFakes.tagManager.onTagsChanged();
				}
				return resultId;
			},
			editTag: function(id, name, color){},
			deleteTag: function(id){},
			getAllTags: function () {
				return fdmAppFakes.tagManager.__tags__;
			},
			onTagsChanged: function(dldId){
				fakes.MessageCallback("tags.onTagsChanged", dldId);
			} // event
		};
	}
	
	function initFakeMap(){
		fakes.mapUrlToFakeFunction = {
			"http://api/start": fdmAppFakes.start,
			"http://api/getLocaleText": fdmAppFakes.getLocaleText,
			"http://api/readViewState": fdmAppFakes.readViewState,
			"http://api/writeViewState": fdmAppFakes.writeViewState,
			"http://api/onFocusLost": fdmAppFakes.onFocusLost,
			"http://api/onClose": fdmAppFakes.onClose,
			"http://api/speedMode": fdmAppFakes.speedMode,
			//"http://api/getReloadUITimeout": fdmAppFakes.getReloadUITimeout,
			
			"http://api/tags/createTag": fdmAppFakes.tagManager.createTag,
			"http://api/tags/editTag": fdmAppFakes.tagManager.editTag,
			"http://api/tags/deleteTag": fdmAppFakes.tagManager.deleteTag,
			"http://api/tags/getAllTags": fdmAppFakes.tagManager.getAllTags,
			
			"http://api/downloadWizard/requestDownloadInfo": fdmAppFakes.downloadWizard.requestDownloadInfo,
			"http://api/downloadWizard/createDownload": fdmAppFakes.downloadWizard.createDownload,
			"http://api/downloadWizard/cancelCreation": fdmAppFakes.downloadWizard.cancelCreation,
			"http://api/downloadWizard/getPreparedURL": fdmAppFakes.downloadWizard.getPreparedURL,
			"http://api/downloadWizard/getLastFolders": fdmAppFakes.downloadWizard.getLastFolders,
			"http://api/downloadWizard/getFolderForDownloadType": fdmAppFakes.downloadWizard.getFolderForDownloadType,
			"http://api/downloadWizard/calcSizeOnDiskForSelection": fdmAppFakes.downloadWizard.calcSizeOnDiskForSelection,

			"http://api/system/openFileDialog": fdmAppFakes.system.openFileDialog,
			"http://api/system/openFolderDialog": fdmAppFakes.system.openFolderDialog,
			"http://api/system/calcDiskFreeSpace": fdmAppFakes.system.calcDiskFreeSpace,
			"http://api/system/getMaximumAllowedFileSize": fdmAppFakes.system.getMaximumAllowedFileSize,
			"http://api/system/generateFilePreview": fdmAppFakes.system.generateFilePreview,
			"http://api/system/generateBorderlessFilePreview": fdmAppFakes.system.generateBorderlessFilePreview,
			"http://api/system/getDefaultTargetFolder": fdmAppFakes.system.getDefaultTargetFolder,
			"http://api/system/getFileKind": fdmAppFakes.system.getFileKind,
			"http://api/system/getFileModifiedDate": fdmAppFakes.system.getFileModifiedDate,
			"http://api/system/getFileLastAccessDate": fdmAppFakes.system.getFileLastAccessDate,
			"http://api/system/getClipboardText": fdmAppFakes.system.getClipboardText,
			"http://api/system/validateFolder": fdmAppFakes.system.validateFolder,
			"http://api/system/messageBox": fdmAppFakes.system.messageBox,
			"http://api/system/prompt": fdmAppFakes.system.prompt,
			"http://api/system/screenDensityFactor": fdmAppFakes.system.screenDensityFactor,

			/*"http://api/menu/launchVisitForum": fdmAppFakes.menu.launchVisitForum,
			"http://api/menu/launchContact": fdmAppFakes.menu.launchContact,
			"http://api/menu/launchAbout": fdmAppFakes.menu.launchAbout,
			"http://api/menu/launchExit": fdmAppFakes.menu.launchExit,
			"http://api/menu/showPopupMenu": fdmAppFakes.menu.showPopupMenu,
			"http://api/menu/showFilesPopupMenu": fdmAppFakes.menu.showFilesPopupMenu,*/

			"http://api/downloads/state": fdmAppFakes.downloads.state,
			"http://api/downloads/downloadType": fdmAppFakes.downloads.downloadType,
			"http://api/downloads/errorText": fdmAppFakes.downloads.errorText,
			"http://api/downloads/fileName": fdmAppFakes.downloads.fileName,
			"http://api/downloads/totalBytes": fdmAppFakes.downloads.totalBytes,
			"http://api/downloads/downloadedBytes": fdmAppFakes.downloads.downloadedBytes,
			"http://api/downloads/url": fdmAppFakes.downloads.url,
			"http://api/downloads/domain": fdmAppFakes.downloads.domain,
			"http://api/downloads/createdDate": fdmAppFakes.downloads.createdDate,
			"http://api/downloads/progress": fdmAppFakes.downloads.progress,
			"http://api/downloads/checkingProgress": fdmAppFakes.downloads.checkingProgress,
			"http://api/downloads/sections": fdmAppFakes.downloads.sections,
			"http://api/downloads/downloadSpeedBytes": fdmAppFakes.downloads.downloadSpeedBytes,
			"http://api/downloads/downloadSpeedLimit": fdmAppFakes.downloads.downloadSpeedLimit,
			"http://api/downloads/outputFilePath": fdmAppFakes.downloads.outputFilePath,
			"http://api/downloads/rootPath": fdmAppFakes.downloads.rootPath,
			"http://api/downloads/comment": fdmAppFakes.downloads.comment,
			"http://api/downloads/tags": fdmAppFakes.downloads.tags,
			"http://api/downloads/files": fdmAppFakes.downloads.files,
			"http://api/downloads/isMovable": fdmAppFakes.downloads.isMovable,
			"http://api/downloads/isMoving": fdmAppFakes.downloads.isMoving,

			"http://api/downloads/play": fdmAppFakes.downloads.play,
			"http://api/downloads/pause": fdmAppFakes.downloads.pause,
			"http://api/downloads/restart": fdmAppFakes.downloads.restart,
			"http://api/downloads/launch": fdmAppFakes.downloads.launch,
			"http://api/downloads/addTag": fdmAppFakes.downloads.addTag,
			"http://api/downloads/removeTag": fdmAppFakes.downloads.removeTag,
			"http://api/downloads/openFolder": fdmAppFakes.downloads.openFolder,
			"http://api/downloads/getDownloadProperties": fdmAppFakes.downloads.getDownloadProperties,
			
			"http://api/downloads/deleteByIds": fdmAppFakes.downloads.deleteByIds,
			"http://api/downloads/startAll": fdmAppFakes.downloads.startAll,
			"http://api/downloads/stopAll": fdmAppFakes.downloads.stopAll,
			"http://api/downloads/startByIds": fdmAppFakes.downloads.startByIds,
			"http://api/downloads/stopByIds": fdmAppFakes.downloads.stopByIds,
			"http://api/downloads/moveToByIds": fdmAppFakes.downloads.moveToByIds,
			"http://api/downloads/getDHTNodes": fdmAppFakes.downloads.getDHTNodes,
			"http://api/downloads/getDownloadsProperties": fdmAppFakes.downloads.getDownloadsProperties,
			"http://api/downloads/downloadsExistsOnDisk": fdmAppFakes.downloads.downloadsExistsOnDisk,

			"http://api/downloads/listenToLogUpdates": fdmAppFakes.downloads.listenToLogUpdates,

			"http://api/downloads/getProgressMap": fdmAppFakes.downloads.getProgressMap,

			"http://api/batchDownloads/getDownloadsIds": fdmAppFakes.batchDownloads.getDownloadsIds,

			"http://api/settings/getAgentsToIdentity": fdmAppFakes.settings.getAgentsToIdentity,
			"http://api/settings/clearFolderHistory": fdmAppFakes.settings.clearFolderHistory,
			"http://api/settings/clearDownloadHistory": fdmAppFakes.settings.clearDownloadHistory,
			"http://api/settings/getAntiViruses": fdmAppFakes.settings.getAntiViruses,
			"http://api/settings/onDialogInit": fdmAppFakes.settings.onDialogInit,
			"http://api/settings/onDialogApply": fdmAppFakes.settings.onDialogApply,
			"http://api/settings/checkAntivirusPathSettings": fdmAppFakes.settings.checkAntivirusPathSettings,
			"http://api/settings/checkAntivirusCustomArgSettings": fdmAppFakes.settings.checkAntivirusCustomArgSettings,
			"http://api/settings/checkAntivirusExtSettings": fdmAppFakes.settings.checkAntivirusExtSettings,
			"http://api/settings/getLocales": fdmAppFakes.settings.getLocales,
			"http://api/settings/setConnectionTrafficLimit": fdmAppFakes.settings.setConnectionTrafficLimit,
			"http://api/settings/openChromePluginPage": fdmAppFakes.settings.openChromePluginPage,
			"http://api/settings/openFirefoxPluginPage": fdmAppFakes.settings.openChromePluginPage,
			"http://api/settings/checkDefaultTorrentClient": fdmAppFakes.settings.checkDefaultTorrentClient,

			"http://api/updater/getProgress": fdmAppFakes.updater.getProgress,
			"http://api/updater/getStage": fdmAppFakes.updater.getStage,
			"http://api/updater/getState": fdmAppFakes.updater.getState,
			"http://api/updater/updatesAvailable": fdmAppFakes.updater.updatesAvailable,
			"http://api/updater/getPreInstallCheckFailureReason": fdmAppFakes.updater.getPreInstallCheckFailureReason,
			"http://api/updater/getRestartRequired": fdmAppFakes.updater.getRestartRequired,

			"http://api/localization/tr": fdmAppFakes.localization.tr,
			"http://api/localization/installedTranslations": fdmAppFakes.localization.installedTranslations,
			"http://api/localization/getAllStrings": fdmAppFakes.localization.getAllStrings,
			"http://api/localization/setLanguage": fdmAppFakes.localization.setLanguage,

			"http://api/sharer/showShareDialog": fdmAppFakes.sharer.showShareDialog,

			"http://api/appInfo/featureDisabled": fdmAppFakes.appInfo.featureDisabled
		}
	}

	populateApp();
	populateDownloads();
	populateBatchDownloads();
	populateDownloadWizard();
	populateSystem();
	populateSettings();
	populateMenu();
	populateTags();
	populateUpdater();
	populateLocalization();
    populateSharer();
    populateAppInfo();
	initFakeMap();
})();


