(() => {
  const measurementId = "G-HEXFX95CM1";
  const consentKey = "dfg-analytics-consent";
  const analyticsCookieNames = ["_ga", `_ga_${measurementId.replace("G-", "")}`];

  function setAnalyticsDisabled(disabled) {
    window[`ga-disable-${measurementId}`] = disabled;
  }

  function clearAnalyticsCookies() {
    const domains = ["", "deliriumfamilyguide.com", ".deliriumfamilyguide.com"];

    analyticsCookieNames.forEach((name) => {
      domains.forEach((domain) => {
        const domainAttribute = domain ? `; domain=${domain}` : "";
        document.cookie = `${name}=; Max-Age=0; path=/${domainAttribute}; SameSite=Lax; Secure`;
      });
    });
  }

  function stopAnalytics() {
    setAnalyticsDisabled(true);
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    document.querySelectorAll(`script[data-ga-id="${measurementId}"]`).forEach((script) => script.remove());
    clearAnalyticsCookies();
    window.setTimeout(clearAnalyticsCookies, 100);
  }

  function startAnalytics() {
    if (document.querySelector(`script[data-ga-id="${measurementId}"]`)) return;

    setAnalyticsDisabled(false);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.dataset.gaId = measurementId;
    document.head.appendChild(script);

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
    else stopAnalytics();
  }

  function showChoice(fromSettings = false, returnFocus = null) {
    document.querySelector(".analytics-consent")?.remove();
    const currentChoice = window.localStorage.getItem(consentKey);
    const banner = document.createElement("section");
    banner.className = "analytics-consent";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Analytics preference");
    const message = fromSettings && currentChoice
      ? `Google Analytics is currently ${currentChoice === "accepted" ? "on" : "off"}. You can change your choice here.`
      : "We would like to use optional Google Analytics to understand which pages are helpful. It starts only if you agree.";
    banner.innerHTML = `
      <p>${message}</p>
      <div class="analytics-consent-actions">
        <button class="button button-primary" type="button" data-choice="accepted">Accept analytics</button>
        <button class="button button-secondary" type="button" data-choice="declined">No thanks</button>
        ${fromSettings ? '<button class="analytics-consent-close" type="button" data-close>Keep current choice</button>' : ""}
        <a href="/privacy.html">Privacy details</a>
      </div>`;
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-choice]");
      if (button) saveChoice(button.dataset.choice);
      if (event.target.closest("button[data-close]")) {
        banner.remove();
        returnFocus?.focus();
      }
    });
    document.body.appendChild(banner);
    if (fromSettings) banner.querySelector("button")?.focus();
  }

  document.addEventListener("click", (event) => {
    const settingsButton = event.target.closest("[data-analytics-settings]");
    if (settingsButton) showChoice(true, settingsButton);
  });

  const choice = window.localStorage.getItem(consentKey);
  if (choice === "accepted") startAnalytics();
  else {
    stopAnalytics();
    if (choice !== "declined") showChoice();
  }
})();
