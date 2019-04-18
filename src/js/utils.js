export const guid = function() {
	return Math.random().toString(36).substring(7) + Date.now().toString();
}

export const displayDurationFromSeconds = function(seconds) {
	var hours = seconds / 3600;
	var wholeHours = Math.floor(hours);
	var minutes = (wholeHours - hours) * -60;
	var wholeMinutes = Math.floor(minutes);
	var wholeSeconds = seconds % 60;

	var modTime = [];
	modTime.push(wholeHours);
	modTime.push(wholeMinutes);
	modTime.push(wholeSeconds);

	for (let i = 0; i < 3; i++) {
		if (!modTime[i]) {
			modTime[i] = '00';
		} else if (modTime[i] < 10) {
			modTime[i] = '0' + modTime[i].toString();
		} else {
			modTime[i] = modTime[i].toString();
		}
	}

	return modTime[0] + ':' + modTime[1] + ':' + modTime[2];
}

export const reversedFilteredCB = function(elVal, elInd, elArr) {
	if (this.storeSearchTerm) {
		var searchTerm = this.storeSearchTerm.toLowerCase();
		if(this.searchBy === 'date') {
			var searchFields = ['endTime', 'startTime'];
			var matches = false;
			searchFields.forEach((searchField) => {
				if (elVal[searchField].toLowerCase().includes(searchTerm)) {
					matches = true;
				}
			})
			return matches;
		}
		var searchField = elVal[this.searchBy].toLowerCase();
		return searchField.includes(searchTerm);
	}

	return true;
}

// Function to download data to a file
// https://stackoverflow.com/questions/13405129/javascript-create-and-save-file#30832210
export const downloadFile = function(data, filename, type) {
	var file = new Blob([data], { type: type });
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

export const pushArrayToArray = function(originalArray, newItemsArray) {
	for(let i = 0; i < newItemsArray.length; i++) {
		originalArray.push(newItemsArray[i]);
	}
}

// https://stackoverflow.com/questions/2274627/how-can-i-get-horizontal-scrollbars-at-top-and-bottom-of-a-div
export const doubleScroll = function(element) {
    var scrollbar = document.createElement('div');
    scrollbar.appendChild(document.createElement('div'));
    scrollbar.style.overflow = 'auto';
    scrollbar.style.overflowY = 'hidden';
    scrollbar.firstChild.style.width = element.scrollWidth+'px';
    scrollbar.firstChild.style.paddingTop = '1px';
    scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
    scrollbar.onscroll = function() {
        element.scrollLeft = scrollbar.scrollLeft;
    };
    element.onscroll = function() {
        scrollbar.scrollLeft = element.scrollLeft;
    };
    element.parentNode.insertBefore(scrollbar, element);
}
