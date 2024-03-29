var express = require('express');
var chicken = require('./predictionChicken')()

//Navbar for header
var nav = [{
		Link: '/super/week',
		Text: 'Match Predictions'
	},
	{
		Text: 'Team Ratings',
		Dropdown: [{
			Text: 'New Zealand',
			Link: '/super/nz'
		},
		{
			Text: 'Australia',
			Link: '/super/aus'
		},
		{
			Text: 'South Africa',
			Link: '/super/sa'
		}]
	},
	{
		Text: 'Statistics',
		Link: '/super/stats'
	}
];

var router = express.Router();
var route = function(){

	//Redirect '/' path to '/week'
	router.route('/').get(function(req, res){
		res.redirect('/super/week');
	});

	//Render team ratings page when '/nz'
	router.route('/nz').get(function(req, res){
		chicken.getTeams({tournament: "Super", conference: "New Zealand"}, function(teams){
			res.render('teamsView', {
				title: 'New Zealand Conference',
				nav: nav,
				teams: teams
			});
		});
	});

	//Render team ratings page when '/aus'
	router.route('/aus').get(function(req, res){
		chicken.getTeams({tournament: "Super", conference: "Australia"}, function(teams){
			res.render('teamsView', {
				title: 'Australian Conference',
				nav: nav,
				teams: teams
			});
		});
	});

	//Render team ratings page when '/sa'
	router.route('/sa').get(function(req, res){
		chicken.getTeams({tournament: "Super", conference: "South Africa"}, function(teams){
			res.render('teamsView', {
				title: 'South African Conference',
				nav: nav,
				teams: teams
			});
		});
	});


	router.route('/stats').get(function(req, res){
		chicken.getStats({year: 2019}, function(stats){
			res.render('statsView', {
				title: 'Statistics',
				nav: nav,
				win: stats.win,
				margin: stats.margin,
				graph: stats.graph
			});
		});

	});

	//Redirect /week to current week
	router.route('/week').get(function(req, res){
		week = chicken.getNextWeek();
		res.redirect('/super/week/' + week);
	});

	//Render weekly games page for given week
	router.route('/week/:id').get(function(req, res){
		var week = parseInt(req.params.id);
		chicken.getGames({week: week, year: 2019, tournament: "super"}, function(games){
			res.render('weekView', {
				title: 'Week ' + week,
				week: week,
				weeks: 19,
				playoffs: [{week: 19, label: "Quarter Finals"}, {week: 20, label: "Semi Finals"}, {week: 21, label: "Finals"}],
				games: games,
				nav: nav
			});
		});

	});

	//Render weekly games page for given week
	router.route('/team/:name').get(function(req, res){
		var team = req.params.name;
		chicken.getTeam({code: team, tournament: "Super"}, function(res){
			res.render('teamView', {
				title: team.title,
				// week: week,
				// weeks: 19,
				// playoffs: [{week: 19, label: "Quarter Finals"}, {week: 20, label: "Semi Finals"}, {week: 21, label: "Finals"}],
				// games: games,
				nav: nav
			});
		});

	});

	return router
}

module.exports = route;
