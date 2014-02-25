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
          //API.sendChat("/me This song has been played " + songData["timesPlayed"] + " time since " + birthday);
          API.sendChat("/me " + songData["lastPlayed"]);
        } else if (songData["timesPlayed"] == undefined) {
          API.sendChat("/me This song has been played 0 times since " + birthday);
        } else {
          API.sendChat("/me This song has been played " + songData["timesPlayed"] + " times since " + birthday);
          API.sendChat("/me " + songData["lastPlayed"]);
        }
      }
    } else if (data.message === "&amp;firstplayed") {
      var currentMedia = API.getMedia();
      var songData = JSON.parse(localStorage.getItem("" + currentMedia.author + "-" + currentMedia.title));
      if (songData == null) {
        console.log("Null Song Data");
      } else {
        if (songData["firstPlayed"] === undefined) {
          API.sendChat("/me This song has been played 0 times since " + birthday);
        } else {
          API.sendChat("/me " + songData["firstPlayed"]);
        }
      }
    } else if (data.message === "&amp;catfacts") {
      API.sendChat("/me " + catFacts[Math.floor(Math.random()*catFacts.length)])
    } else if (data.message === "&amp;imgoingtohell") {
      var choice = Math.floor(Math.random()*inappropriateJokesQ.length);
      API.sendChat("/me " + inappropriateJokesQ[choice]);
      setTimeout(function () {API.sendChat("/me " + inappropriateJokesA[choice])}, 5000);
    } else if (data.message.substring(0,10) === "&amp;songinfo ") {
    } else if (data.message === "&amp;roomrules") {
      API.sendChat("/me Please note: this room is for deeper, darker & more conscious sounds; Brostep, BroTrap, Moombahton, Trance, Electro House & other stressful music will get skipped without warning. Enjoy your stay!");
    } else if (data.message === "&amp;commands") {
      API.sendChat("/me Commands: &woot, &firstplayed, &lastplayed, &roomrules, &catfacts, &imgoingtohell");
    }
  } else if (data.type === "mention") {
    API.sendChat("/me Hello, I am a bot and the keeper of bass.");
  }
}

