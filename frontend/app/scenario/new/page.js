'use client';

import { Suspense } from "react";
import ApplicationContent from "./content";
import withAuth from "@/app/components/AuthComponent";

function Application() {
  return (
    <div className="flex flex-col flex-grow h-full">
      <Suspense fallback={<p>Loading...</p>}>
        <ApplicationContent />
      </Suspense>
    </div>
  );
}

export default withAuth(Application);