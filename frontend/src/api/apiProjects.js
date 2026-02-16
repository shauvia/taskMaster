const myApi = "/api";

export async function getProjects() {
  try {
    const response = await fetch(myApi + "/projects", {
      credentials: "include",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function createProject(name, description) {
  try {
    const response = await fetch(myApi + "/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
      credentials: "include",
    });
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw Error(errorData.error);
    // }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProjectTask(task, projectId, taskId) {
  try {
    const response = await fetch(
      myApi + "/projects/" + projectId + "/tasks/" + taskId,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
        credentials: "include",
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating project task:", error);
    throw error;
  }
}

export async function createProjectTask(task, projectId) {
  console.log("createProjectTask, task", task);
  try {
    const response = await fetch(myApi + "/projects/" + projectId + "/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
      credentials: "include",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating project task:", error);
    throw error;
  }
}

export async function getAllProjectTasks(projectId) {
  try {
    const response = await fetch(myApi + "/projects/" + projectId + "/tasks", {
      credentials: "include",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    throw error;
  }
}

export async function getAllProjectMembers(projectId) {
  try {
    const response = await fetch(
      myApi + "/projects/" + projectId + "/members",
      { credentials: "include" },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching project members:", error);
    throw error;
  }
}

export async function getProject(projectId) {
  try {
    const response = await fetch(myApi + "/projects/" + projectId, {
      credentials: "include",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}
