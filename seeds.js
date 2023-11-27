const mongoose = require("mongoose");
const Camp = require("./models/Camp");
const Comment = require("./models/Comment");

const data = [
  {
    name: "Sonatube Caves",
    image: "https://pbs.twimg.com/media/EMyIeV6WkAETw-O.jpg",
    description:
      "This is kigali sonatubes, the center of kigali Rwanda. we have lovely statue",
  },
  {
    name: "Remera, Amahoro stadium",
    image:
      "https://www.hatkohybridgrass.com/wp-content/uploads/2023/05/IMG-20230506-WA0087-1.jpg",
    description:
      "This is National stadium, build in 1989 renewed in 2023. Now it can host over 50k people",
  },
  {
    name: "Kigali Convention Center",
    image:
      "https://media.architecturaldigest.com/photos/5cf0355bfd278a33d596e23b/master/w_1600%2Cc_limit/illume_orig.jpg",
    description:
      "This the most expensive house in the whole of africa, it was build back in 2016. and now it is among the best places you can visit in Rwanda",
  },
  {
    name: "Kigali Golf Club",
    image:
      "https://kigaligolf.rw/wp-content/uploads/2021/05/Kigali-Golf-Club-Course-RV5_6101-min.jpg",
    description:
      "This is a golf center, located in kigali, nyarutarama. you can reach there and enjoy yourself playing golf with other talented people",
  },
  {
    name: "Sonatube Caves",
    image: "https://pbs.twimg.com/media/EMyIeV6WkAETw-O.jpg",
    description:
      "This is kigali sonatubes, the center of kigali Rwanda. we have lovely statue",
  },
  {
    name: "Remera, Amahoro stadium",
    image:
      "https://www.hatkohybridgrass.com/wp-content/uploads/2023/05/IMG-20230506-WA0087-1.jpg",
    description:
      "This is National stadium, build in 1989 renewed in 2023. Now it can host over 50k people",
  },
  {
    name: "Kigali Convention Center",
    image:
      "https://media.architecturaldigest.com/photos/5cf0355bfd278a33d596e23b/master/w_1600%2Cc_limit/illume_orig.jpg",
    description:
      "This the most expensive house in the whole of africa, it was build back in 2016. and now it is among the best places you can visit in Rwanda",
  },
  {
    name: "Kigali Golf Club",
    image:
      "https://kigaligolf.rw/wp-content/uploads/2021/05/Kigali-Golf-Club-Course-RV5_6101-min.jpg",
    description:
      "This is a golf center, located in kigali, nyarutarama. you can reach there and enjoy yourself playing golf with other talented people",
  },
];

function seedDB() {
  // REMOVE ALL CAMPGROUNDS
  Camp.deleteMany({})
    .then(() => {
      // ADD SOME NEW CAMPGROUNDS
      data.forEach((seed) => {
        Camp.create(seed).then((camp) => {
          console.log("created new location");
          Comment.create({
            text: "This place is so amazing, all of you should reach out there and then enjoy life cause that what it was meant for. for more info you can reach out to there website and get there contact",
            author: "Aristide",
          }).then((comment) => {
            console.log("comment created");
            camp.comments.push(comment);
            camp.save();
          });
        });
      });
    })
    .catch((err) => console.log(err));

  // ADD FEW COMMENTS
}

module.exports = seedDB;
