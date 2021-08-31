form = document.getElementById("form")
button = form.button;
button.addEventListener("click", validateForm)

function validateForm(event){
    var ajax = new XMLHttpRequest();
    ajax.responseType = "json";
    ajax.addEventListener("load", function(){
      obj = this.response;
      for (person of obj.data){
        console.log(person.first_name + " " + person.last_name + ": " + person.team.abbreviation);
      }
      console.log(obj)
    });
    ajax.open("get", "https://www.balldontlie.io/api/v1/players?per_page=100")
    ajax.send();
}

form
