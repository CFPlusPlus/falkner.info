import { expect, test, type Page } from "@playwright/test";
import { readFile, stat } from "node:fs/promises";

const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (/CSP:|Content Security Policy/i.test(message.text()))
      errors.push(message.text());
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      console.error(`CSP: ${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  await page.route("https://api.mcsrvstat.us/**", (route) =>
    route.fulfill({ json: { online: false } }),
  );
});

test.afterEach(async ({ page }) => {
  expect(
    runtimeErrors.get(page),
    "Keine JavaScript- oder CSP-Verstöße",
  ).toEqual([]);
});

async function expectNoOverflow(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
}

for (const width of [320, 1440]) {
  for (const [url, heading, status] of [
    ["/", "Schön, dass du hier bist!", 200],
    ["/datenschutz/", "Datenschutzerklärung", 200],
    ["/impressum/", "Impressum", 200],
    ["/fehlt-im-build", "Seite nicht gefunden", 404],
  ] as const) {
    test(`${url} bei ${width}px: Inhalt, Linkname, Reflow und CSP`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(url);
      expect(response?.status()).toBe(status);
      const headers = await readFile("dist/_headers", "utf8");
      expect(response?.headers()["content-security-policy"]).toBe(
        headers.match(/Content-Security-Policy: (.+)/)?.[1],
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      await expect(page.locator("#siteHeader a").first()).toHaveAccessibleName(
        /^falkner\.info/,
      );
      await expectNoOverflow(page);
      if (url === "/") {
        await expect(
          page.getByRole("link", { name: "Projekte ansehen", exact: true }),
        ).toHaveAttribute("href", "#projects");
      }
      if (width === 320 || url === "/") {
        await page.screenshot({
          animations: "disabled",
          path: testInfo.outputPath("seite.png"),
        });
      }
    });
  }
}

test("Datenschutz bleibt bei 200 Prozent Schriftgröße lesbar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/datenschutz/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  const heading = page.getByRole("heading", { level: 1 });
  const bounds = await heading.boundingBox();
  expect(bounds?.width).toBeLessThanOrEqual(280);
  expect(await heading.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
});

test("Menü: Tastatur, Fokus, Escape, Linkwahl und Desktopwechsel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Menü öffnen" });
  await button.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Navigation" });
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveAttribute(
    "data-scroll-lock",
    "true",
  );
  await page.keyboard.press("Tab");
  await expect(page.locator("[data-mobile-link]").first()).toBeFocused();
  await page.locator("[data-mobile-link]").last().focus();
  await page.keyboard.press("Tab");
  await expect(dialog.locator("a").first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("[data-mobile-link]").last()).toBeFocused();
  await page
    .locator("footer a")
    .first()
    .evaluate((el: HTMLAnchorElement) => el.focus());
  await expect(page.locator("[data-mobile-link]").last()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Menü öffnen" })).toBeFocused();
  await expect(page.locator("body")).not.toHaveAttribute("data-scroll-lock");
  await button.click();
  await page.locator('[data-mobile-link][href="#projects"]').click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#mobileMenu")).toBeHidden();
  await button.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("#mobileMenu")).toBeHidden();
  await expect(page.locator("body")).not.toHaveAttribute("data-scroll-lock");
  await expect(page.locator("#siteHeader a").first()).toBeFocused();
});

for (const width of [320, 1440]) {
  test(`Lightbox bei ${width}px: Modalität, Bildwechsel, Scrollsperre und Fokus`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const opener = page.locator("[data-lb-open]").first();
    const count = await page.locator("#lb-pc [data-lb-open]").count();
    await opener.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Bildanzeige" });
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((el) => el.matches(":modal"))).toBe(true);
    await expect(
      page.getByRole("button", { name: "Schließen", exact: true }),
    ).toBeFocused();
    await page
      .locator("footer a")
      .first()
      .evaluate((el: HTMLAnchorElement) => el.focus());
    await expect(
      page.getByRole("button", { name: "Schließen", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(
      page.getByRole("button", { name: "Nächstes Bild" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Schließen", exact: true }),
    ).toBeFocused();
    const firstSrc = await page
      .locator("#lb-pc [data-lb-img]")
      .getAttribute("src");
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("#lb-pc [data-lb-count]")).toHaveText(
      `${count} / ${count}`,
    );
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#lb-pc [data-lb-count]")).toHaveText(
      `1 / ${count}`,
    );
    await page.getByRole("button", { name: "Nächstes Bild" }).click();
    await expect(page.locator("#lb-pc [data-lb-img]")).not.toHaveAttribute(
      "src",
      firstSrc!,
    );
    await page.getByRole("button", { name: "Vorheriges Bild" }).click();
    await expect(page.locator("#lb-pc [data-lb-img]")).toHaveAttribute(
      "src",
      firstSrc!,
    );
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    const scrollY = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 600);
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    await expectNoOverflow(page);
    await expect
      .poll(() =>
        page
          .locator("#lb-pc [data-lb-img]")
          .evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await page.screenshot({
      animations: "disabled",
      path: testInfo.outputPath("lightbox.png"),
    });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(page.locator("body")).not.toHaveAttribute("data-scroll-lock");
    for (const closeVia of ["button", "overlay"] as const) {
      await opener.click();
      if (closeVia === "button")
        await page
          .getByRole("button", { name: "Schließen", exact: true })
          .click();
      else
        await page
          .locator("#lb-pc [data-lb-overlay]")
          .click({ position: { x: 2, y: 2 } });
      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
      expect(await page.evaluate(() => window.__scrollLockCount)).toBe(0);
    }
  });
}

test("Scroll-Lock erhält eine zweite aktive Sperre", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.__scrollLock?.lock());
  await page.locator("[data-lb-open]").first().click();
  await page.keyboard.press("Escape");
  await expect(page.locator("body")).toHaveAttribute(
    "data-scroll-lock",
    "true",
  );
  expect(await page.evaluate(() => window.__scrollLockCount)).toBe(1);
  await page.evaluate(() => window.__scrollLock?.unlock());
  await expect(page.locator("body")).not.toHaveAttribute("data-scroll-lock");
});

test("404 zeigt nur den angefragten Pfad sicher als Text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  const pathname =
    "/fehlt/" +
    encodeURIComponent("<img src=x onerror=alert(1)>") +
    "/" +
    "x".repeat(180);
  const response = await page.goto(`${pathname}?privat=1#fragment`);
  expect(response?.status()).toBe(404);
  await expect(page.locator("[data-requested-path]")).toHaveText(pathname);
  await expect(page.locator("[data-requested-path] *")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expectNoOverflow(page);
});

