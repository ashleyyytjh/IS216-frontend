import { useEffect, useState } from "react";

export function getAvatarFallback(fullName: string): string {
  if (!fullName) return ""
  const parts = fullName.trim().split(/\s+/)
  const initials = parts.slice(0, 2).map(p => p[0].toUpperCase()).join("")
  return initials
}

export function useIsSmall() {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsSmall(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return isSmall;
}