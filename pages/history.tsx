import Router, { useRouter } from "next/router";
import { useEffect } from "react";

function App() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/history/0");
  }, [router]);

  return null;
}

export default App;
