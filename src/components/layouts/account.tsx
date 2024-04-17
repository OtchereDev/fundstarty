import React from "react";
import Footer from "../shared/Footer";
import NavBar from "../shared/NavBar";

export default function Account({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <NavBar />
      <div className="mx-auto max-w-[768px] lg:pb-20 lg:pt-20">{children}</div>
      <Footer />
    </main>
  );
}
