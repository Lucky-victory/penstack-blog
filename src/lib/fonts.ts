import { Rubik, Gabarito } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});
const karla = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-karla",
});
export const fonts = {
  rubik,
  karla,
};
