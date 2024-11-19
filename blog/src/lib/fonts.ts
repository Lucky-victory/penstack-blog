import { Rubik, Karla, Fira_Sans } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});
const karla = Fira_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-karla",
});
export const fonts = {
  rubik,
  karla,
};
