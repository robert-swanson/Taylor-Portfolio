//Collect Vars
var heading = document.getElementById("heading");
var list = document.getElementById("list");
var slider = document.getElementById("qty");
var sliderLabel = document.getElementById("qtyLabel");
var possible = document.getElementById("possible");
colors = {
  "Apple Juice":"#995f14", "Orange Juice":"#e99626", "Grape Juice":"#a04d9f", "Cranberry Juice Cocktail":"#9c061b", "Orange Gatorade":"#d65f39", "Fruit Punch Gatorade":"#1d1f21", "Pink Lemonade":"#f399ad", "Strawberry Kiwi Enhanced Water":"#ab3855", "Tropical Mango Enhanced Water":"#e06254", "Watermelon Enhanced Water":"#c22f2d", "Blueberry Pomegranateacai Enhanced Water":"#5c3239",
"Raspberry Iced Tea":"#c10a15", "Iced Tea (sweet)":"#d7372e", "Iced Tea (unsweet)":"#d7372e",
"Hot Chocolate":"#7d4f32", "White Chocolate Caramel":"#dfa280", "Chai Tea Latte":"#ad916e",
"Vanilla Ice Cream":"#e2c062", "Chocolate Ice Cream":"#7e5546", "Mixed Ice Cream":"#ad8d76",
"Vanilla Almond Milk":"#e1dfdb", "Original Almond Milk":"#e3e5da", "Vanilla Soymilk":"#e0e3e0", "Chocolate Soymilk":"#814420", "Skim Milk":"#e2e4e1", "2% Milk":"#e2e4e1", "Chocolate Milk":"#ceac9a",
"Hazelnut Creamer":"#f0b374", "French Vanilla Creamer":"#839ca0",
"Ketchup":"#c12923", "Mustard":"#ddb93f", "Barbecue Sauce":"#120708",
"Mayonnaise":"#e7dfd4",
"Sierra Mist":"#c7debf", "Mountain Dew":"#72b239", "Tropicana Pink Lemonade":"#ed6d6f", "Dr. Pepper":"#9d1925", "Pepsi":"#094a92", "Diet Pepsi":"#dfdedf", "Diet Dr. Pepper":"#502e28", "Root Beer":"#110c0e", "Orange Crush":"#e9752f",
"Cherry":"#a90919", "Vanilla":"#f2e2a3", "Strawberry":"#f50915", "Lime":"#396316"}

drinks = {
  drinks: ["Apple Juice", "Orange Juice", "Grape Juice", "Cranberry Juice Cocktail"],
  sweet: ["Orange Gatorade", "Fruit Punch Gatorade", "Pink Lemonade", "Strawberry Kiwi Enhanced Water", "Tropical Mango Enhanced Water", "Watermelon Enhanced Water", "Blueberry Pomegranateacai Enhanced Water"],
  tea: ["Raspberry Iced Tea", "Iced Tea (sweet)", "Iced Tea (unsweet)"],
  hot: ["Hot Chocolate", "White Chocolate Caramel", "Chai Tea Latte"],
  icecream: ["Vanilla Ice Cream", "Chocolate Ice Cream", "Mixed Ice Cream"],
  milk: ["Vanilla Almond Milk", "Original Almond Milk", "Vanilla Soymilk", "Chocolate Soymilk", "Skim Milk", "2% Milk", "Chocolate Milk"],
  creamer: ["Hazelnut Creamer", "French Vanilla Creamer"],
  condiment: ["Ketchup", "Mustard", "Barbecue Sauce", "Mayonnaise"],
  machineBases: ["Raspberry Iced Tea", "Sierra Mist", "Mountain Dew", "Tropicana Pink Lemonade", "Dr. Pepper", "Pepsi", "Diet Pepsi", "Diet Dr. Pepper", "Root Beer", "Orange Crush"],
  machineFlavors: ["Cherry", "Vanilla", "Lime", "Strawberry"],
  getRandom: function(base, flav){
    var flavors = [""];
    flavors = drinks.getPowerSet(flavors, 0);
    // flavors.shift();
    return [drinks.machineBases[base], flavors[Math.floor(flav)]];
  },
  getPowerSet: function(curr, i){
    var newElements = [];
    for (set of curr){
      if(set.length == 0){
        newElements = newElements.concat(drinks["machineFlavors"][i])
      }else{
        newElements = newElements.concat(set + ", " + drinks["machineFlavors"][i])
      }
    }
    curr = curr.concat(newElements);
    if(i < drinks["machineFlavors"].length-1){
      curr = drinks.getPowerSet(curr, i+1);
    }
    return curr;
  }
}

