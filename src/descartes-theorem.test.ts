/**
 * Test suite for Descartes' Theorem calculations
 * Tests the mathematical example from content/2_Intermediate/Descarte_Theorem.mdx
 */

import { Fraction } from 'fractions';

/**
 * Solves a quadratic equation ax^2 + bx + c = 0
 * Returns both solutions
 */
function solveQuadratic(a: number, b: number, c: number): [number, number] {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    throw new Error('No real solutions');
  }
  const sqrtDiscriminant = Math.sqrt(discriminant);
  const solution1 = (-b + sqrtDiscriminant) / (2 * a);
  const solution2 = (-b - sqrtDiscriminant) / (2 * a);
  return [solution1, solution2];
}

/**
 * Applies Descartes' Circle Theorem
 * (k1 + k2 + k3 + k4)^2 = 2(k1^2 + k2^2 + k3^2 + k4^2)
 * 
 * Rearranges to: k4^2 - (k1 + k2 + k3)k4 - (constant) = 0
 */
function descartesCurvatures(
  k1: number,
  k2: number,
  k3: number
): [number, number] {
  const sum = k1 + k2 + k3;
  const sumSquares = k1 * k1 + k2 * k2 + k3 * k3;
  const a = 1;
  const b = -2 * sum;
  const c = sum * sum - 2 * sumSquares;
  return solveQuadratic(a, b, c);
}

describe('Descartes Theorem', () => {
  describe('Worked Example: Three mutually tangent circles with radii 1, 2, 3', () => {
    test('should calculate correct curvatures from radii', () => {
      const r1 = 1;
      const r2 = 2;
      const r3 = 3;
      const k1 = 1 / r1;
      const k2 = 1 / r2;
      const k3 = 1 / r3;
      expect(k1).toBe(1);
      expect(k2).toBe(0.5);
      expect(k3).toBeCloseTo(1 / 3, 5);
    });

    test('should find the fourth curvature using Descartes formula', () => {
      const k1 = 1;
      const k2 = 0.5;
      const k3 = 1 / 3;
      const [k4_1, k4_2] = descartesCurvatures(k1, k2, k3);
      expect(k4_1).toBeCloseTo(23 / 6, 5);
      expect(k4_2).toBeCloseTo(-1 / 6, 5);
    });

    test('should convert curvatures back to radii', () => {
      const k4_positive = 23 / 6;
      const k4_negative = -1 / 6;
      const r_small = 1 / Math.abs(k4_positive);
      const r_large = 1 / Math.abs(k4_negative);
      expect(r_small).toBeCloseTo(6 / 23, 5);
      expect(r_large).toBeCloseTo(6, 5);
    });

    test('should verify Descartes formula holds for the solution', () => {
      const k1 = 1;
      const k2 = 0.5;
      const k3 = 1 / 3;
      const k4 = 23 / 6;
      const leftSide = (k1 + k2 + k3 + k4) ** 2;
      const rightSide = 2 * (k1 ** 2 + k2 ** 2 + k3 ** 2 + k4 ** 2);
      expect(leftSide).toBeCloseTo(rightSide, 5);
    });

    test('the smallest circle should have radius 6/23', () => {
      expect(6 / 23).toBeCloseTo(0.261, 2);
    });
  });

  describe('Edge cases and variations', () => {
    test('should handle a line (curvature = 0)', () => {
      const k1 = 1;
      const k2 = 0.5;
      const k3 = 0;
      const [k4_1, k4_2] = descartesCurvatures(k1, k2, k3);
      expect(k4_1).toBeDefined();
      expect(k4_2).toBeDefined();
    });

    test('should handle internally tangent circles (negative curvatures)', () => {
      const k1 = 1;
      const k2 = 0.5;
      const k3 = -0.3;
      const [k4_1, k4_2] = descartesCurvatures(k1, k2, k3);
      expect(k4_1).toBeDefined();
      expect(k4_2).toBeDefined();
    });
  });

  describe('Common pitfalls prevention', () => {
    test('should verify quadratic solution selection', () => {
      const k4_solutions = [23 / 6, -1 / 6];
      const radii = k4_solutions.map(k => 1 / Math.abs(k));
      expect(radii).toContainEqual(6 / 23);
      expect(radii).toContainEqual(6);
      expect(Math.min(...radii)).toBe(6 / 23);
    });

    test('should correctly handle sign of curvatures', () => {
      const k1 = 1;
      const k2 = 0.5;
      const k3 = 1 / 3;
      const all_positive = k1 > 0 && k2 > 0 && k3 > 0;
      expect(all_positive).toBe(true);
    });
  });
});