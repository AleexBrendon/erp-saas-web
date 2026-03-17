import { login } from "../../api/auth.service"

async function handleLogin() {
  const response = await login({
    email: "admin@email.com",
    password: "123456"
  })

  console.log(response)
}