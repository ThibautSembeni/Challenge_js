const cron = require("node-cron");
const CronService = require("../../utils/cron");
const CartService = require("../../services/cart");

jest.mock("node-cron");
jest.mock("../../services/cart");

describe("Test CronService", () => {
  test("should start the cron job and call CartService.removeExpiredItemsFromAllCarts", () => {
    const cartServiceMock = {
      removeExpiredItemsFromAllCarts: jest.fn().mockResolvedValueOnce(),
    };

    CartService.mockImplementation(() => cartServiceMock);

    const cronService = CronService();
    cronService.start();

    expect(cron.schedule).toHaveBeenCalledWith(
      "*/30 * * * *",
      expect.any(Function)
    );

    const scheduledFunction = cron.schedule.mock.calls[0][1];
    scheduledFunction();

    expect(cartServiceMock.removeExpiredItemsFromAllCarts).toHaveBeenCalled();
  });
});
