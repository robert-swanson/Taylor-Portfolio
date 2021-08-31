add = document.getElementById("1");
remove = document.getElementById("2");
move = document.getElementById("3");
modify = document.getElementById("4");
disable = document.getElementById("5");
style = document.getElementById("6");
duplicate = document.getElementById("7");

first = document.getElementById("first");
second = document.getElementById("second");

content = document.getElementById("content")
buttons = document.getElementById("buttons")

toggle = true;

addL = function(){
  heading = document.createElement("h2");
  heading.className = "generic";
  heading.innerText = "Generic";
  content.appendChild(heading);
}
removeL = function(){
  generics = content.getElementsByClassName("generic")
  if(generics.length > 0){
    generics[0].remove();
  }
}

moveL = function(){
  if(toggle){//First is first
    first.remove();
    content.appendChild(first);
  }else{
    second.remove();
    content.appendChild(second);
  }
  toggle = !toggle;
}

modifyL = function(){
  first.innerText += "🤠"
}

disableL = function(){
  disable.disabled = "true";
}

styleL = function(){
  style.style = "color: orange;";
}

duplicateL = function(){
  newButton = duplicate.cloneNode(true);
  buttons.appendChild(newButton);
}

add.onclick = addL;
remove.onclick = removeL;
move.onclick = moveL;
modify.onclick = modifyL;
disable.onclick = disableL;
style.onclick = styleL;
duplicate.onclick = duplicateL;
