import { COLORS } from "../../utils/helpers";
import avatar from "../../assets/avatar.jpg";


export default function Sidebar({ dark, onToggle }) {
  return (
    <nav
      style={{
        width: 80,
        height: "100vh",
        background: "#1E2139",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        borderRadius: "0 20px 20px 0",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          background: COLORS.purple,
          borderRadius: "0 20px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "50%",
            background: COLORS.purpleL,
            borderRadius: "20px 0 0 0",
          }}
        />


        <div style={{ position: "relative", zIndex: 1 }}>
          <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6942 0L20 18.7078L29.3058 4.74611e-08C35.6645 3.34856 40 10.0219 40 17.7078C40 28.7535 31.0457 37.7078 20 37.7078C8.9543 37.7078 0 28.7535 0 17.7078C0 10.0219 4.33546 3.34856 10.6942 0Z" fill="white"/>
          </svg>

          {/* <svg width="28" height="26" viewBox="0 0 28 26" fill="none">
            <path
              d="M20.513 0H7.487C6.5 0 5.598.603 5.234 1.522L0 13l5.234 11.478C5.598 25.397 6.5 26 7.487 26h13.026c.987 0 1.889-.603 2.253-1.522L28 13 22.766 1.522C22.402.603 21.5 0 20.513 0z"
              fill="#7C5DFA"
            />
            <path
              d="M14 5.5C10.686 5.5 8 8.186 8 11.5s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 9a3 3 0 110-6 3 3 0 010 6z"
              fill="white"
            />
          </svg> */}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          paddingBottom: 24,
        }}
      >
        <button
          onClick={onToggle}
          aria-label="Toggle dark mode"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            borderRadius: 8,
          }}
        >
          {dark ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="4"
                stroke="#858BB2"
                strokeWidth="1.5"
              />
              <path
                d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42"
                stroke="#858BB2"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M19 10.79A9 9 0 1 1 9.21 1a7 7 0 0 0 9.79 9.79z"
                stroke="#858BB2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <div style={{ width: 64, height: 1, background: "#494E6E" }} />

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#7C5DFA,#9277FF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #858BB2",
            cursor: "pointer",
          }}
        >
          <img 
            src={avatar} 
            alt="Avatar" 
            srcset=""
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid white",
            }} 
           />
          {/* <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>
            JD
          </span> */}
        </div>
      </div>
    </nav>
  );
}