import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs";

const wantedMoveLists = [
  "Moves learnt by level up",
  "Egg moves",
  "Move Tutor moves",
  "Moves learnt by TM",
  "Moves learnt by TR",
];
const getDocument = async () => {
  const document = await fetch(
    "https://pokemondb.net/pokedex/ninetales/moves/8"
  );
  const $ = cheerio.load(await document.text());

  const moveListsTab = $("#tab-moves-18");
  console.log(moveListsTab.html());
  let firstSet = $(moveListsTab[0]).find("div");
  fs.writeFileSync("test.html", $(firstSet).html());

  // while (currentNode.name !== "div") {
  //   currentNode = currentNode.nextSibling;
  // }

  // let children = currentNode.firstChild;
  // console.log(children);

  // console.log(forms);

  // currentMoveListName = currentNode.text();
  // currentNode.nextSibling;
  // while (currentNode.name !== "h3") {
  //   console.log(currentNode.name);
  //   currentNode = currentNode.nextSibling;
  // }
};

getDocument();