var previousSongObj = null;
function newSongCallback(obj) {
  if (previousSongObj != null) {
    var prevSongData = JSON.parse(localStorage.getItem("" + previousSongObj.media.author + "-" + previousSongObj.media.title));
    prevSongData["lastPlayed"]  = "This song was last played on " + new Date().today() + " @ " + new Date().timeNow() + " GMT";
    localStorage.setItem("" + previousSongObj.media.author + "-" + previousSongObj.media.title, JSON.stringify(prevSongData));
    previousSongObj = obj;
  }
  if (obj == null) return; //no DJ
  var songData = JSON.parse(localStorage.getItem("" + obj.media.author + "-" + obj.media.title));
  if (songData == null) {
    songData = {};
    songData["timesPlayed"] = 1;
    songData["firstPlayed"] = "This song was first played on " + new Date().today() + " @ " + new Date().timeNow() + " GMT";
    songData["lastPlayed"]  = "This song is being played for the first time since " + birthday;
    songData["woots"] = 0;
    songData["mehs"]  = 0;
    songData["grabs"] = 0;
    localStorage.setItem("" + obj.media.author + "-" + obj.media.title, JSON.stringify(songData));
  } else {
    songData["timesPlayed"] = songData["timesPlayed"] + 1;
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
  localStorage.setItem("" + currentMedia.author + "-" + currentMedia.title, JSON.stringify(songData));
}

function newGrabsCallback(obj) {
  if (obj == null) return;
  var currentMedia = API.getMedia();
  var songData = JSON.parse(localStorage.getItem("" + currentMedia.author + "-" + currentMedia.title));
  songData["grabs"] += 1;
  localStorage.setItem("" + currentMedia.author + "-" + currentMedia.title, JSON.stringify(songData));
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

var catFacts = [
"Cats usually weigh between 2.5 and 7 kg (5.5–16 pounds), although some breeds can exceed 11.3 kg (25 pounds). Some cats have been known to reach up to 23 kg (50 pounds) due to overfeeding. This not healthy for the cat, and should be prevented through #diet and exercise (playing), especially for cats living exclusively indoors.",
"Indoor cats typically live 14 to 20 years although the oldest-known cat lived to an amazing age of 36.  Domestic cats tend to live longer if they are not permitted to go outdoors (reducing the risk of injury from fights or accidents and exposure to di#seases) and if they are spayed or neutered.",
"Spaying and neutering cats also decrease the risk of testicular and ovarian cancer.  Having female cats spayed before their first litter benefit from reduced risk of mammary cancer.",
"The domestic house cat is a small carnivorous mammal. Its most immediate ancestor is believed to be the African wild cat. The cat has been living in close association with humans for somewhere between 3,500 and 8,000 years.",
"Cats can conserve energy by sleeping more than most animals, especially as they grow older. Durations of sleep are various, usually 12–16 hours, with 13–14 being the average. ",
"Cats, in some cases, can sleep as much as 20 hours in a 24-hour period. The term cat nap refers to the cat's ability to fall asleep (lightly) for a brief period and has entered the English vocabulary – someone who nods off for a few minutes is said to# be \"taking a cat nap\".",
"Due to cats nocturnal nature, they are often known to enter a period of increased hyperactivity and playfulness during the evening, dubbed the 'evening crazies', 'night crazies' or 'mad half hour' by some (but not 'happy hour').",
"Cats' temperament can vary depending on the breed. Shorter haired cats tend to be skinnier and more active.  Cats with longer hair tend to be heavier and less active.",
"The body temperature of a cat is between 38 and 39 °C (101 and 102.2 °F).  A cat is considered febrile if it has a temperature of 39.5 °C (103 °F) or greater, or hypothermic if less than 37.5 °C (100 °F).  A domestic cat's normal heart rate ranges fro#m 140 to 220 beats per minute which is largely dependent on how excited the cat is.  Cats at rest  have an average heart rate between 150 and 180 bpm.",
"A common belief says that cats always land on their feet; well they usually do - but not always. A cat can reflexively twist its body and right itself using its acute sense of balance and flexibility.  This is known as a cat 'righting reflex'.   It al#ways rights itself the same way, provided it has the time to do so during a fall. Certain Cats that don't have a tail are a notable exception, since a cat moves its tail and relies on conservation of angular momentum to set up for landing.",
"Like dogs, cats are digitigrades, meaning they walk directly on their toes, the bones of their feet making up the lower part of the visible leg.",
"Cats are capable of walking very precisely, because like all felines they directly register, that is, they place each hind paw (almost) directly in the print of the corresponding forepaw, minimizing noise and visible tracks. This also provides the cat# sure footing for their hind paws when they navigate rough terrain.",
"As with many predators, cats have retractable claws. This is actually a misnomer because in their normal, relaxed position the claws are sheathed with the skin and fur around the toe pads. This is done to keep the claws sharp by preventing wear from c#ontact with the ground. It is only by stretching, such as a cat swatting at prey, that the connecting tendons are pulled taut, forcing the claws to extend. Thus, extending the claws is an involuntary action for cats.",
"Cats, especially young kittens, are known for their love of string play. Most cats can't resist a dangling piece of string, or a piece of rope drawn randomly and enticingly across the floor.  This propensity is probably related to their hunting instin#ct. If string is ingested, however, it can get caught in the cat’s stomach or intestines, causing illness, or in extreme cases, death.",
"Due to the possible complications of ingesting string, string play is sometimes replaced with a red dot laser pointer. But some people also discourage the use of laser pointers for play with pets, because of the fear of eye damage and/or the possible #loss of satisfaction associated with the successful capture of an object or of prey.",
"Domestic cats are very effective predators. They can ambush and dispatch prey using tactics similar to those of leopards and tigers by pouncing; they then deliver a lethal neck bite with their long canine teeth that severs the victim's spinal cord, or# asphyxiate it by crushing the windpipe.",
];

var inappropriateJokesQ = [
"Why did God create woman?",
"If the dove is the bird of peace, what is the bird of true love?",
"How do you annoy your girlfriend during sex?",
"Why do women fake orgasms?",
"What is the definition of 'making love'?",
"What should you do if your girlfriend starts smoking?",
"What's the difference between oral sex and anal sex?",
"How many sexists does it take to change a light bulb?",
"What's the difference between pre-menstrual tension and B.S.E?",
"Why does the bride always wear white?",
"What do you say to a woman with 2 black eyes?",
"How many men does it take to open a beer?",
"If your wife keeps coming out of the kitchen to nag at you, what have you done wrong?",
"How do you turn a fox into an elephant?",
"What is the difference between a battery and a woman?",
"What are the three fastest means of communication?",
"Why do hunters make the best lovers?",
"How are fat girls and mopeds alike?",
"What should you give a woman who has everything?",
"How are tornadoes and marriage alike?",
"Why does a bride smile when she walks up the aisle?",
"What's the difference between a bitch and a whore?",
"What's the difference between your wife and your job?",
"What's the difference between love, true love, and showing off?",
"Why is the space between a women's breasts and her hips called a waist?",
"Do you know why they call it the Wonder Bra?",
"How do you make 5 pounds of fat look good?",
"Why did the woman cross the road?",
"Why are there no female astronauts on the moon?",
"How is a woman like a condom?",
];

var inappropriateJokesA = [
"To carry semen from the bedroom to the toilet.",
"The swallow",
"Call her.",
"Because they think men care.",
"Something a woman does while a guy is fucking her.",
"Slow down and use a lubricant.",
"Oral sex makes your day. Anal sex makes your [w]hole weak.",
"None, let the bitch cook in the dark.",
"One's mad cow disease; the other's an agricultural problem.",
"Because it's good for the dishwasher to match the stove and refrigerator.",
"Nothing, she's been told twice already.",
"None. It should be opened by the time she brings it in.",
"Made her chain too long.",
"Marry it!",
"A battery has a positive side.",
"1) Internet 2) Telephone 3) Tel-a-woman",
"Because they go deep in the bush, shoot more than once, and they eat what they shoot.",
"They're both fun to ride until your friends find out.",
"A man to show her how to work it.",
"They both begin with a lot of blowing and sucking, and in the end you lose your house.",
"She knows she's given her last blow job.",
"A whore sleeps with everyone at the party while a bitch sleeps with everyone at the party except you.",
"After 10 years the job still sucks.",
"Spitting, swallowing, and gargling.",
"Because you could easily fit another pair of tits in there.",
"When you take it off, you wonder where her tits went.",
"Put a nipple on it.",
"What's the bitch doing out of the kitchen in the first place?!",
"'cause it doesn't need cleaning yet.",
"Both of them spend more time in your wallet than on your dick",
];
