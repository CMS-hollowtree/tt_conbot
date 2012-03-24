var Bot = require('ttapi');
var http = require('http');
var urban = require('urban');
var fs = require('fs');
var twitter = require('./twitter');
var blacklist = require('./blacklist');
var keys = require('./keys');

var AUTH = keys.AUTH;
var USERID = keys.USERID;
var ROOMID = keys.ROOMID;
var bot = new Bot(AUTH, USERID, ROOMID);
var user_to_follow = USERID;
var current_room = ROOMID;

var COMMAND_TRIGGER = 'conbot ';
var current_avatar = 0;
var autobob = true;
var chatty = true;
var allow_disco_mode= false;
var currently_following = false;
var oneUpOneDown = false;


bot.on('snagged', function (data) { 
	var artist = data.artist;
	var song = data.song;
	console.log(data);
	//tweeter("'"+song+"' by "+artist+" is fucking jammin right now!" );
});


//when user enters room, check to see if user is in blacklist; if true, boot
bot.on('registered', function (data) {
	var newuser = data.userid;  
	if (newuser = blacklist.one) {
		bot.boot(newuser, 'you are blacklisted');	
	} 
 });

//on boot, log user info into file
bot.on('booted_user', function (data) {
	var UserId = data.userid;
	//var UserName = data.user[0].name;
  fs.writeFile('bootedUsers.ls', UserId+' was booted')
 });
       
function sleep(milliseconds) {
  var start = new Date().getTime();

  while(new Date().getTime() < start + milliseconds) {
    //do nothing
  }
}

//autobop
bot.on('newsong', function (data) { bot.vote('up'); });
	bot.on('update_votes', function (data) { 
});


function define(query) {
  var response = urban(query);
  response.first(function(json) {
    if(json.definition && query.length > 0){
      bot.speak(json.definition);
    }
    else {
      bot.speak("I don't know that one.");
    }
  });
}

function example(query) {
  var response = urban(query);
  response.first( function(json) {
    if(json.example && query.length > 0){
      bot.speak(json.example && query.length > 0);
    }
    else {
      bot.speak("I don't have an example of that.");
    }
  });
}



bot.on('speak', function (data) {
  if (data.text.substring(0,COMMAND_TRIGGER.length) == COMMAND_TRIGGER) {
      var command = data.text.substring(COMMAND_TRIGGER.length).split(/\s+/);
      var response = "";
      switch (command[0]) {
      case "autobob":
        if (command.length == 1) {
          toggleAutobob();
        }
        break;
      case "bob":
      case "dance":
      case "boogie":
      case "awesome":
      case "shake":
      case "groove":
      case "shuffle":
      case "waltz":
      case "bounce":
        bot.vote('up');
        break;
      case "stop":
      case "lame":
        bot.vote('down');
        break;
      case "*":
        if (command.length > 1) {
          define(command.slice(1).join(" "));
        }
        break;
      case "example":
        if (command.length > 1) {
          example(command.slice(1).join(" ")); 
        }
        break;
      default:
        //bot.speak("sup");
      }
  }
});

