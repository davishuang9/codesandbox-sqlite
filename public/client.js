$(function () {
  $.get("/users", function (users) {
    users.forEach(function (user) {
      $("<li></li>").text(`${user.name} ${user.age}`).appendTo("ul#users");
    });
  });
});
