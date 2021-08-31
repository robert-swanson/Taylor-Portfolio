function handleError(response){
    alert(response.status + " " + response.statusText + response.responseText)
    console.log(response)
}

var restApiUrl = "https://stormy-thicket-73472.herokuapp.com"
var usersUrl = restApiUrl + "/api/users"
var loginUrl = restApiUrl + "/api/sessions/"
var secretsUrl = restApiUrl + "/api/secrets"
var updateUrl = restApiUrl + "/api/users/"

loginInfo = $("#loginInfo")
loginStatus= $("#status")

var username
var sessionID
var secret

function validateFields(){
    username=$("#username")[0].value
    var valid = true;
    var regex = /^\w{4,6}$/
    if(!regex.test(username)){
      $("#username").addClass("invalid")
      $("#username").removeClass("valid")
      $("#usernameMessage").text("Invalid Username")
      valid = false
    }
    else{
      $("#username").addClass("valid")
      $("#username").removeClass("invalid")
      $("#usernameMessage").text("Valid Username")
    }
    var password = $("#password")[0].value

    if(!regex.test(password)){
      $("#password").addClass("invalid")
      $("#password").removeClass("valid")
      $("#passwordMessage").text("Invalid Password")
      valid = false
    }
    else{
      $("#password").addClass("valid")
      $("#password").removeClass("invalid")
      $("#passwordMessage").text("Valid Password")
    }
    return valid
}

$("#createUser").on("click", function(event){  //Create User
  event.preventDefault()
  if(!sessionID){
    if(validateFields()){
      console.log("Adding User")
      username=$("#username")[0].value
      $.ajax({
        url: usersUrl,
        headers: {"X-Auth-Token": null},  // null because we're not logged in
        method: "POST",
        data: {"username":username, password: $("#password")[0].value}
        }).done(function (data) {
          console.log("Success!")
          $("#loginMessage").text("Account Created")
        }).fail(function(data){
            alert("There was an error while attempting to create user")
        })
    }
    }else{
      alert("You must log out before you can create an account")
    }
})

$("#login").on("click", function(){ //Login
  if(validateFields()){
    console.log("Logging In")
    username = $("#username")[0].value
    password = $("#password")[0].value
    $.post({
      url: loginUrl,
      headers: {"X-Auth-Token": null},  // null because we're not logged in
      data: {"username":username, "password": password}
    }).done(function (data){
      console.log("done")
      sessionID = data.sessionId
      if(data.sessionId){ //Logged In
        loggedIn()
      }else{//Not Logged In
        loginStatus.text("Logged Out")
      }
    }).fail(function(){
      $("#loginMessage").text("Incorrect username or password")
    })
  }
})

function loggedIn(){
  loginStatus.text("Logged in as " + username)
  loginInfo.append($(''))
  $("#logout").show()
  $.get({
    url: secretsUrl,
    headers: {"X-Auth-Token": sessionID},
  }).done(function(data){
    secret = data
    $("#secret").text(JSON.stringify(data))
    list = $("#content > ul")
    for(var key of Object.keys(data)){
      list.append($("<li>" + key + ": " + data[key]+"</li>"))
    }
    console.log("secrets")
  })
  $("#content").fadeIn("fast")
  $("#loginBox").fadeOut("fast")

  if(username == "admin"){
    $("#adminUtilities").fadeIn("fast")
  }else{
    $("#adminUtilities").hide()
  }
}

$("#adminUtilities").hide()
$("#logout").hide()
$("#logout").on("click", function(){
  console.log("logout!!")
  $.ajax({
    url: loginUrl+sessionID,
    type: "DELETE",
    headers: {"X-Auth-Token": sessionID},
  }).done(function(data){
    console.log("Logging Out")
    loggedOut()

  }).fail(function(data){
    console.log("Logout" + data)
  })
})


function loggedOut(){
  sessionID = null;
  username = null;
  $("#logout").hide()
  $("#loginBox").fadeIn("fast")
  $("#content").fadeOut("fast")
  $("#status").text("Logged Out")
  $("#content ul").empty()
}

$("#changePassword").on("click", function(){
  tmpUsername = $("#utilityUsername")[0].value
  tmpPassword = $("#utilityPassword")[0].value
  $.ajax({
    type: "PUT",
    url: updateUrl+tmpUsername,
    headers: {"X-Auth-Token": sessionID},
    data: {username: tmpUsername, password: tmpPassword}
  }).done(function(){
    $("#changePasswordMessage").text(tmpUsername + "'s password was updated")
  }).fail(function(){
    $("#changePasswordMessage").text("Error!")
  })
})


$("#delete").on("click", function(){
  tmpUsername = $("#utilityUsername")[0].value
  $.ajax({
    type: "DELETE",
    url: updateUrl+tmpUsername,
    headers: {"X-Auth-Token": sessionID},
  }).fail(function(data){
    if(data.statusText){
      $("#deleteMessage").text(tmpUsername + " was removed")
    }else{
      $("#deleteMessage").text("Error!")
    }
  })
})