bot.on('speak', function (data) {
   // Respond to "/hello" command
   if (data.text.match(/^\/hello$/)) {
      bot.speak('Hey! How are you '+data.name+'');
   }

// Respond to "/tableflip" command
   if (data.text.match(/^\/tableflip$/)) {
      bot.speak('/tablefix ....asshole');
   }

// Hop up
   if (data.text.match('start dj')) {	
	bot.addDj();
	handled_command = true;
   }

// step down
   if (data.text.match('stop dj')) {
	bot.remDj();
	handled_command = true;
   }

// fap
   if (data.text.match('fap')) {
	bot.speak('if you insist...but im not cleaning it up');
		sleep (3000);	
	bot.speak('8=:fist:=D');
   }

//dubstep
   if (data.text.match('dubstep')) {
      bot.speak('I LOVE ME SOME WUBZ <3');
}

//skip
   if (data.text.match('skip')) {
      bot.stopSong ();
}


// shuffle
   if (data.text.match('change it up')) {
	bot.speak('Queue has been shuffled');	
	bot.addDj();
	handled_command = true;
   }

//stop disco
   if (data.text.match('stop disco')) {
      allow_disco_mode = false;
   }

//change avatar
if (data.text.match('change avatar')) { 
			console.log('\nSomeone dislikes my avatar\n\n'); 
			bot.speak("I didn't know this party had a dress code");	
			
			if( current_avatar < 18 ) {
				current_avatar++;
			} else {
				current_avatar = 0;
			}
			
			bot.setAvatar( current_avatar );
			
			handled_command = true;
}

//change laptop
   if (data.text.match('use pc')) {
      bot.speak('windows, really? fine...');
      bot.modifyLaptop('pc');
   }
 if (data.text.match('use linux')) {
      bot.speak('finally, a real OS!');
      bot.modifyLaptop('linux');
   }
 if (data.text.match('use iphone')) {
      bot.speak('Going mobile');
      bot.modifyLaptop('iphone');
   }
 if (data.text.match('use chromebook')) {
      bot.speak('i didnt even know this existed?!');
      bot.modifyLaptop('chrome');
   }
 if (data.text.match('use mac')) {
      bot.speak('hey, now i can make dubstep!');
      bot.modifyLaptop('mac');
   }

// Add this song to our playlist
		if (data.text.match('add song')) {
			console.log('\nAdding a song to my playlist\n\n');		
			
			bot.roomInfo(true, function(data) {
				var newSong = data.room.metadata.current_song._id;
				var newSongName = songName = data.room.metadata.current_song.metadata.song;
				var artist= data.room.metadata.current_song.metadata.artist;
				bot.playlistAdd(newSong, 10);
				bot.speak('I really gotta put my beer down to queue ' + artist + '??' );
					sleep( 3000 );
				bot.speak('Meh, fine...i added ' + newSongName );	
		    });
			
			handled_command = true;
	    }

	function sleep(ms) {
	
		var dt = new Date();
		dt.setTime(dt.getTime() + ms);
		while (new Date().getTime() < dt.getTime());
	}

});

//disco mode
bot.on('speak', function (data) {
if (data.text.match('disco mode')) { 
allow_disco_mode = true;
				var discoTimer= setInterval( function() {
					if( !allow_disco_mode ) {
						clearInterval(discoTimer);
						return;
					}
					
					if( current_avatar < 18 ) {
						current_avatar++;
					} else {
						current_avatar = 0;
					}
					
					bot.setAvatar( current_avatar );
				},1000);
			} 
			handled_command = true;
	    
});

function changeRooms( targetBot, roomNumber) {
		targetBot.roomDeregister();
		targetBot.roomRegister(roomNumber);
	}
bot.on('pmmed', function (data) { 		
 if (data.text.match('conbot follow me')) {
	bot.speak('yes master');
		console.log('\n Following ' + data.name + '\n'); 
			currently_following = true;
			var followTimer= setInterval( function() {				
			bot.stalk( user_to_follow, function(data) { 	                 				console.log( '\nDidnt find the user!\n\n' );
			console.log( data );
					
			if( data.roomId != current_room ) {
				console.log( '\nFound the user!' ); 						changeRooms( bot, data.roomId );
					current_room = data.roomId;
					clearInterval(followTimer);
					currently_following = false;
					}
				}); // end bot stalk	
			},2000);
			handled_command = true;
	    }
});

bot.on('speak', function (data) {
   if (data.text.match('what time is it?')) {
var currentTime = new Date()
 var hours = currentTime.getHours()
  var minutes = currentTime.getMinutes()

  var suffix = "AM";
  if (hours >= 12) {
  suffix = "PM";
  hours = hours - 12;
  }
  if (hours == 0) {
  hours = 12;
  }

  if (minutes < 10){
  minutes = "0" + minutes
  }
      bot.speak('' + hours + ":" + minutes + " " + suffix + '');
	bot.speak('why? you got somewhere you gotta be?')
}
});

