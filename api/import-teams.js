const Mongoose = require('mongoose');
const config = require('./config')
const Team = require('./models/team');
var Client = require('node-rest-client').Client;

Mongoose.connect('mongodb://' +
    config.db.username + ':' +
    config.db.password + '@' +
    config.db.hostname + ':' +
    config.db.port + '/' +
    config.db.database);




var url = 'https://statsapi.web.nhl.com/api/v1/standings?expand=standings.record,standings.team,standings.division,standings.conference,team.schedule.next,team.schedule.previous&season=20162017';

var client = new Client();

// direct way
client.get(url, function(data, response) {

    data.records.forEach(division => {
        division.teamRecords.forEach(team => {
          team = team.team;
            var t = {
                name: team.name,
                abbreviation: team.abbreviation,
                teamName: team.teamName,
                shortName: team.shortName,
                division: team.division.name,
                conference: team.conference.name,
                isActive: true,
                image: 'data'
            };

            var teamModel = new Team(t);
            teamModel.save(function (err) {
                console.log(`Saving ${t.name}`);
                if (err){
                  console.log(err);
                }
                console.log('Saved');
            });

        });

    })



});
