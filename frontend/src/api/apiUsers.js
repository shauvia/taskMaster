const myApi = "/api";

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
