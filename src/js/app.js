import Vue from 'vue';
import * as utils from './utils';
const moment = require('moment');

new Vue({
	el: '#app',

	data: {
		store: {
			timeLogs: []
		},
		showImportInput: false,
		showClearTableDialog: false,
		currTimerInterval: '',
		storeSearchTerm: '',
		searchBy: 'project',
		timerStarted: false,
		user: '',
		project: '',
		task: '',
		notes: '',
		timeLogEdit: {
			guid: '',
			user: '',
			startTime: '',
			endTime: '',
			project: '',
			task: '',
			notes: ''
		},
		newStartTimeFormatted: '',
		newEndTimeFormatted: ''
	},

	computed: {
		timeLogsReverseOrder: function () {
			var reversed = [...this.store.timeLogs].reverse();
			var reversedFiltered = reversed.filter(utils.reversedFilteredCB, this);
			return reversedFiltered;
		},
		
		timeSum: function () {
			return utils.displayDurationFromSeconds(
				this.timeLogsReverseOrder.reduce(
					function (prevTime, currLog) {
						var currTime = 0;
						if (currLog.endTime) {
							currTime = moment(currLog.endTime).diff(currLog.startTime, 'seconds');
						}

						return prevTime + currTime;
					}
					, 0
				)
			);
		},
	},

	methods: {

		start: function () {
			self = this;
			this.store.timeLogs.push({
				guid: utils.guid(),
				user: self.user,
				startTime: moment(),
				endTime: '',
				project: self.project,
				task: self.task,
				notes: self.notes
			});

			this.timerStarted = true;
			this.setCurrTimer();
		},

		stop: function () {
			this.updateStore();

			this.timerStarted = false;

			this.addToLocalStorage();
		},

		updateStore: function () {
			var timeLog = this.store.timeLogs.pop();

			timeLog.endTime = moment();

			this.store.timeLogs.push(timeLog);
		},

		formatTime: function (time) {
			return moment(time).format('YYYY-MM-DD h:mm a');
		},

		formatTimeWithSeconds: function (time) {
			return moment(time).format('YYYY-MM-DD h:mm a');
		},

		getDuration: function (startTime, endTime) {
			var seconds = moment(endTime).diff(startTime, 'seconds');
			var displayDuration = utils.displayDurationFromSeconds(seconds);

			return displayDuration;
		},

		setCurrTimer: function () {
			this.currTimerInterval = setInterval((function() {
				if(!this.timerStarted) {
					this.currTimer = '';
					clearInterval(this.currTimerInterval);
				}

				this.updateStore();
				this.addToLocalStorage();

			}).bind(this), 500);
		},

		showTimeLogEdit: function (timeLog) {
			this.timeLogEdit = { ...timeLog };
			this.newStartTimeFormatted = this.formatTimeWithSeconds(timeLog.startTime);
			this.newEndTimeFormatted = this.formatTimeWithSeconds(timeLog.endTime);
			//console.log(moment().valueOf(this.newStartTimeFormatted));
		},

		submitTimeLogEdit: function () {
			var self = this;
			var matchingLog = this.store.timeLogs.find(function (timeLog) {
				return timeLog.guid === self.timeLogEdit.guid;
			});

			if (this.newStartTimeFormatted !== this.formatTimeWithSeconds(this.timeLogEdit.startTime)) {
				this.timeLogEdit.startTime = moment(this.newStartTimeFormatted, 'YYYY-MM-DD HH:mm a');
			}

			if (this.newEndTimeFormatted !== this.formatTimeWithSeconds(this.timeLogEdit.endTime)) {
				this.timeLogEdit.endTime = moment(this.newEndTimeFormatted, 'YYYY-MM-DD HH:mm a');
			}

			Object.assign(matchingLog, this.timeLogEdit);

			this.resetTimeLogEdit();

			this.addToLocalStorage();
		},

		resetTimeLogEdit: function () {
			Object.assign(this.timeLogEdit, {
				guid: '',
				user: '',
				startTime: '',
				endTime: '',
				project: '',
				task: '',
				notes: ''
			});
		},

		addToLocalStorage: function () {
			window.localStorage.setItem('localData', JSON.stringify(this.store.timeLogs));
		},

		loadLocalStorage() {
			var localData = JSON.parse(window.localStorage.getItem('localData'));
			if (localData) {
				//this.store.timeLogs.push([...localData]);
				utils.pushArrayToArray(this.store.timeLogs, localData);
			}
		},

		exportLogs: function () {
			var downloadContent = JSON.stringify(this.store.timeLogs);
			utils.downloadFile(downloadContent, 'time-logs-'+moment().format('YYYYMMDDmmss')+'.txt', 'text/plain');
		},

		setUploadedText: function () {
			var newFiles = document.getElementById('new-file').files;

			for(let i = 0; i < newFiles.length; i++) {
				this.readUploadedFile(newFiles[i]);
			}
			
		},

		readUploadedFile: function(newFile) {
			var reader = new FileReader();
			var uploadedText;

			reader.onload = (function (event) {
				uploadedText = event.target.result;
				//this.store.timeLogs.push([...JSON.parse(uploadedText).timeLogs]);
				console.log(JSON.parse(uploadedText));
				utils.pushArrayToArray(this.store.timeLogs, JSON.parse(uploadedText));
				this.addToLocalStorage();
				this.showImportInput = false;
			}).bind(this);

			reader.readAsText(newFile, 'UTF-8');
		},

		displayEndTime: function(timeLog) {
			if (timeLog.guid === this.store.timeLogs[this.store.timeLogs.length - 1].guid && this.timerStarted) {
				return '--';
			}

			return timeLog.endTime ? this.formatTime(timeLog.endTime) : ''
		},

		clearTable: function() {
			this.store.timeLogs = [];
			this.addToLocalStorage();
			this.hideClearTable();
		},

		showClearTable: function() {
			this.showClearTableDialog = true;
		},

		hideClearTable: function() {
			this.showClearTableDialog = false;
		}
	},

	created: function () {
		this.loadLocalStorage();
		if (this.store.timeLogs.length) {
			this.project = this.store.timeLogs[this.store.timeLogs.length - 1].project;
			this.task = this.store.timeLogs[this.store.timeLogs.length - 1].task;
			this.user = this.store.timeLogs[this.store.timeLogs.length - 1].user;
		}

	},

	mounted: function() {
		document.querySelector('#app').style.display = 'block';
	}
});
