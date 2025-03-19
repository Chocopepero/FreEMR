'use client';

import withAuth from '../components/AuthComponent';

function ScenarioPage() {
    return (
            <div className="w-full h-xl bg-red-300 p-4">
                Test
            </div>
    );
}

export default withAuth(ScenarioPage);