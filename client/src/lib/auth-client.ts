  import { createAuthClient } from "better-auth/react"
  import { bearerClient } from "better-auth/react/plugins/bearer"
  
  export const authClient = createAuthClient({
      /** The base URL of the server (optional if you're using the same domain) */
      baseURL: `${import.meta.env.VITE_API_URL}`,
      plugins: [bearerClient()]
  })
  
  export const { 
      signIn, 
      signUp, 
      useSession, 
      signOut,
      updateUser,
      changePassword,
      changeEmail,
      listAccounts,
      getSession,
  } = authClient
