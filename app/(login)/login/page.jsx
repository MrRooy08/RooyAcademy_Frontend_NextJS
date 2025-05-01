"use client"

import React from 'react'
import Login from "./Login"
import { ArrowLeft, Loader2, KeyRound, Mail } from "lucide-react";
import Link from 'next/link'

function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-pink-400 to-purple-400">
      <Login />
    </div>
  )
}

export default page