//Random movie quote
bot.on('speak', function (data) {
   if (data.userid != '4f50484e590ca262040044a2') {
   if (data.text===('conbot')) {
   var Quotation=new Array()

//quotes:
Quotation[0] = "I'm going to take a pillowcase and fill it full of bars of soap and beat the shit out of you!";
Quotation[1] = "Sanity is a golden apple with no shoelaces.";
Quotation[2] = "I've traveled five hundred miles to give my seed.";
Quotation[3] = "I tea-bagged your drum set! ";
Quotation[4] = "Okay, I'll be honest with you. I did fart. ";
Quotation[5] = "Boats and hoes! ";
Quotation[6] = "Sprechen sie dick? ";
Quotation[7] = "WHAT THE FUCK HAPPENED?";
Quotation[8] = "I wanna roll you up into a little ball and shove you up my vagina. ";
Quotation[9] = "The only reason you're living here is because me and my dad decided that your mom was really hot, and maybe we should just both bang her, and we'll put up with the retard in the meantime. ";
Quotation[10] = " We put liquid paper on a bee, and it died. ";
Quotation[11] = " I have a green belt... read it and weep. ";
Quotation[12] = "You know what? I still hate you, but you got a pretty awesome collection of nudie mags. ";
Quotation[13] = "Why do you have Randy Jackson's autograph on a martial arts weapon? ";
Quotation[14] = "Yeah. Anyway. My best friend is Ben Affleck...";
Quotation[15] = "You know what I got for Christmas? A crushed soul! ";
Quotation[16] = "yeah im homeless...at least im not a nigger";
Quotation[17] = "Have you ever been dragged onto the sidewalk and beaten till you PISSED BLOOD? ";
Quotation[18] = "I'm going to be honest with you, that smells like pure gasoline. Stings the nostrils.";
Quotation[19] = "I wanna be on you.";
Quotation[20] = "Let's make biscuits";
Quotation[21] = "Momma said that alligators are ornery cuz of their medulla oblon-gotta";
Quotation[22] = "Momma said that alligators are ornery cuz they got all them teeth, and no toothbrush.";
Quotation[23] = "Have you ever taken a shit so big, your pants fit better?";
Quotation[24] = "I bet you could suck a golf ball through a garden hose.";
Quotation[25] = "It's suggestive to women because they howl during sex." ;
// ======================================
// Do not change anything below this line
// ======================================
var Q = Quotation.length;
var whichQuotation=Math.round(Math.random()*(Q-1));
function showQuotation(){bot.speak(Quotation[whichQuotation]);}
function tweetQuote(){twitter.tweeter(Quotation[whichQuotation]);}	
	showQuotation();
	tweetQuote();
}
  }
});

//afk


var lastSeen = {}
  , djs      = [];

bot.on('roomChanged', function (data) {
   djs = data.room.metadata.djs;
	
});
bot.on('add_dj', function (data) {
   djs.push(data.user[0].userid);
	console.log(data.user[0].name + ' added to dj list');
	
});
bot.on('rem_dj', function (data) {
   djs.splice(djs.indexOf(data.user[0].userid), 1);
	console.log(data.user[0].name + + data.user[0] + ' removed from dj list');
});



justSaw = function (uid) {
   return lastSeen[uid] = Date.now();
};



bot.on('speak', function (data) {
   //your other code
   justSaw(data.userid);
});



isAfk = function (userId, num) {
   var last = lastSeen[userId];
   var age_ms = Date.now() - last;
   var age_m = Math.floor(age_ms / 1000 / 60);
   if (age_m >= num) {
      return true;
   };
   return false;
};


afkCheck = function () {
   var afkLimit = 10; //An Afk Limit of 10 minutes.
   for (i = 0; i < djs.length; i++) {
      dj = djs[i]; //Pick a DJ
      if (isAfk(dj, afkLimit)) { //if Dj is afk then
	if (dj = room_mod[i]) {
		//do nothing
		}else{
         bot.remDj(dj); //remove them
	}
      }; 
   };
};

bot.on('pmmed', function (data) {
if (data.text.match('start 1up1down')) { 
	oneUpOneDown = true; 
	//bot.speak('Starting 1up1down. After a Dj plays a song, he will be escorted off of the stage');
		bot.on('endsong', function (data) {
		bot.remDj(data.room.metadata.current_dj); 
});
}
});

 //server
require('http').createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  output = "Hello World!\n";
  for (k in request.headers) {
    output += k + '=' + request.headers[k] + '\n';
  }
  response.end(output);
}).listen(8080);


