// Animation class helpers
export const fadeUp = (visible: boolean, delay = 0) =>
  visible ? `animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both` : "opacity-0";

export const fadeIn = (visible: boolean) =>
  visible ? "animate-in fade-in duration-700 fill-mode-both" : "opacity-0";
