// For todays date;
Date.prototype.today = function () {
  return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
  return ((this.getUTCHours() < 10)?"0":"") + this.getUTCHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

var birthday = localStorage.getItem("birthday");
if (birthday == null) {
  birthday = new Date().today();
  localStorage.setItem("birthday", birthday);
}

var catFacts = [
"Cats usually weigh between 2.5 and 7 kg (5.5–16 pounds), although some breeds can exceed 11.3 kg (25 pounds). Some cats have been known to reach up to 23 kg (50 pounds) due to overfeeding. This not healthy for the cat, and should be prevented through diet and exercise (playing), especially for cats living exclusively indoors.",
"Indoor cats typically live 14 to 20 years although the oldest-known cat lived to an amazing age of 36.  Domestic cats tend to live longer if they are not permitted to go outdoors (reducing the risk of injury from fights or accidents and exposure to diseases) and if they are spayed or neutered.",
"Spaying and neutering cats also decrease the risk of testicular and ovarian cancer.  Having female cats spayed before their first litter benefit from reduced risk of mammary cancer.",
"The domestic house cat is a small carnivorous mammal. Its most immediate ancestor is believed to be the African wild cat. The cat has been living in close association with humans for somewhere between 3,500 and 8,000 years.",
"Cats can conserve energy by sleeping more than most animals, especially as they grow older. Durations of sleep are various, usually 12–16 hours, with 13–14 being the average. ",
"Cats, in some cases, can sleep as much as 20 hours in a 24-hour period. The term cat nap refers to the cat's ability to fall asleep (lightly) for a brief period and has entered the English vocabulary – someone who nods off for a few minutes is said to be \"taking a cat nap\".",
"Due to cats nocturnal nature, they are often known to enter a period of increased hyperactivity and playfulness during the evening, dubbed the 'evening crazies', 'night crazies' or 'mad half hour' by some (but not 'happy hour').",
"Cats' temperament can vary depending on the breed. Shorter haired cats tend to be skinnier and more active.  Cats with longer hair tend to be heavier and less active.",
"The body temperature of a cat is between 38 and 39 °C (101 and 102.2 °F).  A cat is considered febrile if it has a temperature of 39.5 °C (103 °F) or greater, or hypothermic if less than 37.5 °C (100 °F).  A domestic cat's normal heart rate ranges from 140 to 220 beats per minute which is largely dependent on how excited the cat is.  Cats at rest  have an average heart rate between 150 and 180 bpm.",
"A common belief says that cats always land on their feet; well they usually do - but not always. A cat can reflexively twist its body and right itself using its acute sense of balance and flexibility.  This is known as a cat 'righting reflex'.   It always rights itself the same way, provided it has the time to do so during a fall. Certain Cats that don't have a tail are a notable exception, since a cat moves its tail and relies on conservation of angular momentum to set up for landing.",
"Like dogs, cats are digitigrades, meaning they walk directly on their toes, the bones of their feet making up the lower part of the visible leg.",
"Cats are capable of walking very precisely, because like all felines they directly register, that is, they place each hind paw (almost) directly in the print of the corresponding forepaw, minimizing noise and visible tracks. This also provides the cat sure footing for their hind paws when they navigate rough terrain.",
"As with many predators, cats have retractable claws. This is actually a misnomer because in their normal, relaxed position the claws are sheathed with the skin and fur around the toe pads. This is done to keep the claws sharp by preventing wear from contact with the ground. It is only by stretching, such as a cat swatting at prey, that the connecting tendons are pulled taut, forcing the claws to extend. Thus, extending the claws is an involuntary action for cats.",
"Cats, especially young kittens, are known for their love of string play. Most cats can't resist a dangling piece of string, or a piece of rope drawn randomly and enticingly across the floor.  This propensity is probably related to their hunting instinct. If string is ingested, however, it can get caught in the cat’s stomach or intestines, causing illness, or in extreme cases, death.",
"Due to the possible complications of ingesting string, string play is sometimes replaced with a red dot laser pointer. But some people also discourage the use of laser pointers for play with pets, because of the fear of eye damage and/or the possible loss of satisfaction associated with the successful capture of an object or of prey.",
"Domestic cats are very effective predators. They can ambush and dispatch prey using tactics similar to those of leopards and tigers by pouncing; they then deliver a lethal neck bite with their long canine teeth that severs the victim's spinal cord, or asphyxiate it by crushing the windpipe.",
];

function chatCallback(data) {
  // Overview of the 'data' object.
  // chatID: "50b257e73f092b"
  // from: "CarloB"
  // fromID: "50b257623e083e694afa123e"
  // language: "en"
  // message: "test"
  // room: "test-2899"
  // type: "message"
  if (data.type === "message") {
    if (data.message === "&amp;woot") {
      $("#woot").click();
    } else if (data.message === "&amp;lastplayed") {
      var currentMedia = API.getMedia();
      var songData = JSON.parse(localStorage.getItem("" + currentMedia.author + "-" + currentMedia.title));
      if (songData == null) {
        console.log("Null Song Data");
      } else {
        if (songData["timesPlayed"] === 1) {
          API.sendChat(songData["lastPlayed"]);
          API.sendChat("This song has been played " + songData["timesPlayed"] + " time since " + birthday);
        } else if (songData["timesPlayed"] == undefined) {
          API.sendChat("This song has been played 0 times since " + birthday);
        } else {
          API.sendChat(songData["lastPlayed"]);
          API.sendChat("This song has been played " + songData["timesPlayed"] + " times since " + birthday);
        }
      }
    } else if (data.message === "&amp;firstplayed") {
      var currentMedia = API.getMedia();
      var songData = JSON.parse(localStorage.getItem("" + currentMedia.author + "-" + currentMedia.title));
      if (songData == null) {
        console.log("Null Song Data");
      } else {
        if (songData["firstPlayed"] === undefined) {
          API.sendChat("This song has been played 0 times since " + birthday);
        } else {
          API.sendChat(songData["firstPlayed"]);
        }
      }
    } else if (data.message === "&amp;catfacts") {
      API.sendChat(catFacts[Math.floor(Math.random()*catFacts.length)])
    } else if (data.message.substring(0,10) === "&amp;userinfo ") {
    } else if (data.message.substring(0,10) === "&amp;songinfo ") {
    }
  }
}

function newSongCallback(obj) {
  if (obj == null) return; //no DJ
  var songData = JSON.parse(localStorage.getItem("" + obj.media.author + "-" + obj.media.title));
  if (songData == null) {
    songData = {};
    songData["timesPlayed"] = 1;
    songData["firstPlayed"] = "First Played: " + new Date().today() + " @ " + new Date().timeNow() + " GMT";
    songData["lastPlayed"]  = "Last Played: " + new Date().today() + " @ " + new Date().timeNow() + " GMT";
    songData["woots"] = 0;
    songData["mehs"]  = 0;
    songData["grabs"] = 0;
    localStorage.setItem("" + obj.media.author + "-" + obj.media.title, JSON.stringify(songData));
  } else {
    songData["timesPlayed"] = songData["timesPlayed"] + 1;
    songData["lastPlayed"]  = "Last Played: " + new Date().today() + " @ " + new Date().timeNow() + " GMT";
    localStorage.setItem("" + obj.media.author + "-" + obj.media.title, JSON.stringify(songData));
  }
}

function newVotesCallback(obj) {
  if (obj == null) return;
  var currentMedia = API.getMedia();
  var songData = JSON.parse(localStorage.getItem("" + currentMedia.author + "-" + currentMedia.title));
  if (obj.vote > 0) {
    songData["woots"] += 1;
  } else {
    songData["mehs"] += 1;
  }
  localStorage.setItem("" + obj.media.author + "-" + obj.media.title, JSON.stringify(songData));
}

function newGrabsCallback(obj) {
  if (obj == null) return;
  var currentMedia = API.getMedia();
  var songData = JSON.parse(localStorage.getItem("" + currentMedia.author + "-" + currentMedia.title));
  songData["grabs"] += 1;
  localStorage.setItem("" + obj.media.author + "-" + obj.media.title, JSON.stringify(songData));
}

function modSkipCallback(username) {
  var skippedTimes = localStorage.getItem("skipped_" + username);
  if (skippedTimes == null) {
    localStorage.setItem("skipped_" + username, 1);
  } else {
    localStorage.setItem("skipped_" + username, skippedTimes + 1);
  }
}

function checkDJSkipped(username) {
  var skippedTimes = localStorage.getItem("skipped_" + username);
  if (skippedTimes == null) {
    return 0;
  } else {
    return skippedTimes;
  }
}

//function initializeAFK() {
//}
//
//initializeAFK();
API.on(API.CHAT,     chatCallback);
API.on(API.MOD_SKIP, modSkipCallback);
API.on(API.DJ_ADVANCE,    newSongCallback);
API.on(API.VOTE_UPDATE,   newVotesCallback);
API.on(API.CURATE_UPDATE, newGrabsCallback);
