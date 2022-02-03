import fs from "fs";
import { parse } from "csv-parse";
import fetch from "node-fetch";

const parser = parse({
  delimiter: ",",
});

const getPokemon = async () => {
  let pokemonList = []; // get list of pokemon in draft from file
  fs.createReadStream("./pokemonList.txt")
    .pipe(parser)
    .on("data", function (csvrow) {
      console.log(csvrow);
      pokemonList = csvrow;
    })
    .on("end", function () {
      sendPokemonRequests(pokemonList);
    });
};

const sendPokemonRequests = async (list) => {
  const pokeApi = "https://pokeapi.co/api/v2/";

  // make a request for each pokemon and get species data
  list = list.map((pokemonName) => {
    return fetch(`${pokeApi}pokemon/${pokemonName}`);
  });

  const resultArray = await Promise.allSettled(list);
  console.log(await resultArray[0].value.json());

  // for (let result of resultArray) {
  //   console.log(await result.value.json());
  // }
};
//   Promise.allSettled(list)
//     .then((responses) => Promise.allSettled(responses.map((res) => res.value)))
//     .then((values) => Promise.allSettled(values.map((val) => val.value)))
//     .then((data) =>
//       Promise.allSettled(data.map((pokemon) => console.log(pokemon)))
//     )
//     .catch((error) => console.error(error.message));
// };

getPokemon();
