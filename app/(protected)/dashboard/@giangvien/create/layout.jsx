"use client";

import React, { useState } from 'react';

const CreateLayout = ({ children }) => {

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className={`flex-1 transition-all duration-300 `}>
        {children}
      </main>
    </div>
  );
};

export default CreateLayout; 