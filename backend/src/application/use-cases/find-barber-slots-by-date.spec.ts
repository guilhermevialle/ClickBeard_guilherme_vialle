import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import type { IBarberAvailabilityService } from "../../infra/interfaces/services/barber-availability-service.interface";
import { FindBarberSlotsByDate } from "./find-barber-slots-by-date";

describe("FindBarberSlotsByDate Use-Case", () => {
  let barberAvailabilityServiceMock: Mocked<IBarberAvailabilityService>;
  let findBarberSlots: FindBarberSlotsByDate;

  beforeEach(() => {
    barberAvailabilityServiceMock = {
      findAvailableSlotsByBarberIdAndDate: vi.fn(),
    } as unknown as Mocked<IBarberAvailabilityService>;

    findBarberSlots = new FindBarberSlotsByDate(barberAvailabilityServiceMock);
  });

  it("should call barberAvailabilityService with correct parameters and return slots", async () => {
    const date = new Date("2025-09-05T10:00:00Z");
    const mockSlots = ["09:00", "10:00", "11:00"];
    barberAvailabilityServiceMock.findAvailableSlotsByBarberIdAndDate.mockResolvedValue(
      mockSlots as any
    );

    const slots = await findBarberSlots.execute({ barberId: "b-1", date });

    expect(
      barberAvailabilityServiceMock.findAvailableSlotsByBarberIdAndDate
    ).toHaveBeenCalledWith("b-1", date);
    expect(slots).toEqual(mockSlots);
  });
});
