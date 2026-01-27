const myApi = "/api";

// credentials: "include" ??????

export async function getTasks() {
  try {
    const response = await fetch(myApi + "/tasks");
    console.log("get response", response);
    const result = await response.json();
    console.log("getTasks result", result);
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function createTask(task) {
  const response = await fetch(myApi + "/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw Error(errorData.error);
  }
  const result = await response.json();
  return result;
}
