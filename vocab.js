// get a random word from above list
var keyword = wordList[Math.floor(Math.random() * (wordList.length))];

//  Make an API call
var xhr = new XMLHttpRequest();
var apiurl = 'https://jisho.org/api/v1/search/words?keyword=' + keyword;
xhr.open("GET", apiurl, false);
xhr.send(); 

// Store result in appropriate variables
var result = JSON.parse(xhr.responseText)["data"][0];
var kanji = result["japanese"][0]["word"];
var hiragana = result["japanese"][0]["reading"];
var romaji = wanakana.toRomaji(hiragana);
var katakana = wanakana.toKatakana(hiragana);
var thepartofspeech = result["senses"][0]["parts_of_speech"];
var thedefinition = result["senses"][0]["english_definitions"];

// remove strings from objects and prettify
var actualposstring = "("
for (a = 0; a < thepartofspeech.length; a++) {
    actualposstring += thepartofspeech[a];
    
    if (a < thepartofspeech.length - 1) {
        actualposstring += ', ';
    }
    
}

actualposstring += ')';

// remove strings from objects and prettify
var actualdefstring = "";
for (a = 0; a < thedefinition.length; a++) {
    actualdefstring += thedefinition[a];
    
    if (a < thedefinition.length - 1) {
        actualdefstring += ', ';
    }
    
}

// set default romaji or use previously set one
browser.storage.sync.get("romaji").then(function(value) {
	
	if ((value.romaji != "on") && (value.romaji != "off")) {
		browser.storage.sync.set ({
			romaji: "on"
		});
	}
	else {
		browser.storage.sync.set ({
			romaji: String(value.romaji)
		});
	}
});

// set default topText or use previously set one
browser.storage.sync.get("topText").then(function(value) {
	
	if ((value.topText != "hiragana first") && (value.topText != "kanji first")) {
		browser.storage.sync.set ({
			topText: "hiragana first"
		});
	}
	else {
		browser.storage.sync.set ({
			topText: String(value.topText)
		});
	}
});

// apply the settings for romaji
browser.storage.sync.get("romaji").then(function(value) {
	
	if (value.romaji == "off") {
		document.getElementById('romaji').style.visibility = "hidden";
	}
	else {
		document.getElementById('romaji').style.visibility = "visible";
	}
});

// apply the settings for topText
browser.storage.sync.get("topText").then(function(value) {
	
	if (value.topText == "hiragana first") {
		document.getElementById("kanji").textContent = kanji;
		document.getElementById("hiragana").textContent = hiragana;
	}
	else {
		document.getElementById("kanji").textContent = hiragana;
		document.getElementById("hiragana").textContent = kanji;
	}
});

document.getElementById("romaji").textContent = romaji;
document.getElementById("katakana").textContent = katakana;
document.getElementById("part of speech").textContent = actualposstring.toLowerCase();
document.getElementById("definition").textContent = actualdefstring.toLowerCase();


function onAnchorClick(event) {
  chrome.tabs.create({ url: event.srcElement.href });
  return false;
}

// AUDIO
document.getElementById("audio").innerHTML = "<img src='audio.png' style='opacity: 0.4; width: 20px; height: 20px;'>";

document.getElementById("audio").addEventListener('click', function() {
	var msg = new SpeechSynthesisUtterance(hiragana);
	msg.lang = 'ja';
	window.speechSynthesis.speak(msg);
});


// Get the top sites and display then
function buildPopupDom(mostVisitedURLs) {
  var popupDiv = document.getElementById('mostVisited_div');
  var ul = popupDiv.appendChild(document.createElement('ul'));
  var desired_url_num = 10;

  for (var i = 0; i < desired_url_num; i++) {
    
    if (mostVisitedURLs[i] != undefined) {

	    var a_link = ul.appendChild(document.createElement('a'));
	    a_link.href = mostVisitedURLs[i].url; 

	    var li = a_link.appendChild(document.createElement('li'));
	    li.className = "link";
	    
	    var img = li.appendChild(document.createElement("img"));
	    var a = li.appendChild(document.createElement('a'));

	    img.src = "http://www.google.com/s2/favicons?domain=" + mostVisitedURLs[i].url;
	    img.className = "favicon";
	    a.href = mostVisitedURLs[i].url;
	    a.className = "link_text";

	    var url_title = (mostVisitedURLs[i].title);

	    if (mostVisitedURLs[i].url == "http://www.youtube.com/") {
	      url_title = "YouTube";}

	    if (mostVisitedURLs[i].url == "http://www.google.com") {
	      url_title = "Google";}

	    if (mostVisitedURLs[i].url == "http://www.facebook.com/") {
	      url_title = "Facebook";}

	    if (mostVisitedURLs[i].url == "http://www.baidu.com") {
	      url_title = "Baidu";}

	    if (mostVisitedURLs[i].url == "http://www.yahoo.com") {
	      url_title = "Yahoo";}

	    if (mostVisitedURLs[i].url == "http://www.gmail.com/") {
	      url_title = "Gmail";}

	    if (mostVisitedURLs[i].url == "http://drive.google.com/") {
	      url_title = "Google Drive";}

	    if (mostVisitedURLs[i].url == "https://twitter.com/") {
	      url_title = "Twitter";}


	    a.appendChild(document.createTextNode(url_title));
	}
  }
}
browser.topSites.get(buildPopupDom);

/* COLOURS --------------------------------------- */

// 8 colours
var yellowlight = '#FFFBDF';
var greenlight = '#EAFFEF';
var bluelight = '#D9E5FF';
var purplelight = '#CBC5F5';
var pinkdark = '#E2C8E5';
var pink = '#F3D3EA';
var pinklight = '#F9DFE8';
var orangelight = '#FDECE4';

