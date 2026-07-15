import { Outlet } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";
import { CookieConsent } from "./CookieConsent";
import { Footer } from "./Footer";
import { Announcement, Header } from "./Header";

export function AppShell() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Sari la conținut
      </a>
      <Announcement />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <CookieConsent />
    </>
  );
}
