import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import LocaleSwitcher from "./locale-switcher";
import { backLinkClassName } from "@/components/ui/styles";

export default function PageHeader({
  backTo,
  backLabel,
  className = "",
}: {
  backTo: string;
  backLabel: string;
  className?: string;
}) {
  return (
    <header className={`sticky top-0 z-20 -mx-[5vw] bg-ivory/90 px-[5vw] py-3 backdrop-blur-sm ${className}`}>
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6">
        <Link to={backTo} className={`${backLinkClassName} text-forest`}>
          <ArrowLeft size={15} /> {backLabel}
        </Link>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
