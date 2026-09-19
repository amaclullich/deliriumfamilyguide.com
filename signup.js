(function () {
  var form = document.getElementById("chapter-signup");
  if (!form || !window.fetch || !window.URLSearchParams || !window.FormData) {
    return;
  }
  var input = form.querySelector("input[type=email]");
  var button = form.querySelector("button[type=submit]");
  var message = form.querySelector(".signup-message");

  function show(text, state) {
    message.textContent = text;
    message.setAttribute("data-state", state);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!input.value || !input.checkValidity()) {
      show("Please enter a valid email address.", "error");
      input.focus();
      return;
    }
    button.disabled = true;
    show("Sending\u2026", "pending");
    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams(new FormData(form))
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data && data.success) {
          form.reset();
          show("Thank you. Chapter 1 is on its way to your inbox. If it has not arrived within a few minutes, please check your spam or junk folder.", "success");
        } else {
          button.disabled = false;
          show("Please check your email address and try again.", "error");
        }
      })
      .catch(function () {
        button.disabled = false;
        show("The form could not be sent. Please try again, or email alasdair@the4at.com.", "error");
      });
  });
})();
