import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../../app/(auth)/login/page";
import { signIn } from "next-auth/react";
import '@testing-library/jest-dom';


// Mocks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("LoginPage", () => {
  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /login/i })).toHaveLength(2);
  });

  
});
