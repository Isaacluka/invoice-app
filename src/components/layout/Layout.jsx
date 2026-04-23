import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children, dark, toggleDark, bp }) {
  const isDesktop = bp === "desktop";
  const navH = isDesktop ? 0 : 72;
  const leftW = isDesktop ? 80 : 0;

  return (
    <>
      {isDesktop ? (
        <Sidebar dark={dark} onToggle={toggleDark} />
      ) : (
        <Navbar dark={dark} onToggle={toggleDark} />
      )}

      <main
        style={{
          marginLeft: leftW,
          marginTop: navH,
          minHeight: `calc(100vh - ${navH}px)`,
          padding:
            bp === "mobile"
              ? "32px 24px"
              : isDesktop
              ? "48px 40px"
              : "40px 48px",
          maxWidth: `calc(100vw - ${leftW}px)`,
        }}
      >
        {children}
      </main>
    </>
  );
}