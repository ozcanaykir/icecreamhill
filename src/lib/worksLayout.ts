// İşler grid'i: 12 kolon, satırlar sırayla 8+4, 4+4+4, 6+6 tekrar eder.
// Eksik kalan son satır boşluk bırakmasın diye satırı doldurur (tek kart 12, iki kart 6+6).
// Hem sunucu render'ında hem filtre sonrası istemcide kullanılır.

export type Cell = { span: number; ratio: string };

const ROWS: Cell[][] = [
  [{ span: 8, ratio: '3/2' }, { span: 4, ratio: '3/4' }],
  [{ span: 4, ratio: '1/1' }, { span: 4, ratio: '1/1' }, { span: 4, ratio: '1/1' }],
  [{ span: 6, ratio: '16/10' }, { span: 6, ratio: '16/10' }],
];

const FILL: Record<number, Cell[]> = {
  1: [{ span: 12, ratio: '21/9' }],
  2: [{ span: 6, ratio: '16/10' }, { span: 6, ratio: '16/10' }],
};

export function worksLayout(count: number): Cell[] {
  const cells: Cell[] = [];
  for (let r = 0; cells.length < count; r++) {
    const row = ROWS[r % ROWS.length];
    const left = count - cells.length;
    cells.push(...(left < row.length ? FILL[left] : row));
  }
  return cells;
}
