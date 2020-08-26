let { PythonShell } = require("python-shell");
var path = require("path");

var avitoPath = "https://www.avito.ma/fr/";
var mx = 2;
var nx = "?o=";

function getCommandLine() {
  switch (process.platform) {
    case "darwin":
      return "open";
    case "win32":
      return "start";
    case "win64":
      return "start";
    default:
      return "xdg-open";
  }
}

const pages = document.getElementById("pages");
pages.style.display = "none";

document.getElementById("chargement").style.display = "none";
document.getElementById("terminer").style.display = "none";

const searchbutton = document.getElementById("searchbutton");
searchbutton.addEventListener("click", async function (event) {
  var searchtext = document
    .getElementById("searchtext")
    .value.replace(/ /gi, "_");
  var catgroup = document
    .getElementById("catgroup")
    .value.toLowerCase()
    .replace(/ /gi, "_");
  var searcharea_expanded = document
    .getElementById("searcharea_expanded")
    .value.toLowerCase()
    .replace(/ /gi, "_");
  var spr = document.getElementById("spr").value;
  var mpr = document.getElementById("mpr").value;
  var maxPages = document.getElementById("maxPages");

  avitoPath = "https://www.avito.ma/fr/";
  nx = "?o=";

  if (searchtext) {
    if (spr || mpr) {
      avitoPath =
        avitoPath +
        searcharea_expanded +
        "/" +
        catgroup +
        "/" +
        searchtext +
        "--à_vendre" +
        "?spr=" +
        spr +
        "&mpr=" +
        mpr;
      nx = "&o=";
    } else {
      avitoPath =
        avitoPath +
        searcharea_expanded +
        "/" +
        catgroup +
        "/" +
        searchtext +
        "--à_vendre";
    }
  } else {
    if (spr || mpr) {
      avitoPath =
        avitoPath +
        searcharea_expanded +
        "/" +
        catgroup +
        "?spr=" +
        spr +
        "&mpr=" +
        mpr;
      nx = "&o=";
    } else {
      avitoPath = avitoPath + searcharea_expanded + "/" + catgroup;
    }
  }

  var options = {
    scriptPath: path.join(__dirname, "/../python/"),
    args: [avitoPath],
  };

  let pyshell = new PythonShell("nbrPage.py", options);

  await pyshell.on("message", function (message) {
    ///swal(message);
    console.log(message);
    maxPages.innerHTML = message;
    pages.style.display = "block";
    mx = parseInt(message) + 1;
  });
});

const scrapbutton = document.getElementById("scrapbutton");
scrapbutton.addEventListener("click", async function (event) {
  var from = parseInt(document.getElementById("from").value);
  var to = parseInt(document.getElementById("to").value);

  if (from < 1) from = 1;
  if (to > mx) to = mx;
  console.log(avitoPath);
  var options = {
    scriptPath: path.join(__dirname, "/../python/"),
    args: [avitoPath, nx, from, to],
  };

  let pyshell = new PythonShell("scraping.py", options);
  document.getElementById("chargement");
  console.log("loading");
  document.getElementById("chargement").style.display = "block";
  document.getElementById("terminer").style.display = "none";
  await pyshell.on("message", function (message) {
    document.getElementById("chargement").style.display = "none";
    document.getElementById("terminer").style.display = "block";
    console.log(message);
    var exec = require("child_process").exec;
    exec(getCommandLine() + "  avito.txt");
  });
});
