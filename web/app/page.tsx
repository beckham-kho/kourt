import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    image: "/illustrations/sport-game.svg",
    description:
      "Jelajahi lapangan futsal, badminton, dan lain-lain yang tersedia di sekitarmu, lengkap dengan harga dan lokasi secara real-time.",
  },
  {
    image: "/illustrations/schedule.svg",
    description:
      "Pilih tanggal dan slot waktu, konfirmasi, selesai. Tidak perlu lagi telepon untuk cek ketersediaan.",
  },
  {
    image: "/illustrations/sport-tracking.svg",
    description:
      "Pantau jadwal bookingmu, lihat riwayat booking, dan dapatkan notifikasi. Semua dalam satu aplikasi.",
  },
];

const advantages = [
  {
    title: "Tanpa Ribet Kontak Lagi",
    description:
      "Tidak perlu lagi bolak-balik telepon untuk cek ketersediaan lapangan. Lihat jadwal secara real-time langsung di aplikasi.",
  },
  {
    title: "Harga Transparan",
    description:
      "Ketahui harga per jam secara pasti sejak awal, tanpa biaya tersembunyi saat sampai di lokasi.",
  },
  {
    title: "Untuk Pelanggan dan Pemilik Lapangan",
    description:
      "Kamu dapat booking atau mengelola lapanganmu sendiri, Kourt menyediakan layanan bagi kedua belah pihak.",
  },
  {
    title: "Selalu Up-to-date",
    description:
      "Jadwal lapangan diperbarui secara real-time, apa yang kamu lihat memang benar-benar tersedia.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <section className="grid md:grid-cols-2 h-[80dvh] md:h-[50dvh] lg:h-[80dvh] px-10 md:px-20 lg:px-30">
        <div className="gap-7 flex flex-col justify-center items-center md:items-start">
          <div className="flex flex-col gap-2 text-center md:text-left leading-tight">
            <h1 className="font-extrabold whitespace-nowrap text-[clamp(1.75rem,8.5vw,3.5rem)] md:text-4xl lg:text-6xl">
              Book Your Courts,
            </h1>
            <h1 className="font-extrabold whitespace-nowrap text-[clamp(1.75rem,8.5vw,3.5rem)] md:text-4xl lg:text-6xl">
              Own the Game
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Aplikasi sewa lapangan olahraga dalam genggamanmu
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="lg:text-lg lg:p-5"
              render={<Link href="/courts">Cari Lapangan</Link>}
            />
            <Button
              className="lg:text-lg lg:p-5"
              render={<Link href="/">Unduh Aplikasi</Link>}
            />
          </div>
        </div>
        <div className="items-center justify-center flex">
          <Image
            src="/illustrations/sport-family.svg"
            alt="https://storyset.com"
            width={400}
            height={300}
            className="w-full lg:w-2/3"
          />
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-14 items-center w-full bg-primary rounded-3xl px-5 md:px-10 lg:px-30 py-20">
          <h1 className="font-extrabold text-4xl md:text-4xl lg:text-5xl text-center px-5 text-primary-foreground">
            Olahraga Jadi Lebih Mudah
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card text-card-foreground rounded-2xl p-6 flex flex-col items-center gap-4 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-full aspect-4/3 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={feature.image}
                    alt="https://storyset.com"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-muted-foreground text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-10 lg:gap-15 items-center w-full px-5 md:px-10 lg:px-30 py-20">
          <h1 className="font-extrabold text-3xl md:text-4xl lg:text-5xl text-center">
            Mengapa Harus Kourt?
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
            {advantages.map((advantage) => (
              <div key={advantage.title} className="flex flex-col gap-2">
                <h3 className="font-bold text-xl">{advantage.title}</h3>
                <p className="text-muted-foreground">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-5 bg-primary rounded-t-3xl p-5 items-center">
          <h1 className="text-2xl lg:text-4xl font-semibold text-center text-primary-foreground  ">
            Sewa lapanganmu sekarang!
          </h1>
          <Button
            variant="secondary"
            className="w-1/2 lg:w-fit lg:text-lg lg:p-5"
            render={<Link href="/">Unduh Sekarang</Link>}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
