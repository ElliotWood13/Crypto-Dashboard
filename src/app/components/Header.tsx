import Image from "next/image";
import Logo from "../e-wallet.png";

export const Header = () => {
  return (
    <header className="flex gap-2 py-4">
      <div className="flex gap-2 items-center">
        <Image src={Logo} alt="ethWallet Logo" height={70} width={70} />
      </div>
    </header>
  );
};
