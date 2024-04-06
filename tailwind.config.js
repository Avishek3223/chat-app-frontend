/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{jsx,js.tsx,ts}"],
  theme: {
    extend: {
      screens: {
        max950: { max: "950px" },
        max980: { max: "980px" },
        max850: { max: "850px" },
        min536: { min: "536px" },
        min800: { min: "800px" },
        min1050: { min: "1050px" },
        max1008: { max: "1008px" },
        max478: { max: "478px" },
        max450: { max: "450px" },
        max406: { max: "406px" },

        max500: { max: "500px " },
        max600: { max: "600px" },
        min600: { min: "600px" },
        max1050: { max: "1050px" },
        max1350: { max: "1350px" },
        max1250: { max: "1250px" },
        max1920: { max: "1920px" },
        max1078: { max: "1078px" },
        max800: { max: "800px" },
        max536: { max: "536px" },
        xs: "1000px",
      },
      fontFamily: {
        roboto: "Roboto",
    },
   },
  },
  plugins: [],
}

