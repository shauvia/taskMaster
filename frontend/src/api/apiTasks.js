const myApi = "/api";

export async function getTasks() {
  try {
    const response = await fetch(myApi + "/tasks", { credentials: "include" });
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

export async function updateTask(task, taskId) {
  console.log("updateTask", task);
  const response = await fetch(myApi + "/tasks/" + taskId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
    credentials: "include",
  });

  console.log("response", response);

  if (!response.ok) {
    console.log("response", response);
    const errorData = await response.json();
    throw Error(errorData.error);
  }
  const result = await response.json();
  return result;
}

export async function getTask(taskId) {
  const response = await fetch(myApi + "/tasks/" + taskId, {
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw Error(errorData.error);
  }
  const result = await response.json();
  return result;
}

export async function updateTaskCompletion(taskId, isCompleted) {
  const response = await fetch(myApi + "/tasks/" + taskId + "/complete", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_completed: isCompleted }),
    credentials: "include",
  });

  if (!response.ok) {
    console.log("response", response);
    const errorData = await response.json();
    throw Error(errorData.error);
  }

  const result = await response.json();
  return result;
}

export async function deleteTask(taskId) {
  const response = await fetch(myApi + "/tasks/" + taskId, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw Error(errorData.error);
  }

  const result = await response.json();
  return result;
}
