import { useState, useEffect } from "react";

export default function useBreakpoint() {
  const [bp, setBp] = useState("desktop");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setBp("mobile");
      else if (window.innerWidth < 1024) setBp("tablet");
      else setBp("desktop");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return bp;
}