//Settings init
var hot = document.getElementById("hot").value;
var icecream = document.getElementById("icecream").value;
var milk = document.getElementById("milk").value;
var creamer = document.getElementById("creamer").value;
var condiment = document.getElementById("condiment").value;
var qty = document.getElementById("qty").value;
var mode = document.getElementById("mode").value;

//Page Initialization
slider.oninput = function(){sliderLabel.innerHTML = slider.value + " ingredient" + (slider.value > 1 ? "s" : "")}
var submit = document.getElementById("submit")
submit.onclick = submitf;

function fontColor(color){
  red = parseInt("0x"+color.substring(1,3));
  green = parseInt("0x"+color.substring(3,5));
  blue = parseInt("0x"+color.substring(5,7));
  if ((red*0.299 + green*0.587 + blue*0.114) > 186){
    return "#000000";
  }else{
    return "#ffffff";
  }
}

//Submission
function submitf(){
  console.log("Submitted!")

  //Settings
  hot = document.getElementById("hot").checked;
  icecream = document.getElementById("icecream").checked;
  milk = document.getElementById("milk").checked;
  creamer = document.getElementById("creamer").checked;
  condiment = document.getElementById("condiment").checked;
  qty = document.getElementById("qty").value;
  mode = document.getElementById("mode").value;

  var concotion;
  switch (mode) {
    case "random":
      concotion = getRandom();
      break;
    case "type":
      concotion = getByType();
      break;
    case "crazy":
      concotion = getCrazy();
      break;
  }

  heading.innerHTML = "Concoction:";
  var listHTML = ""
  for(item of concotion){
    color = colors[item[0]];
    console.log(item);
    font = fontColor(colors[item[0]]);

    flavorString = ""
    if(item[1]){
      flavors = item[1].split(", ")
      for(flavor of flavors){
          c = colors[flavor]
          f = fontColor(c)
          flavorString += "<div class=\"flavor\" style=\"background-color: " + c + "; color: " + f + "\"><p>" + flavor + "</p></div>"
      }
    }

    listHTML += "<div class=\"ingredient\" style=\"background-color: "+ color + "; color: " + font + "\"><p><strong>"+item[0]+"</strong><p>" + flavorString +"</div>";

  }
  list.innerHTML=listHTML;
}

function getRandom(){
  var selection = [];
  selection = selection.concat(drinks["drinks"]).concat(drinks["sweet"]).concat(drinks["tea"])/*.concat(drinks["sodas"])*/;
  if(hot){
    selection = selection.concat(drinks["hot"]);
  }
  if(icecream){
    selection = selection.concat(drinks["icecream"]);
  }
  if(milk){
    selection = selection.concat(drinks["milk"]);
  }
  if(creamer){
    selection = selection.concat(drinks["creamer"]);
  }
  if(condiment){
    selection = selection.concat(drinks["condiment"]);
  }
  var concotion = [];
  var usedRand = [];
  var flav = drinks.machineFlavors.length;
  var base = drinks.machineBases.length;
  var poss = selection.length+base;
  var factorial = function(n){
    if(n == 1){
      return 1;
    }
    return n * factorial(n-1)
  }
  var combination = function(n, k){
    return factorial(n)/(factorial(n-k)*factorial(k))
  }
  numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  possible.innerHTML = numberWithCommas(Math.floor(combination(poss, qty))) + " combinations possible";
  for(var i = 0; i < qty; i++){
    var flavor
    var rand = Math.floor(Math.random()*poss);
    if(usedRand.includes(rand)){
      i--;
      continue;
    }else{
      usedRand.push(rand);
    }
    if(rand < base){//Machine with flavors
      concotion.push(drinks.getRandom(rand, Math.floor(Math.random()* flav*flav)));
    }else{
      rand -= base;
      concotion.push([selection[rand],undefined]);
    }
  }

  return concotion;
}
