async function fetchData() {
    const res = await fetch(`${process.env.APP_BACKEND_URL}/api/application-data`, {
      cache: "no-store", // Ensure fresh data on each load
    });
    return res.json();
  }
  
  export default async function ApplicationContent() {
    const data = await fetchData();
  
    return (
      <div>
        <h2>{data.appName}</h2>
        <p>{data.description}</p>
      </div>
    );
  }
  