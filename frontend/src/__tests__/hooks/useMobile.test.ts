import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile"; // ajustá la ruta si hace falta

describe("useIsMobile", () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches:
        eval(query.replace("(max-width:", "").replace("px)", "")) >=
        window.innerWidth,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.innerWidth = originalInnerWidth;
    jest.clearAllMocks();
  });

  test("returns true when window.innerWidth < 768", () => {
    window.innerWidth = 600;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  test("returns false when window.innerWidth >= 768", () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
