// CS360 project#2 tutorial
// author: smhan@dbserver.kaist.ac.kr

var mysql = require('mysql'); // MySQL module on node.js

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'tester',
    password : '1234',
    database : 'cs360_hoep',
});

connection.connect(); // Connection to MySQL

var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use('/', express.static(__dirname));
app.use('/', express.static(__dirname + '/public')); // you may put public js, css, html files if you want...
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var queryStr = ""

// "node app.js" running on port 3000
app.listen(8000, function () {
	console.log('Example app listening on port 8000!');
});



// base url action: "http://localhost/" -> send "index.html" file.
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/homepage.html");
});


// get action to give raw data for user_tbl: "http://localhost/listAPI"
app.post('/inital_search', function (req, res) {
	console.log(req.body); // log to the node.js server

	// [Work-to-do] "user_dept"와 "user_region"에 아무런 값을 입력하지 않는 경우 에러 띄우기
	if (req.body.user_region.length == 0 & req.body.user_dept.value == '') {window.alert("Please select more than one condition.")}

	// Construct queryStr
	queryStr = 'SELECT * FROM (SELECT DID, RID, Univ_name, Region, Dept, Language_id, Available_number, URL, UNDERGRADUATE FROM RESULT_VIEW WHERE DID = "'
					+ req.body.user_dept + '" AND RID '

	// Case 1. Multiple regions selected by user
	if(req.body.user_region.length > 1){
		var region_str_set = "("
		var index = 1

		for(index = 1; index < req.body.user_region.length; index++){
			region_str_set = region_str_set.concat(req.body.user_region[index], ',')
		}
		// Replace last character ',' with ')' ()
		// https://stackoverflow.com/questions/36630230/replace-last-character-of-string-using-javascript
		var region_str_set = region_str_set.replace(/.$/,")")

		queryStr = queryStr.concat("IN ", region_str_set)

	// Case 2. Only one region selected by user
	}else{
		queryStr = queryStr.concat('= ', req.body.user_region[0])
	}

	/*
	queryStr = 'SELECT Name, Univ_track FROM REQUEST1 WHERE RID = "'
		+ req.body.user_region[0]
		+ '" AND DID = "'
		+ req.body.user_dept
		+ '";';
	*/
	queryStr = queryStr + ') AS TMP WHERE Undergraduate = 1;'
	res.sendFile(__dirname + "/result.html");
});

app.get('/listAPI', function (req, res) {
	connection.query(queryStr, function (err, rows) {
		if (err) throw err;
		res.send(rows);
	})
});

function openTab(evt, section) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(section).style.display = "block";
    evt.currentTarget.className += " active";
}
