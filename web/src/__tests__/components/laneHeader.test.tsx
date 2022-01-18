import React from 'react';
import { LaneHeader } from '../../components/laneHeader';
import { customRender as render } from './test-utils';

test('コースの数に応じて、ヘッダを設定する', () => {
  const [{ getByText }] = render(<LaneHeader courseCount={9} />);
  [...Array(9)].forEach((_, _i) => {
    const i = _i + 1;
    expect(getByText(i.toString())).toBeTruthy();
  });
});
