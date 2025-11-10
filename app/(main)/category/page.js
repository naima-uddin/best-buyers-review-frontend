"use client";
import CategoryPage from '@/pages/CategoryPage/CategoryPage'
import React from 'react'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
    <CategoryPage/>
    </>
  )
}
