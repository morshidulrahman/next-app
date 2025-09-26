import { fetchtodo } from "@/actiions/auth";
import Todo from "@/components/Todo";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

export default async function TodoPage() {
  const queryClient = new QueryClient();

  // Server-side এ fetch করে react-query cache fill করবো
  await queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: fetchtodo,
  });

  // এখন cache থেকে ডাটা পেতে getQueryData() ইউজ করো
  const todosData = queryClient.getQueryData(["todos"]);
  console.log("Fetched Todos:", todosData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Todo />
    </HydrationBoundary>
  );
}
