export const authStorage = {
  getToken: () => localStorage.getItem("token"),

  setToken: (token: string) => {
    localStorage.setItem("token", token)
  },

  removeToken: () => {
    localStorage.removeItem("token")
  },

  setUser: (user: any) => {
    localStorage.setItem("user", JSON.stringify(user))
  },

  getUser: () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  clear: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },
}