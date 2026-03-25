export const empresaStorage = {
  getEmpresa: () => {
    const empresa = localStorage.getItem("empresa")
    return empresa ? JSON.parse(empresa) : null
  },

  setEmpresa: (empresa: any) => {
    localStorage.setItem("empresa", JSON.stringify(empresa))
  },

  removeEmpresa: () => {
    localStorage.removeItem("empresa")
  },

  getToken: () => localStorage.getItem("token"),

  setToken: (token: string) => {
    localStorage.setItem("token", token)
  },

  removeToken: () => {
    localStorage.removeItem("token")
  },

  clear: () => {
    localStorage.removeItem("empresa")
    localStorage.removeItem("token")
  }
}