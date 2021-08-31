// $.get("http://ec2-3-16-123-134.us-east-2.compute.amazonaws.com/api/users").done(function(users){
//   console.log(users)
// })

// $.ajax({
//   url: "http://ec2-3-16-123-134.us-east-2.compute.amazonaws.com/api/users",
//   dataType: "json",
//   headers: {headers: "X-Auth-Token"},
//   data: {data: "here"}
// }).done(function(data){
//   console.log(data)
// })
for (var i = 0; i < 1000; i++){
  $.post({
    url: "http://ec2-3-16-123-134.us-east-2.compute.amazonaws.com/api/users/delete",
    dataType: "json",
    data: {username: "123 "+String.fromCharCode(i), password: "passsy"}
  }).done(function(data){
    console.log(data)
  }).fail(function(response){
    console.log(response.responseText)
  })
}
