import { Suspense } from "react";
import LoginPage from "./component";

export default function Application() {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <LoginPage />  
      </Suspense>
    </div>
  );
}
