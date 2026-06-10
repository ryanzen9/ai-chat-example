import { Button, LayerCard } from "@cloudflare/kumo";
import router from "../app/router";

function Home() {
  const message = "Push the button go to ai chat page";

  async function handlerSubmit() {
    router.navigate("/chat");
  }

  return (
    <>
      <LayerCard className="rounded-lg p-6">
        <h1 className="mb-4 text-2xl font-bold">{message}</h1>
        <Button variant="primary" onClick={handlerSubmit}>
          Go to talk with AI
        </Button>
      </LayerCard>
    </>
  );
}

export default Home;