// add event listeners
var palette = document.getElementsByClassName('colourBlock');
var colours = [yellowlight, orangelight, pinklight, pink, pinkdark, purplelight, bluelight, greenlight];

// adds event listeners
for (var i = 0; i < palette.length; i++) {

	// pass i inside a function to addEventListeners
	(function(index) {
		palette[index].addEventListener("click", function() {
			document.getElementById('body').style.backgroundColor = colours[index];
			
			// clears any highlighted boxes
			for (var j = 0; j < palette.length; j++) {
				document.getElementById(palette[j].id).style.border = '1px solid #a9a9a9';
			}

			// adds thicker border around current selection
			document.getElementById(palette[index].id).style.border = '1px black solid';
			browser.storage.sync.set ({
				color: index
			});
		})
	}) (i);
	
}


function setCurrentColor(result) {
	palette[result.color].click();
}

function onErrorColor(result) {
	palette[3].click();
}

var getting = browser.storage.sync.get("color");
getting.then(setCurrentColor, onErrorColor);


/* LINKS --------------------------------------- */

document.getElementById('toggleLinks').addEventListener("click", function() {

	var status = document.getElementById('mostVisited_div').style.visibility;

	if (status == 'hidden') {

		document.getElementById('mostVisited_div').style.visibility = 'visible';
		document.getElementById('toggleLinks').innerHTML = "<img src='/hide.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
		browser.storage.sync.set ({
			visibility: 'visible'
		});
	}
	else {

		document.getElementById('mostVisited_div').style.visibility = 'hidden';
		document.getElementById('toggleLinks').innerHTML = "<img src='/show.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
		browser.storage.sync.set ({
			visibility: 'hidden'
		});
	}

});


function setCurrentVisibility(result) {
	document.getElementById('mostVisited_div').style.visibility = result.visibility;

	if (result.visibility == "hidden") {
		document.getElementById('toggleLinks').innerHTML = "<img src='/show.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
	}
	else {
		document.getElementById('toggleLinks').innerHTML = "<img src='/hide.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
	}
	
}

function onErrorVisibility(result) {
	document.getElementById('mostVisited_div').style.visibility = 'visible';
	document.getElementById('toggleLinks').innerHTML = "<img src='/hide.png' style='position: fixed; opacity: 0.2; height: 20px; width: 30px; left: 5vh; bottom: 5vh;'></img";
}

var gettingVisibility = browser.storage.sync.get("visibility");
gettingVisibility.then(setCurrentVisibility, onErrorVisibility);


/* OPTIONS -------------------------------- */

document.getElementById('optionsImg').innerHTML += "<img src='/options.png' style='position: fixed; opacity: 0.2; height: 26px; width: 26px; left: 5vh; top: 5vh;'></img";
document.getElementById('romajiCheck').textContent = "romaji";
document.getElementById('romajiCheck').style.visibility = "hidden";
document.getElementById('topText').style.visibility = "hidden";
document.getElementById("romajiCheck").style.opacity = "0.4";
document.getElementById("topText").style.opacity = "0.4";

// Event listeners
document.getElementById('optionsImg').addEventListener("click", function() {

	if (document.getElementById('romajiCheck').style.visibility == "visible") {

		document.getElementById('romajiCheck').style.visibility = "hidden";
		document.getElementById('topText').style.visibility = "hidden";
	}

	else {
		document.getElementById("romajiCheck").style.visibility = "visible";
		document.getElementById("topText").style.visibility = "visible";
	}
	document.getElementById("romajiCheck").style.opacity = "0.4";
});

document.getElementById('romajiCheck').addEventListener("click", function() {

	browser.storage.sync.get("romaji").then(function(value) {
		
		// turn romaji off
		if (value.romaji == "on") {
			browser.storage.sync.set({
				romaji: "off"
			});

			document.getElementById("romajiCheck").style = "text-decoration-line: none";
			document.getElementById("romaji").style.visibility = "hidden";
		}

		// turn romaji on
		if (value.romaji == "off") {
			browser.storage.sync.set({
				romaji: "on"
			});

			document.getElementById("romajiCheck").style = "text-decoration-line: line-through";
			document.getElementById("romaji").style.visibility = "visible";
		}

		document.getElementById("romajiCheck").style.opacity = "0.4";
		document.getElementById("romajiCheck").style.visibility = "visible";

	});
});

document.getElementById('topText').addEventListener("click", function() {

	browser.storage.sync.get("topText").then(function(value) {

		// put kanji on top
		if (value.topText == "hiragana first") {
			browser.storage.sync.set({
				topText: "kanji first"
			});
			document.getElementById("topText").textContent = "hiragana first";
			document.getElementById("hiragana").textContent = kanji;
			document.getElementById("kanji").textContent = hiragana;

		}
		// put hiragana on top
		if (value.topText == "kanji first") {
			browser.storage.sync.set({
				topText: "hiragana first"
			});
			document.getElementById("topText").textContent = "kanji first";
			document.getElementById("hiragana").textContent = hiragana;
			document.getElementById("kanji").textContent = kanji;
		}
	});
});

// actually change the selection based on what you picked
browser.storage.sync.get("romaji").then(function(value) {

	if (value.romaji == "on") {
		document.getElementById("romajiCheck").style = "text-decoration-line: line-through";
		document.getElementById("romaji").style.visibility = "visible";
	}
	if (value.romaji == "off") {
		document.getElementById("romajiCheck").style = "text-decoration-line: none";	
		document.getElementById("romaji").style.visibility = "hidden";
	}
});

browser.storage.sync.get("topText").then(function(value) {

	if (value.topText == "hiragana first") {
		document.getElementById("topText").textContent = "kanji first";
	}
	if (value.topText == "kanji first") {
		document.getElementById("topText").textContent = "hiragana first";
	}
});
