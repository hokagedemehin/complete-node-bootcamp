const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err.message);
      }
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) {
        reject(`${err.message} 😴😫😪`);
      }
      resolve("This write is done");
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);

    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro("dog-image.txt", res.body.message);
    console.log("Random dog image is now saved 🐕‍🦺🐩🐕🐈");
  } catch (err) {
    console.error(err.message);
    // throw new Error(err.message);
    throw err.message;
  }

  return "2: ready with images 🐶 ";
};

// (async () => {
//   try {
//     console.log("1: get dog pictures!!!");
//     const x = await getDogPic();
//     console.log(x);
//     console.log("3: done getting dog pictures!!!");
//   } catch (err) {
//     console.error(err.meesage);
//   }
// })();

// #################### AWAIT SEVERAL PROMISES ##############
const getDogPic1 = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);

    console.log(`Breed: ${data}`);

    const res1 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1, res2, res3]);
    const imgs = all.map((el) => el.body.message);
    // console.log(imgs);
    // console.log(res.body.message);

    await writeFilePro("dog-image.txt", imgs.join("\n"));
    console.log("Random dog image is now saved 🐕‍🦺🐩🐕🐈");
  } catch (err) {
    console.error(err.message);
    // throw new Error(err.message);
    throw err.message;
  }

  return "2: ready with images 🐶 ";
};

(async () => {
  try {
    console.log("1: get dog pictures!!!");
    const x = await getDogPic1();
    console.log(x);
    console.log("3: done getting dog pictures!!!");
  } catch (err) {
    console.error(err.meesage);
  }
})();

/*
console.log("1: get dog pictures!!!");
getDogPic()
  .then((x) => console.log(x))
  .catch((err) => console.error(err.meesage));
console.log("3: done getting dog pictures!!!");
*/

/*
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    // if (err) {
    //   return console.error(err.message);
    // }
    console.log(res.body.message);

    return writeFilePro("dog-image.txt", res.body.message);
    // fs.writeFile("dog-image.txt", res.body.message, (err) => {
    // console.log("Random dog image is now saved 🐕‍🦺🐩🐕🐈  ");
    // });
  })
  .then(() => {
    console.log("Random dog image is now saved 🐕‍🦺🐩🐕🐈  ");
  })
  .catch((err) => console.error(err.message));

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       // if (err) {
//       //   return console.error(err.message);
//       // }
//       console.log(res.body.message);

//       fs.writeFile("dog-image.txt", res.body.message, (err) => {
//         console.log("Random dog image is now saved 🐕‍🦺🐩🐕🐈  ");
//       });
//     })
//     .catch((err) => console.error(err.message));
//   // .end((err, res) => {

//   // });
// });
*/
