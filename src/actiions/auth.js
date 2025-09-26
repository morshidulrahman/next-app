"use server";

const login = async ({ email, password }) => {
  const res = await fetch(`http://localhost:4000/api/v1/auth/login/employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();
  return data;
};

export { login };

const fetchtodo = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then((response) => response.json())
    .then((res) => res)
    .catch((error) => console.error("Error fetching todo:", error));
  return res;
};

export { fetchtodo };
