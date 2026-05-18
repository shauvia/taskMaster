const myApi = import.meta.env.VITE_API_URL || "/api"; //Switching from a hard‑coded value to a dynamic environment‑based value.

export async function getAllUsers() {
  try {
    const response = await fetch(myApi + "/users", {
      credentials: "include",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
