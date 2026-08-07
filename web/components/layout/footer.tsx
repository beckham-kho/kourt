import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Separator } from "../ui/separator";
import Image from "next/image";

const footerNav = [
  {
    value: "item-1",
    trigger: "Layanan",
    contents: [
      { label: "Lapangan", href: "/courts" },
      { label: "Event", href: "/events" },
    ],
  },
  {
    value: "item-2",
    trigger: "Info",
    contents: [
      { label: "FAQ", href: "/faq" },
      { label: "Panduan", href: "/guides" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: "/", icon: "/logo/instagram.svg" },
  { label: "X", href: "/", icon: "/logo/x.svg" },
  { label: "Facebook", href: "/", icon: "/logo/facebook.svg" },
  { label: "Discord", href: "/", icon: "/logo/discord.svg" },
];

export default function Footer() {
  return (
    <footer>
      <div className="w-full flex flex-col items-center gap-5 pt-7 pb-26 md:pb-0 lg:pt-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:px-10 lg:px-20">
          <div className="flex flex-col items-center md:items-start gap-5 info-social-media">
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo/logo-text-orange.png"
                alt="Kourt"
                width={350}
                height={100}
                className="w-30"
              />
            </Link>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="bg-primary rounded-full p-2 flex items-center shrink-0"
                >
                  <Image
                    src={social.icon}
                    alt={social.label}
                    width={64}
                    height={64}
                    className="w-7"
                  />
                </Link>
              ))}
            </div>

            <p className="text-muted-foreground text-center md:text-left text-sm px-3 md:px-0">
              Kourt adalah proyek pembelajaran developer. Seluruh data,
              lapangan, dan transaksi yang ditampilkan bersifat fiktif dan tidak
              untuk tujuan komersial.
            </p>
          </div>

          <Accordion className="w-full md:hidden">
            {footerNav.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="mb-2 font-semibold">
                  {item.trigger}
                </AccordionTrigger>
                <div className="flex flex-col gap-2">
                  {item.contents.map((content, index) => (
                    <AccordionContent key={`${item.value}-${index}`}>
                      <Link href={content.href}>{content.label}</Link>
                    </AccordionContent>
                  ))}
                </div>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="hidden md:grid grid-cols-2 gap-10">
            {footerNav.map((item) => (
              <div key={item.value} className="flex flex-col gap-3">
                <span className="font-semibold">{item.trigger}</span>
                <div className="flex flex-col gap-2">
                  {item.contents.map((content, index) => (
                    <Link
                      key={`${item.value}-${index}`}
                      href={content.href}
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      {content.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="w-full" />

        <p className="text-sm pb-5">
          &copy; {new Date().getFullYear()} Kourt. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
