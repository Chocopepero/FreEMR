import { Suspense } from "react";
import ApplicationContent from "./content";

export default function Application() {
  return (
    <div>
      <h1>Application</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <ApplicationContent />
      </Suspense>
    </div>
  );
}
