import React from "react";
import WelcomeBanner from "../../(route)/courses/_components/WelcomeBanner";
import DashBoard from "./_components/DashBoard";

function page() {
  return (
    <div className="grid sm:grid-cols-1 m-16">
      {/* banner */}
      <DashBoard />
    </div>
  );
}

export default page;
