import { Suspense } from "react";
import ApplicationContent from "./content";

export default function Application() {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <ApplicationContent />
      </Suspense>
    </div>
  );
}
