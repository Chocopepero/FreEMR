'use client';

import { Suspense } from "react";
import ScenarioCreation from "../ScenarioCreation";
import withAuth from "@/app/components/AuthComponent";

function Application() {
  return (
    <div className="flex flex-col flex-grow h-full">
      <Suspense fallback={<p>Loading...</p>}>
        <ScenarioCreation />
      </Suspense>
    </div>
  );
}

export default withAuth(Application);