form = document.getElementById("form")

function updateArea(){
  var area = document.getElementById("area");
  var val = form.width.value * form.height.value
  area.value = val
}

function validateForm(event){
  event.preventDefault();
  contentValid = form.content.value.length > 0;
  passwordValid = form.password.value.length > 0;
  typeValid = form.type.value.length > 0;
  widthValid = !isNaN(form.width.value) && form.width.value >= 6 && form.width.value <=64;
  heightValid = !isNaN(form.height.value) && form.height.value >= 6 && form.height.value <=64;
  phoneValid = form.phone.value.match("[0-9]{3}[- ]?[0-9]{3}[- ]?[0-9]{4}")
  form.content.className = contentValid ? "" : "invalid";
  form.password.className = passwordValid ? "" : "invalid";
  form.type.className = typeValid ? "" : "invalid";
  form.width.className = widthValid ? "" : "invalid";
  form.height.className = heightValid ? "" : "invalid";
  form.phone.className = phoneValid ? "" : "invalid";
  if(contentValid && passwordValid && typeValid && widthValid && heightValid && phoneValid){
    setTimeout(function(){form.submit()}, 2000)
  }
}

form.height.addEventListener("input",updateArea)
form.width.addEventListener("input",updateArea)
form.addEventListener("submit", validateForm)
