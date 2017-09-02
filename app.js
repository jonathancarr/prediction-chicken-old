var express = require('express');
var app = express();

var chicken = require('./src/js/predictionChicken')();

var port = process.env.PORT || 8080;


var teams = require('./src/json/teams.json');

//Navbar for header
var nav = [{
		Link: '/week/1',
		Text: 'Match Predictions'
	},
	{
		Text: 'Team Ratings',
		Dropdown: [{
			Text: 'Championship',
			Link: '/championship'
		},
		{
			Text: 'Premiership',
			Link: '/premiership'
		}]
	},
	{
		Link: '/stats',
		Text: 'Statistics'
	}
];
var router = require('./src/js/router')(nav);

//Setup express server and listen on port
app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use('/', router);

app.listen(port, function(err){
	console.log('running server on port ' + port);
});

var updateTimer = 10000
//scrape web for results and update chicken every 10,000ms
var updateChicken = function(){
	chicken.update();
	setTimeout(function(){
		updateChicken();
	}, updateTimer)
}

//Load teams into chicken instance, then call updateChicken
chicken.loadTeams(teams, updateChicken);