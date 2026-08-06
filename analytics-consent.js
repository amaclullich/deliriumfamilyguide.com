(() => {
  const measurementId = "G-HEXFX95CM1";
  const consentKey = "dfg-analytics-consent";

  function startAnalytics() {
    if (document.querySelector(`script[data-ga-id="${measurementId}"]`)) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.dataset.gaId = measurementId;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }

  function saveChoice(choice) {
    window.localStorage.setItem(consentKey, choice);
    document.querySelector(".analytics-consent")?.remove();
    if (choice === "accepted") startAnalytics();
  }

  function showChoice() {
    const banner = document.createElement("section");
    banner.className = "analytics-consent";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Analytics preference");
    banner.innerHTML = `
      <p>We would like to use optional Google Analytics to understand which pages are helpful. It starts only if you agree.</p>
      <div class="analytics-consent-actions">
        <button class="button button-primary" type="button" data-choice="accepted">Accept analytics</button>
        <button class="button button-secondary" type="button" data-choice="declined">No thanks</button>
        <a href="/privacy.html">Privacy details</a>
      </div>`;
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-choice]");
      if (button) saveChoice(button.dataset.choice);
    });
    document.body.appendChild(banner);
  }

  const choice = window.localStorage.getItem(consentKey);
  if (choice === "accepted") startAnalytics();
  else if (choice !== "declined") showChoice();
})();
