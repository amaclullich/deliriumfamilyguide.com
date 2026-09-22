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

  let memoryChoice = null;

  function readChoice() {
    try { return memoryChoice || window.localStorage.getItem(consentKey); }
    catch (_) { return memoryChoice; }
  }

  function saveChoice(choice) {
    memoryChoice = choice;
    if (choice === "accepted") startAnalytics();
    else stopAnalytics();
    try { window.localStorage.setItem(consentKey, choice); } catch (_) {}
    document.querySelector(".analytics-consent")?.remove();
  }

  function showChoice(fromSettings = false, returnFocus = null) {
    document.querySelector(".analytics-consent")?.remove();
    const currentChoice = readChoice();
    const isOff = currentChoice === "declined";
    const banner = document.createElement("section");
    banner.className = "analytics-consent";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Analytics preference");
    const message = fromSettings
      ? `Google Analytics is currently ${isOff ? "off" : "on"}. You can change your choice here.`
      : "Analytics is on. We use limited Google Analytics to produce aggregate statistics and improve this website. It is not used for advertising or Google Signals. Google receives information such as pages viewed, approximate location, browser or device type and referring website. You can turn analytics off now or at any time.";
    banner.innerHTML = `
      <p>${message}</p>
      <div class="analytics-consent-actions">
        <button class="button button-primary" type="button" data-choice="accepted">${isOff ? "Turn analytics on" : "Keep analytics on"}</button>
        <button class="button button-secondary" type="button" data-choice="declined">${isOff ? "Keep analytics off" : "Turn analytics off"}</button>
        ${fromSettings ? '<button class="analytics-consent-close" type="button" data-close>Keep current choice</button>' : ""}
        <a href="/privacy.html">Privacy details</a>
      </div>`;
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-choice]");
      if (button) {
        saveChoice(button.dataset.choice);
        returnFocus?.focus();
      }
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

  window.addEventListener("storage", (event) => {
    if (event.key !== consentKey && event.key !== null) return;
    memoryChoice = null;
    const nextChoice = readChoice();
    if (nextChoice === "accepted") startAnalytics();
    else stopAnalytics();
    document.querySelector(".analytics-consent")?.remove();
  });

  // Limited analytics is on by default under the UK statistical purposes
  // exception (PECR as amended by the Data (Use and Access) Act 2025).
  // A saved "declined" choice is honoured; a first visit shows the notice.
  const choice = readChoice();
  if (choice === "declined") stopAnalytics();
  else {
    startAnalytics();
    if (choice !== "accepted") showChoice();
  }
})();
