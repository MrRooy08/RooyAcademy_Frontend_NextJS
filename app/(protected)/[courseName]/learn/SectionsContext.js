'use client'

import { createContext, useContext } from 'react'

export const SectionsContext = createContext([])
export const useSections = () => useContext(SectionsContext)
