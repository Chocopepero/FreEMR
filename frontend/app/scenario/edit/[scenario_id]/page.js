'use client';

import { Suspense } from "react";
import ScenarioCreation from "../../ScenarioCreation";
import withAuth from "@/app/components/AuthComponent";
import { useParams } from 'next/navigation'

function Application() {
  const param = useParams().scenario_id;
  return (
    <div className="flex flex-col flex-grow h-full">
      <Suspense fallback={<p>Loading...</p>}>
        <ScenarioCreation scenarioId={param} />
      </Suspense>
    </div>
  );
}

export default withAuth(Application);