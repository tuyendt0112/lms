import React from 'react'
import { apiGetCategories } from '../apis/app'
import { useState, useEffect } from 'react'

const Sidebar = () => {

  const fetchCategories = async () => {
    const response = await apiGetCategories()
    console.log(response);
  }
  useEffect(() => {
    fetchCategories()
  }, [])
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar