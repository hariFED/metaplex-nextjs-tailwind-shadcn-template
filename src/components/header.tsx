"use client";

import dynamic from "next/dynamic";
import ThemeSwitcher from "./themeSwitcher";
import { createTreeMerkle } from "@/lib/merkeltree/createmerkeltree";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Header = () => {
  return (
    <div className="z-10 w-full max-w-7xl my-16 items-center justify-between  text-sm lg:flex">
      <div className="flex gap-10  w-full justify-center items-center  bg-background   pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto    lg:p-4">
        <span>
          <Image
            src="/logo.png"
            alt="Fans Only Logo"
            width={60}
            height={60}
            className="inline-block"

          />
        </span>
        <div className="flex items-center font-bold gap-10 text-lg">
          <div className=" hover:text-[#1b62ff]  duration-500 cursor-pointer">
            How it works?
          </div>
          <div className=" hover:text-[#1b62ff]  duration-500 cursor-pointer">
            Privacy Polices
          </div>
        </div>
      </div>

      <div className="flex pt-4 lg:pt-0 w-full items-center justify-center gap-4 lg:static lg:size-auto lg:bg-none">
        {/* <WalletMultiButtonDynamic /> */}
        <Link href='/auth/signin'>
          <Button className="py-5 px-10">Login</Button>
        </Link>
        <ThemeSwitcher />
        {/* <button onClick={createTreeMerkle}>Create Tree Merkle</button> */}
      </div>
    </div>
  );
};

export default Header;