test("Aktive Navigation hat Keyframes und respektiert reduzierte Bewegung", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#about").scrollIntoViewIfNeeded();
  const active = page.locator('a.navlink[data-active="true"]').first();
  await expect(active).toBeVisible();
  const animation = await active.evaluate((el) => {
    const name = getComputedStyle(el, "::after").animationName;
    const keyframes = [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .filter(
        (rule): rule is CSSKeyframesRule => rule instanceof CSSKeyframesRule,
      );
    return { name, exists: keyframes.some((rule) => rule.name === name) };
  });
  expect(animation.name).toContain("line-in");
  expect(animation.exists).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await active.evaluate(
      (el) => getComputedStyle(el, "::after").animationName,
    ),
  ).toBe("none");
});

for (const scale of [1, 2, 3]) {
  test(`Navbar-Logo: passende Variante für DPR ${scale}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      deviceScaleFactor: scale,
      viewport: { width: 320, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4322/");
    const logo = page.locator("#siteHeader img");
    await expect(logo).toHaveJSProperty("complete", true);
    expect(
      await logo.evaluate(
        (el: HTMLImageElement) => new URL(el.currentSrc).pathname,
      ),
    ).toBe(`/images/navbar-logo-${28 * scale}.webp`);
    expect((await logo.boundingBox())?.width).toBe(28);
    expect(
      (await stat(`dist/images/navbar-logo-${28 * scale}.webp`)).size,
    ).toBeLessThan(5000);
    await context.close();
  });
}

for (const [name, data, expectedValue, expectedText] of [
  [
    "online",
    { online: true, players: { online: 3, max: 20 } },
    "3/20",
    "online",
  ],
  ["offline", { online: false }, "0", "offline"],
  ["unbekannt", {}, "-", "nicht verfuegbar"],
  ["HTTP-Fehler", null, "-", "nicht verfuegbar"],
] as const) {
  test(`Minecraft: ${name}, Abfrage erst bei Sichtbarkeit`, async ({
    page,
  }) => {
    let requests = 0;
    await page.route("https://api.mcsrvstat.us/**", (route) => {
      requests++;
      return data === null
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.fulfill({ json: data });
    });
    await page.goto("/");
    expect(requests).toBe(0);
    await page.locator("[data-mc-status]").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-mc-value]")).toHaveText(expectedValue);
    await expect(page.locator("[data-mc-text]")).toHaveText(expectedText);
    expect(requests).toBe(1);
  });
}

test("Minecraft: Timeout sowie Polling nur bei sichtbarem Status", async ({
  page,
}) => {
  let requests = 0;
  await page.clock.install();
  await page.route("https://api.mcsrvstat.us/**", (route) => {
    requests++;
    if (requests === 1)
      return new Promise<void>((resolve) =>
        route
          .request()
          .response()
          .then(() => resolve()),
      );
    return route.fulfill({
      json: { online: true, players: { online: 2, max: 10 } },
    });
  });
  await page.goto("/");
  await page.locator("[data-mc-status]").scrollIntoViewIfNeeded();
  await expect.poll(() => requests).toBe(1);
  await page.clock.fastForward(10_001);
  await expect(page.locator("[data-mc-text]")).toHaveText("nicht verfuegbar");
  await page.clock.fastForward(300_000);
  await expect(page.locator("[data-mc-value]")).toHaveText("2/10");
  await page.locator("#top").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const box = document
      .querySelector("[data-mc-status]")!
      .getBoundingClientRect();
    return box.top >= window.innerHeight;
  });
  const pausedRequests = requests;
  await page.clock.fastForward(600_000);
  expect(requests).toBe(pausedRequests);
});
