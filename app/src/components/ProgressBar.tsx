import * as React from 'react'

type ProgressBarProps = {
  percent: number
}

export const ProgressBar = ({ percent }: ProgressBarProps): JSX.Element => (
  <div className="w-full">
    <div className="w-full bg-gray-200">
      <div className="bg-indigo-600 leading-none py-1 text-center text-white" style={{ width: `${percent}%` }}>
        <span className={percent < 25 ? 'ml-2' : ''}>{percent}%</span>
      </div>
    </div>
  </div>
)
