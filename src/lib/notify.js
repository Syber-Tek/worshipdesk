import { toast } from "sonner";

// Combined toast + native OS notification.
// The native notification only fires when the control window is not focused
// (minimized/background), so the operator isn't double-toasted while working.
export default function appNotify({ title, body, type = "info" }) {
  const text = body || title || "";
  if (type === "success") toast.success(text);
  else if (type === "error") toast.error(text);
  else toast.info(text);

  if (
    window.api &&
    window.api.notifyNative &&
    typeof document !== "undefined" &&
    !document.hasFocus()
  ) {
    try {
      window.api.notifyNative({ title, body: text });
    } catch {
      // Native notifications are best-effort; never break the flow.
    }
  }
}