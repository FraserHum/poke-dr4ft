import fs from "fs";
import { parse } from "csv-parse";
import fetch from "node-fetch";
import path from "path";
import { getDataDir } from "../backend/data.js";

const parser = parse({
  delimiter: ",",
});

const pokemonDataDir = path.join(getDataDir(), "pokemon");

const getPokemon = async () => {
  let pokemonList = []; // get list of pokemon in draft from file
  fs.createReadStream(path.join(pokemonDataDir, "pokemonList.txt"))
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

  list = list.map((pokemonName) => {
    return fetch(`${pokeApi}pokemon/${pokemonName}`);
  });

  const resultArray = await Promise.allSettled(list);

  const pokemonObject = {};
  for (let result of resultArray.slice(0, 1)) {
    let data = await result.value.json();
    delete data.forms;
    delete data.game_indices;
    delete data.held_items;
    delete data.base_experience;
    delete data.height;
    delete data.location_area_encounters;
    delete data.order;
    delete data.past_types;
    delete data.weight;
    pokemonObject[data.name] = data;
  }
  fs.writeFile(
    path.join(pokemonDataDir, "pokemon.json"),
    JSON.stringify(pokemonObject),
    "utf8",
    (err) => {
      if (err) throw err;
    }
  );
};

getPokemon();
