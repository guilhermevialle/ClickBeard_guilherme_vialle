import { describe, expect, it } from "vitest";
import { ApplicationError, ApplicationErrorProps } from "./application.error";

describe("ApplicationError", () => {
  it("should set the correct properties", () => {
    const props: ApplicationErrorProps = {
      message: "Something went wrong",
      errorCode: "ERR_TEST",
      statusCode: 400,
    };

    const error = new ApplicationError(props);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApplicationError);
    expect(error.name).toBe("ApplicationError");
    expect(error.message).toBe("Something went wrong");
    expect(error.errorCode).toBe("ERR_TEST");
    expect(error.statusCode).toBe(400);
  });

  it("should return correct JSON from toJSON", () => {
    const props: ApplicationErrorProps = {
      message: "Another error",
      errorCode: "ERR_ANOTHER",
      statusCode: 500,
    };

    const error = new ApplicationError(props);
    const json = error.toJSON();

    expect(json).toEqual({
      message: "Another error",
      errorCode: "ERR_ANOTHER",
      statusCode: 500,
    });
  });
});
