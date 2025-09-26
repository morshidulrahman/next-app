import { fetchtodo } from "@/actiions/auth";

const page = async () => {
  const todo = await fetchtodo();

  console.log(todo);
  return <div>page</div>;
};

export default page;
