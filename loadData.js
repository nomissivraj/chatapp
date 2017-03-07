var fs = require("fs"); //import file System library
var express = require("express"); //import express library
var exp = express(); //set up express as an actionable variable
var jsontext = fs.readFileSync("profiles.json","utf8"); // use file system library to filysync read profiles save into jsontext
var profiles = JSON.parse(jsontext); //parse jsontext into json object


exp.use(express.static('public'));

exp.get('/profiles', function (req, res) {
    res.setHeader("Content-Type", "text/html"); // type of response
    var userQuery = req.query.name; // get query from URL

    for (i = 0; i < profiles.length; i++) { // Loop through contents of profiles
        if (profiles[i].UserName == userQuery) { // show only profile matching current query
            res.write(
                "<div class='profile' style='background-color:#333; color:#fff; margin:0 auto; width:1100px; padding:15px; text-align:center;'>" +
                    "You requested details for " + userQuery + "<br>" 
                    + "Forename: " + profiles[i].FirstName + "<br>"
                    + "Surname: " + profiles[i].LastName + "<br>"
                    + "Email: " + profiles[i].Email + "<br>"
                    + "DoB: " + profiles[i].DoB + "<br>"
                    + "Gender: " + profiles[i].Gender
                + "</div>")
            res.end();
        }
    }
});


exp.get('/save', function (req, res){
    /*var userName = req.query.UserName;
    var firstName = req.query.FirstName;
    var lastName = req.query.LastName;
    var email = req.query.Email;
    var dateOfBirth = req.query.DoB;
    var gender = req.query.Gender;
    profiles.push({
        UserName: userName,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        DoB: dateOfBirth,
        Gender: gender
    });*/  
        
    
    function buildObject() {
        var userName = req.query.UserName;
        var firstName = req.query.FirstName;
        var lastName = req.query.LastName;
        var email = req.query.Email;
        var dateOfBirth = req.query.DoB;
        var gender = req.query.Gender;

        return {
            UserName: userName,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            DoB: dateOfBirth,
            Gender: gender
        };
    }

    var newObject = buildObject();
    profiles.push(newObject);
    var serialisedProfiles = JSON.stringify(profiles, null, 2);
    fs.writeFileSync('profiles.json', serialisedProfiles); //utf8 also
    res.send("added");
});


exp.get('/update', function (req, res){
    res.setHeader("Content-Type", "text/html"); // type of response
    
    var userQuery = req.query.UpdateUser; // get query from URL // current user being edited
    
    var newFirstName = req.query.FirstName;
    var newLastName = req.query.LastName;
    var newEmail = req.query.Email;
    var newDateOfBirth = req.query.DoB;
    var newGender = req.query.Gender;
    
    for (i = 0; i < profiles.length; i++) { // Loop through contents of profiles
        if (profiles[i].UserName == userQuery) { // only if userQuery matches current profile in loop
            //res.send(profiles[i].Email);
            profiles[i].UserName = userQuery;
            profiles[i].FirstName = newFirstName;
            profiles[i].LastName = newLastName;
            profiles[i].Email = newEmail;
            profiles[i].DoB = newDateOfBirth;
            profiles[i].Gender = newGender;
            
            var serialisedProfiles = JSON.stringify(profiles, null, 2);
            fs.writeFileSync('profiles.json', serialisedProfiles, function(err){

            });
        }
    }
    
});


exp.get('/delete', function (req, res){
    var userQuery = req.query.name; // get query from URL

    for (i = 0; i < profiles.length; i++) {
        if(profiles[i].UserName == userQuery) {
            var currentIndex = profiles.indexOf(profiles[i]);
            profiles.splice(currentIndex, 1); //deletes from array

            var serialisedProfiles = JSON.stringify(profiles, null, 2);
            fs.writeFileSync('profiles.json', serialisedProfiles, function(err){

            });
            res.end();
        }
    }
});


//Listen for requests from browser
exp.listen(7777, function (){
    console.log('Listening on port 7777');
});