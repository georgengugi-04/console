/** Small hand-authored Lottie (≈1.5 KB): an electric-blue ring draws, then a check mark. Played by DotLottie. */
export const successLottie = JSON.stringify({
  v: "5.7.0",
  fr: 60,
  ip: 0,
  op: 90,
  w: 120,
  h: 120,
  nm: "console-success",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "ring",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: -90 },
        p: { a: 0, k: [60, 60, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [88, 88] }, d: 1 },
            { ty: "st", c: { a: 0, k: [0.31, 0.64, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, lc: 2, lj: 2 },
            {
              ty: "tm",
              s: { a: 0, k: 0 },
              e: {
                a: 1,
                k: [
                  { t: 0, s: [0], i: { x: [0.2], y: [1] }, o: { x: [0.6], y: [0] } },
                  { t: 45, s: [100] },
                ],
              },
              o: { a: 0, k: 0 },
              m: 1,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: "ring-group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "check",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [60, 60, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                  v: [[-20, 2], [-6, 16], [22, -14]],
                  c: false,
                },
              },
            },
            { ty: "st", c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 }, lc: 2, lj: 2 },
            {
              ty: "tm",
              s: { a: 0, k: 0 },
              e: {
                a: 1,
                k: [
                  { t: 30, s: [0], i: { x: [0.2], y: [1] }, o: { x: [0.6], y: [0] } },
                  { t: 70, s: [100] },
                ],
              },
              o: { a: 0, k: 0 },
              m: 1,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: "check-group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0,
    },
  ],
});
