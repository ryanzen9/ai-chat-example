import { Button } from "@shared/ui/button";
import router from "../app/router";

function Home() {
  const message = "Push the button go to ai chat page";

  async function handlerSubmit() {
    router.navigate("/chat");
  }

  return (
    <div className="min-h-dvh bg-background p-6 text-foreground">
      <div className="rounded-md border border-border bg-card p-6 text-card-foreground">
        <h1 className="mb-4 text-2xl font-bold">{message}</h1>
        <Button type="button" onClick={handlerSubmit}>
          Go to talk with AI
        </Button>
      </div>
    </div>
  );
}

export default Home;
