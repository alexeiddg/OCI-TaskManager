import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile Hook", () => {
  const MOBILE_BREAKPOINT = 768;

  beforeEach(() => {
    // Mock de `window.matchMedia`
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query.includes(`max-width: ${MOBILE_BREAKPOINT - 1}px`),
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });

  it("debería retornar `true` si el ancho de la ventana es menor al breakpoint móvil", () => {
    // Simular un ancho de ventana menor al breakpoint móvil
    global.innerWidth = 500;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("debería retornar `false` si el ancho de la ventana es mayor o igual al breakpoint móvil", () => {
    // Simular un ancho de ventana mayor al breakpoint móvil
    global.innerWidth = 1024;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("debería actualizarse correctamente cuando cambia el tamaño de la ventana", () => {
    const addEventListenerMock = jest.fn();
    const removeEventListenerMock = jest.fn();

    // Mock de `window.matchMedia` con listeners
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query.includes(`max-width: ${MOBILE_BREAKPOINT - 1}px`),
        media: query,
        onchange: null,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
      })),
    });

    const { result } = renderHook(() => useIsMobile());

    // Simular un cambio en el tamaño de la ventana
    act(() => {
      global.innerWidth = 500;
      addEventListenerMock.mock.calls[0][1](); // Llamar al listener de cambio
    });

    expect(result.current).toBe(true);

    act(() => {
      global.innerWidth = 1024;
      addEventListenerMock.mock.calls[0][1](); // Llamar al listener de cambio
    });

    expect(result.current).toBe(false);
  });

  it("debería limpiar el listener al desmontar el hook", () => {
    const addEventListenerMock = jest.fn();
    const removeEventListenerMock = jest.fn();

    // Mock de `window.matchMedia` con listeners
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query.includes(`max-width: ${MOBILE_BREAKPOINT - 1}px`),
        media: query,
        onchange: null,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
      })),
    });

    const { unmount } = renderHook(() => useIsMobile());

    // Desmontar el hook
    unmount();

    // Verificar que se llamó a `removeEventListener`
    expect(removeEventListenerMock).toHaveBeenCalled();
  });
});