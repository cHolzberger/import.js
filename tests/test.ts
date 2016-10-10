import { suite, test, slow, timeout, skip, only } from "mocha-typescript";

@suite("mocha typescript")
class Basic {

    @test("should pass when asserts are fine")
    asserts_pass() {
    }
  }
