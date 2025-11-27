import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <div>
      <Link href={"/"}>
        <Image
          src={"/finanalyst-logo.png"}
          height={35}
          width={35}
          alt="app logo"
          className="object-contain rounded-full"
        />
      </Link>
    </div>
  );
};

export default Logo;
