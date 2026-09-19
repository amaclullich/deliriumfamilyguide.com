(function () {
  var form = document.getElementById("chapter-signup");
  if (!form || !window.fetch || !window.URLSearchParams || !window.FormData) return;
  var input = form.querySelector("input[type=email]");
  var button = form.querySelector("button[type=submit]");
  var message = form.querySelector(".signup-message");
  var pending = false;
  var complete = false;

  function show(text, state) {
    message.textContent = text;
    message.setAttribute("data-state", state);
  }

  input.addEventListener("input", function () {
    input.removeAttribute("aria-invalid");
    if (complete) {
      complete = false;
      button.disabled = false;
      button.textContent = "Send me Chapter 1";
      show("", "");
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (pending || complete) return;
    input.value = input.value.trim();
    if (!input.value || !input.checkValidity()) {
      input.setAttribute("aria-invalid", "true");
      show("Please enter a valid email address.", "error");
      input.focus();
      return;
    }
    input.removeAttribute("aria-invalid");
    pending = true;
    button.disabled = true;
    form.setAttribute("aria-busy", "true");
    show("Sending…", "pending");
    var controller = window.AbortController ? new AbortController() : null;
    var timer;
    var timeout = new Promise(function (_, reject) {
      timer = window.setTimeout(function () {
        reject(new Error("timeout"));
        if (controller) controller.abort();
      }, 15000);
    });
    var request = fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams(new FormData(form)),
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (!response.ok) throw new Error(response.status === 429 ? "rate-limit" : "service");
      return response.json();
    });
    Promise.race([request, timeout])
      .then(function (data) {
        if (data && data.success === true) {
          complete = true;
          form.reset();
          button.textContent = "Request received";
          show("Thank you. Please check your inbox for Chapter 1. If it has not arrived within a few minutes, check your spam or junk folder, or email alasdair@the4at.com.", "success");
        } else {
          show("Your request was not accepted. Please check your email address and try again, or email alasdair@the4at.com.", "error");
        }
      })
      .catch(function (error) {
        if (error.message === "timeout") {
          show("The response is taking longer than expected. Please check your inbox before trying again, or email alasdair@the4at.com.", "error");
        } else if (error.message === "rate-limit") {
          show("There have been too many requests. Please wait a few minutes before trying again, or email alasdair@the4at.com.", "error");
        } else {
          show("We could not confirm your request. Please check your inbox before trying again, or email alasdair@the4at.com.", "error");
        }
      })
      .then(function () {
        window.clearTimeout(timer);
        pending = false;
        form.setAttribute("aria-busy", "false");
        button.disabled = complete;
      });
  });
  form.hidden = false;
  document.getElementById("signup-fallback").hidden = true;
})();
