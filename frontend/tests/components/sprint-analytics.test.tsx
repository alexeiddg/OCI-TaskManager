import { render, screen, waitFor } from "@testing-library/react";
import { SprintAnalyticsDashboard } from "@/components/sprint-analytics"; // Ajusta la ruta
import { useSession } from "next-auth/react"; // Mockear el hook de sesión
import { fetchKpiDto, fetchTeamKpiDto } from "@/server/api/kpi/getKpis"; // Mock de funciones de fetch
import { fetchSprintAnalytics } from "@/server/api/sprint/getSprintAnalytics";
import HelloWorld from "@/components/HelloWorld";

// jest.mock("next-auth/react", () => ({
//   useSession: jest.fn(),
// }));

// jest.mock("@/server/api/kpi/getKpis", () => ({
//   fetchKpiDto: jest.fn(),
//   fetchTeamKpiDto: jest.fn(),
// }));

// jest.mock("@/server/api/sprint/getSprintAnalytics", () => ({
//   fetchSprintAnalytics: jest.fn(),
// }));

describe("HelloWorld Component", () => {
  it("renders Hello, World! text", () => {
    render(<HelloWorld />);
    const element = screen.getByText(/Hello, World!/i);
    expect(element).toBeInTheDocument();
  });
});

// describe("SprintAnalyticsDashboard", () => {
//   beforeEach(() => {
//     // Mocks de las funciones
//     (fetchKpiDto as jest.Mock).mockResolvedValueOnce({
//       /* tus datos mockeados aquí */
//     });
//     (fetchTeamKpiDto as jest.Mock).mockResolvedValueOnce({
//       /* tus datos mockeados aquí */
//     });
//     (fetchSprintAnalytics as jest.Mock).mockResolvedValueOnce({
//       /* los datos mockeados de sprint analytics */
//     });
//   });

//   it("muestra un loader mientras los datos se cargan", () => {
//     useSession.mockReturnValue({
//       data: { user: { id: 1, teamId: 2 } },
//     });
//     fetchKpiDto.mockResolvedValue({}); // Mock de datos de KPIs
//     fetchTeamKpiDto.mockResolvedValue({}); // Mock de datos de teamKPI
//     fetchSprintAnalytics.mockResolvedValue({ tasks: [] }); // Mock de datos de sprint analytics

//     render(<SprintAnalyticsDashboard />);

//     // Esperamos que el loader se muestre mientras se cargan los datos
//     expect(
//       screen.getByText(/Please wait while we load your analytics/)
//     ).toBeInTheDocument();
//   });

//   it("carga los datos correctamente y renderiza el dashboard", async () => {
//     useSession.mockReturnValue({
//       data: { user: { id: 1, teamId: 2 } },
//     });
//     const mockKpiData = { totalTasks: 10, completedTasks: 5 }; // Mock de KPIs
//     const mockTeamKpiData = { totalTeamTasks: 20 }; // Mock de teamKPIs
//     const mockSprintAnalytics = { tasks: [] }; // Mock de Sprint Analytics

//     fetchKpiDto.mockResolvedValue(mockKpiData);
//     fetchTeamKpiDto.mockResolvedValue(mockTeamKpiData);
//     fetchSprintAnalytics.mockResolvedValue(mockSprintAnalytics);

//     render(<SprintAnalyticsDashboard />);

//     // Esperar a que los datos se hayan cargado y comprobar la presencia de elementos
//     await waitFor(() => {
//       expect(
//         screen.queryByText(/Please wait while we load your analytics/)
//       ).not.toBeInTheDocument();
//       // Asegúrate de que los datos se han mostrado correctamente
//       expect(screen.getByText(/Total Tasks/)).toBeInTheDocument(); // Usa un texto clave para verificar si el render está correcto
//     });
//   });
// });
