import { UserRole } from "../src/business/entities/User"
import { UserBusiness } from "../src/business/UserBusiness"

let idGenerator = { generate: jest.fn() } as any

let hashManager = {
   hash: jest.fn(),
   compare: jest.fn(() => false),
} as any

let authenticator = {
   generateToken: jest.fn((data: any) => "token"),
} as any

let userDatabase = {
   createUser: jest.fn(),
   getUserByEmail: jest.fn(() => ({}))
} as any

let userBusiness = new UserBusiness(
   idGenerator,
   hashManager,
   authenticator,
   userDatabase
)

describe("Login", () => {

   test("Should throw an error", async () => {

      expect.assertions(2)

      try {
         await userBusiness
            .getUserByEmail({
               email: "astrodev@lbn.com.br",
               password: "123546"
            })
      } catch (error) {
         console.log(error);
         
         expect(error.statusCode).toEqual(401)
         expect(error.message).toEqual("Invalid credentials!")
      }
   })
})