import React from "react";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const App = require(`../../${process.env.SOLUTION_PATH || ""}src/App`).default;

require("cross-fetch/polyfill");

describe("Album App", () => {
  it("sets and cleans up document title", () => {
    const { container, unmount } = render(<App />);

    expect(container.ownerDocument.title).toBe("Awesome Album App");

    unmount();

    expect(container.ownerDocument.title).not.toBe("Awesome Album App");
  });

  it("cancels pending API calls in cleanup", async () => {
    const abortHandler = jest.fn();

    const mockUsers = [
      {
        id: 5,
        name: "Huntley Jenkinson",
      },
    ];

    const mockFetch = jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(mockUsers) })
      );

    const { unmount } = render(<App />);

    await screen.findByText(/Huntley Jenkinson/i);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users",
      expect.objectContaining({
        signal: expect.any(Object),
      })
    );

    const signal = mockFetch.mock.calls[0][1].signal;

    signal.addEventListener("abort", abortHandler);

    expect(abortHandler).not.toHaveBeenCalled();

    unmount();

    expect(abortHandler).toHaveBeenCalled();
  });

  it("displays a list albums when user is selected", async () => {
    const mockUsers = [
      {
        id: 1,
        name: "Pieter Trulocke",
      },
      {
        id: 2,
        name: "Nanni Bramford",
      },
    ];

    const mockAlbums = [
      {
        id: 1,
        title: "Rosaceae",
      },
      {
        id: 2,
        title: "Bignoniaceae",
      },
      {
        id: 3,
        title: "Rhamnaceae",
      },
    ];

    const mockFetch = jest.spyOn(global, "fetch").mockImplementation((url) => {
      const mockData = url.includes("/users") ? mockUsers : mockAlbums;
      return Promise.resolve({ json: () => Promise.resolve(mockData) });
    });

    render(<App />);

    const userButton = await screen.findByText(/Nanni Bramford/i);

    await act(async () => {
      userButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mockFetch).toHaveBeenLastCalledWith(
      "https://jsonplaceholder.typicode.com/albums?userId=2",
      expect.objectContaining({
        signal: expect.any(Object),
      })
    );

    const album = await screen.findByText(/Bignoniaceae/i);
    expect(album).toBeTruthy();
  });
});
