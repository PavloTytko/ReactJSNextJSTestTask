import { dateFull, dateRelative } from "./date";

describe("utils/date", () => {
  test("dateFull formats ISO string", () => {
    const iso = "2024-01-02T03:04:05.000Z";
    const out = dateFull(iso);
    expect(out).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  });

  test("dateFull returns input on parse error", () => {
    const bad = "not-a-date";
    expect(dateFull(bad)).toBe(bad);
  });

  test("dateRelative returns human-friendly string or input on error", () => {
    const iso = new Date().toISOString();
    const rel = dateRelative(iso);
    expect(typeof rel).toBe("string");
    expect(rel.length).toBeGreaterThan(0);

    const bad = "not-a-date";
    expect(dateRelative(bad)).toBe(bad);
  });
});
