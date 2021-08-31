//Written by Robert Swanson

function setFunc(id, interval, maxLength){
  setInterval(function(){$.ajax("https://cse.taylor.edu/~cos143/time.php").done(function(data){
    list = $("#"+id+">ol")[0];
    item = document.createElement("li");
    item.innerText = data;
    list.prepend(item)
    if(list.children.length > maxLength){
      list.lastChild.remove();
    }
  })},interval);
}

setFunc("second1", 1000, 5)
setFunc("second2", 2000, 5)
setFunc("second5", 5000, 2)
setFunc("second10", 10000, 2)
