var classTheme = "";
var img = false;
var online = true;

function hambMenu() {
	var x = document.getElementById("topnav");
	if (x.className === "topnav") {
		x.className += " responsive";
	} else {
		x.className = "topnav";
	}
}

window.addEventListener("load", function(){
	const loading = document.querySelector(".loading");
	loading.className += " hidden";
});

function showError(container, errorMessage) {
	container.className = 'error';
	var msgElem = document.createElement('span');
	msgElem.className = "error-message";
	msgElem.innerHTML = errorMessage;
	container.appendChild(msgElem);
}

function resetError(container) {
	container.className = '';
	if (container.lastChild.className == "error-message") {
		container.removeChild(container.lastChild);
	}
}

function validate(form) {
	var elems = form.elements;
	var valid = true;

	resetError(elems.fanname.parentNode);
	if (!elems.fanname.value) {
		showError(elems.fanname.parentNode, ' Please, enter your name.');
		valid = false;
	}

	resetError(elems.feedback.parentNode);
	if (!elems.feedback.value) {
		showError(elems.feedback.parentNode, ' Please, enter feedback.');
		valid = false;
	}

	if (valid) {
		if (online) {
			addFeedback(elems.fanname.value, elems.feedback.value);
		}
		else {
			addFeedbackToStorage(elems.fanname.value, elems.feedback.value);
			var amount = localStorage.getItem('feedbacks');
			var value = JSON.parse(localStorage.getItem('feedbacks' + amount));
			// addFeedback(value['fanname'], value['feedback'], value['date']);
		}
		form.reset();
	}	
}

function addElement(parentId, elementTag, html, position) {
	var p = document.getElementById(parentId);
	var newElement = document.createElement(elementTag);
	newElement.innerHTML = html;
	p.appendChild(newElement);
	var div = document.getElementById(parentId);
	if (position == 'before') {
		div.insertBefore(newElement, div.childNodes[1]);
	}
	else {
		div.insertBefore(newElement, div.lastChild.nextSibling);
	}	
}

function addFeedback(name, feedback, date) {
	var divElem = document.getElementById('feedbacks');
	var classElem = divElem.childNodes[1].getAttribute("class");

	if (classElem == "feedbacks-light col-md-12" || classTheme == "light") {
		classTheme = "dark";
	} else {
		classTheme = "light";
	}
	if (!date) {
		date = currentDate();
	}
	
	var html = '<div class="feedbacks-' + classTheme + ' col-md-12"><p>' + feedback + '</p>'
	+'<div class="info">'
	+'<div class="author-' + classTheme + '">' + date + '</div>'
	+'<div class="author-' + classTheme + '">' + name + '</div>'
	+'</div>'
	+'</div>';
	addElement('feedbacks', 'div', html, 'before');
}

function currentDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd = '0'+dd
	} 
	if(mm<10) {
		mm = '0'+mm
	} 
	return today = mm + '.' + dd + '.' + yyyy;
}

document.getElementById('getval').addEventListener('change', readURL, true);
function readURL(){
	var file = document.getElementById("getval").files[0];
	var reader = new FileReader();
	reader.onloadend = function(){
		document.getElementById('clock').src = reader.result;      
		img = true; 
	}
	if(file){
		reader.readAsDataURL(file);
	}
}

function validateNew(form) {
	var elems = form.elements;
	var valid = true;
	resetError(elems.image.parentNode);
	if (!img) {
		showError(elems.image.parentNode, ' Please, add an image.');
		valid = false;
	}

	resetError(elems.nname.parentNode);
	if (!elems.nname.value) {
		showError(elems.nname.parentNode, ' Please, enter a title.');
		valid = false;
	}

	resetError(elems.news.parentNode);
	if (!elems.news.value) {
		showError(elems.news.parentNode, ' Please, enter a text of new.');
		valid = false;
	}

	if (valid) {
		addNewToLocal(elems.nname.value, elems.news.value);
		document.getElementById('clock').src = "";
		form.reset();
		alert("Your new is successfully posted.")

	}	
}

function isOnline() {
	return window.navigator.onLine;
}

function onLoadFeedbacks() {
	if (isOnline()) {
		getFeedbacksFromLocal();
		online = true;
	}
	else {
		online = false;
	}
}

function onLoadNews() {
	if (isOnline()) {
		getNewsFromLocal();
		online = true;
	}
	else {
		online = false;
	}
}

function addFeedbackToStorage(name, feedback) {
	var dict = {
		'fanname': name,
		'feedback': feedback,
		'date': currentDate()
	};
	var amount = localStorage.getItem('feedbacks');
	alert(amount);
	if (!amount) {
		localStorage.setItem('feedbacks', 0);
		amount = 0;
	}
	amount++;
	localStorage.setItem('feedbacks' + ("" + amount), JSON.stringify(dict));
	localStorage.setItem('feedbacks', amount);
}

function getFeedbacksFromLocal() {
	var amount = localStorage.getItem('feedbacks');
	for (var i = 1; i <= amount; i++) {
		var value = JSON.parse(localStorage.getItem('feedbacks' + ("" + i)));
		addFeedback(value["fanname"], value["feedback"], value["date"]);
	}
}

function fromLocalToServer() {
	alert('All data is on the server now');
}

function addNewToLocal(name, news) {
	img = document.getElementById('clock');
	imgNew = getImageURL(img);
	var dict = {
		'img': imgNew,
		'newname': name,
		'newtext': news
	};
	var amount = localStorage.getItem('news');
	if (!amount) {
		localStorage.setItem('news', 0);
		amount = 0;
	}
	amount++;
	localStorage.setItem('news' + ("" + amount), JSON.stringify(dict));
	localStorage.setItem('news', amount);
}

function getImageURL(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function getNewsFromLocal() {
	var amount = localStorage.getItem('news');
	var id;
	for (var i = 1; i <= amount; i++) {
		var value = JSON.parse(localStorage.getItem('news' + i));
		if (i%4 == 1) {
			id = 'news' + i;
			addElement('news', 'div', '<div class="col-md-12" id=' + id +'></div>')
		}
		addNew(value["img"], value["newname"], id);
	}
}

function addNew(img, name, id) {
	var divElem = document.getElementById(id);
	var html = '<div class="col-md-3">' +
				'<div class="news-content">' +
				'<div class="cell-content">' +
				'<img src="data:image/png;base64,' + img + '" alt="">' +
				'<a href="#"><span id="clickable-area"></span>' +
				'<h3>' + name + '</h3>' +
				'</a>' +
				'</div>' +
				'</div>' +
				'</div>';
	addElement(id, 'div', html, 'after');
}