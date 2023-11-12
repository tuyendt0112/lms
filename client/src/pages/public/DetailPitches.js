import React from 'react'
import { useParams } from 'react-router-dom'

const DetailPitches = () => {

  const { pid, title } = useParams()
  return (
    <div>DetailPitches</div>
  )
}

export default DetailPitches