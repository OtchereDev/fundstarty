import { AgChartsReact } from 'ag-charts-react'
import { useState } from 'react'

export default function Line() {
  const [options, setOptions] = useState({
    title: {
      text: 'Analysis',
    },
    data: [
      {
        amount: 'Q1',
        income: 200,
        expenses: 100,
      },
      {
        amount: 'Q2',
        income: 300,
        expenses: 130,
      },
      {
        amount: 'Q3',
        income: 350,
        expenses: 160,
      },
      {
        amount: 'Q4',
        income: 400,
        expenses: 200,
      },
    ],
    series: [
      {
        type: 'line',
        xKey: 'amount',
        yKey: 'income',
        yName: 'Income',
        stroke: '#30aca5',
        marker: {
          fill: '#30aca5',
        },
      },
      {
        type: 'line',
        xKey: 'amount',
        yKey: 'expenses',
        yName: 'Expenses',
        stroke: '#ef6f87',
        marker: {
          fill: '#ef6f87',
        },
      },
    ],
  })
  return <AgChartsReact options={options as any} />
}
