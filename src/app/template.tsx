import { ViewTransition } from "react";
import { Choreography } from "@/components/motion/Choreography";

/**
 * Templates remount on every navigation, so enter/exit fire per route.
 * The "page" class maps to a short fade + lift in globals.css. Browser
 * back/forward and unsupported browsers simply swap content instantly.
 *
 * Choreography (GSAP scroll effects) lives here so it is rebuilt per route.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>
        {children}
        <Choreography />
      </div>
    </ViewTransition>
  );
}
